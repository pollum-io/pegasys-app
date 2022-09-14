import React, { useEffect, createContext, useState, useMemo } from "react";
import { BigNumber, ethers, Signer } from "ethers";
import { convertHexToNumber } from "utils";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { IWalletInfo, ITx } from "types";
import { UseENS, useToasty } from "hooks";
import {
	INITIAL_ALLOWED_SLIPPAGE,
	SYS_TESTNET_CHAIN_PARAMS,
	NEVM_CHAIN_PARAMS,
	SUPPORTED_NETWORK_CHAINS,
	DEFAULT_DEADLINE_FROM_NOW,
} from "../helpers/consts";

export enum ApprovalState {
	UNKNOWN,
	NOT_APPROVED,
	PENDING,
	APPROVED,
}
export interface IApprovalState {
	status: ApprovalState;
	type: string;
}

export interface ISubmittedAproval {
	status: boolean;
	tokens: string[];
	currentTokenToApprove?: string;
}

interface IWeb3 {
	isConnected: boolean;
	currentNetworkChainId: number | null;
	provider:
		| ethers.providers.Provider
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| Signer
		| undefined;
	signer: Signer | undefined;
	setCurrentNetworkChainId: React.Dispatch<React.SetStateAction<number | null>>;
	walletAddress: string;
	connectWallet: (connector: AbstractConnector) => Promise<void>;
	walletError: boolean;
	setWalletError: React.Dispatch<React.SetStateAction<boolean>>;
	connectorSelected: IWalletInfo | undefined;
	setConnectorSelected: React.Dispatch<
		React.SetStateAction<IWalletInfo | undefined>
	>;
	connecting: boolean;
	setConnecting: React.Dispatch<React.SetStateAction<boolean>>;
	expert: boolean;
	setExpert: React.Dispatch<React.SetStateAction<boolean>>;
	otherWallet: boolean;
	setOtherWallet: React.Dispatch<React.SetStateAction<boolean>>;
	userTransactionDeadlineValue: BigNumber | number;
	setUserTransactionDeadlineValue: React.Dispatch<
		React.SetStateAction<BigNumber | number>
	>;
	userSlippageTolerance: number;
	setUserSlippageTolerance: React.Dispatch<React.SetStateAction<number>>;
	setTransactions: React.Dispatch<React.SetStateAction<ITx>>;
	transactions: ITx;
	setApprovalState: React.Dispatch<React.SetStateAction<IApprovalState>>;
	approvalState: IApprovalState;
	setApprovalSubmitted: React.Dispatch<React.SetStateAction<ISubmittedAproval>>;
	approvalSubmitted: ISubmittedAproval;
	setCurrentTxHash: React.Dispatch<React.SetStateAction<string>>;
	currentTxHash: string;
	currentInputTokenName: string;
	setCurrentInputTokenName: React.Dispatch<React.SetStateAction<string>>;
	isGovernance: boolean;
	setIsGovernance: React.Dispatch<React.SetStateAction<boolean>>;
	setPendingTxLength: React.Dispatch<React.SetStateAction<number>>;
	pendingTxLength: number;
	showCancelled: boolean;
	setShowCancelled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WalletContext = createContext({} as IWeb3);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [currentNetworkChainId, setCurrentNetworkChainId] = useState<
		number | null
	>(null);
	const [walletAddress, setAddress] = useState("");
	const [walletError, setWalletError] = useState<boolean>(false);
	const [signer, setSigner] = useState<Signer>();
	const [connecting, setConnecting] = useState<boolean>(false);
	const [provider, setProvider] = useState<
		ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
	>();
	const [connectorSelected, setConnectorSelected] = useState<IWalletInfo>();
	const [expert, setExpert] = useState<boolean>(false);
	const [otherWallet, setOtherWallet] = useState<boolean>(false);
	const [userTransactionDeadlineValue, setUserTransactionDeadlineValue] =
		useState<BigNumber | number>(DEFAULT_DEADLINE_FROM_NOW);
	const [showCancelled, setShowCancelled] = useState<boolean>(false);
	const [isGovernance, setIsGovernance] = useState<boolean>(false);
	const [userSlippageTolerance, setUserSlippageTolerance] = useState<number>(
		INITIAL_ALLOWED_SLIPPAGE
	);
	const [approvalSubmitted, setApprovalSubmitted] = useState<ISubmittedAproval>(
		{ status: false, tokens: [], currentTokenToApprove: "" }
	);
	const [currentTxHash, setCurrentTxHash] = useState<string>("");
	const [currentInputTokenName, setCurrentInputTokenName] =
		useState<string>("");
	const [transactions, setTransactions] = useState<ITx>({
		57: {},
		5700: {},
	});
	const [pendingTxLength, setPendingTxLength] = useState<number>(0);

	const [approvalState, setApprovalState] = useState<IApprovalState>({
		status: ApprovalState.UNKNOWN,
		type: "",
	});
	const { toast } = useToasty();

	const connectToSysRpcIfNotConnected = () => {
		const rpcProvider = new ethers.providers.JsonRpcProvider(
			Number(window?.ethereum?.networkVersion) === 57
				? NEVM_CHAIN_PARAMS.rpcUrls[0]
				: SYS_TESTNET_CHAIN_PARAMS.rpcUrls[0]
		);
		setProvider(rpcProvider);

		const rpcSigner = rpcProvider.getSigner();

		setSigner(rpcSigner);
	};
	const rpcUrl =
		currentNetworkChainId === 5700
			? "https://tanenbaum.io/api"
			: "https://explorer.syscoin.org/api";

	const getSignerIfConnected = async () => {
		const web3Provider = new ethers.providers.Web3Provider(
			window.ethereum,
			"any"
		);

		await web3Provider.send("eth_requestAccounts", []);

		const web3Signer = web3Provider.getSigner();

		setProvider(web3Provider);
		setSigner(web3Signer);
	};

	const defaultActionsWhenConnectWallet = () => {
		setIsConnected(!!window?.ethereum?.selectedAddress);
		setAddress(UseENS(window?.ethereum?.selectedAddress).address as string);
		getSignerIfConnected();
		setWalletError(false);
		setCurrentNetworkChainId(Number(window?.ethereum?.networkVersion));
	};

	const connectWallet = async (connector: AbstractConnector) => {
		connector
			.activate()
			.then(() => {
				if (
					SUPPORTED_NETWORK_CHAINS.includes(
						Number(window?.ethereum?.networkVersion)
					)
				) {
					defaultActionsWhenConnectWallet();
				} else {
					setWalletError(true);
				}
			})
			.catch(error => {
				if (
					String(error).includes("The user rejected the request.") ||
					String(error).includes("Metamask not installed")
				) {
					setConnecting(false);
				}
				if (
					String(error).includes("accounts received is empty") ||
					String(error).includes("User denied account authorization")
				) {
					setConnecting(false);
				}
			});
	};

	useMemo(() => {
		if (approvalState.status === ApprovalState.PENDING) {
			const timer = setInterval(async () => {
				const getTx = await fetch(
					`${rpcUrl}?module=account&action=pendingtxlist&address=${walletAddress}`
				).then(result => result.json());

				const hash = `${currentTxHash}`;
				setPendingTxLength(Number(getTx?.result?.length));
				provider?.getTransaction(hash).then(result => {
					if (
						result.from.toLowerCase() === walletAddress.toLowerCase() &&
						result.confirmations !== 0
					) {
						setTransactions({
							...transactions,
							[Number(currentNetworkChainId)]: {
								...transactions[currentNetworkChainId === 57 ? 57 : 5700],
								[hash]: {
									...transactions[currentNetworkChainId === 57 ? 57 : 5700][
										hash
									],
									...result,
									hash,
								},
							},
						});
						setPendingTxLength(Number(getTx?.result?.length));
						setApprovalState({
							status: ApprovalState.APPROVED,
							type: approvalState.type,
						});
						if (approvalState.type === "approve-swap") {
							setApprovalSubmitted(prevState => ({
								...prevState,
								tokens: prevState.tokens.filter(
									token => token !== `${currentInputTokenName}`
								),
							}));
						}
						clearInterval(timer);
						// eslint-disable-next-line
						return;
					}
				});
			}, 10000);
		}
	}, [approvalState]);

	useEffect(() => {
		if (approvalState.status === ApprovalState.APPROVED) {
			toast({
				title: "Transaction completed successfully.",
				status: "success",
			});
		}

		if (
			approvalState.type === "approve-swap" &&
			approvalState.status === ApprovalState.APPROVED &&
			approvalSubmitted.tokens.length === 0
		) {
			setApprovalSubmitted(prevState => ({
				...prevState,
				status: false,
			}));
		}
	}, [approvalState]);

	useEffect(() => {
		const initialSubmittedValue: ISubmittedAproval = JSON.parse(
			`${localStorage.getItem("approvalSubmitted")}`
		);
		if (initialSubmittedValue) {
			setApprovalSubmitted(initialSubmittedValue);
		}
	}, []);

	useEffect(() => {
		if (approvalSubmitted && approvalState.status !== ApprovalState.UNKNOWN) {
			localStorage.setItem(
				"approvalSubmitted",
				JSON.stringify(approvalSubmitted)
			);
		}
	}, [approvalSubmitted]);

	useMemo(async () => {
		if (!connectorSelected) return;

		const getCurrentConnectorProvider =
			await connectorSelected?.connector?.getProvider();

		getCurrentConnectorProvider?.on("chainChanged", (chainId: string) => {
			const convertedChainId = convertHexToNumber(chainId);
			setCurrentNetworkChainId(convertedChainId);
			setWalletError(
				Boolean(SUPPORTED_NETWORK_CHAINS.includes(convertedChainId))
			);
		});

		getCurrentConnectorProvider?.on("accountsChanged", () =>
			defaultActionsWhenConnectWallet()
		);
	}, [connectorSelected]);

	useEffect(() => {
		const verifySysNetwork =
			window?.ethereum?.selectedAddress &&
			SUPPORTED_NETWORK_CHAINS.includes(
				Number(window?.ethereum?.networkVersion)
			);

		if (!isConnected) {
			connectToSysRpcIfNotConnected();
		}

		if (connectorSelected) {
			setIsConnected(
				verifySysNetwork ? !!window?.ethereum?.selectedAddress : false
			);
			setAddress(
				verifySysNetwork
					? (UseENS(window?.ethereum?.selectedAddress).address as string)
					: ""
			);
			setWalletError(!verifySysNetwork);
		}

		if (isConnected && verifySysNetwork) {
			getSignerIfConnected();
		}
	}, [currentNetworkChainId]);

	const providerValue = useMemo(
		() => ({
			isConnected,
			walletAddress,
			provider,
			signer,
			connectWallet,
			walletError,
			setWalletError,
			setConnectorSelected,
			connectorSelected,
			currentNetworkChainId,
			setCurrentNetworkChainId,
			connecting,
			setConnecting,
			setExpert,
			expert,
			otherWallet,
			setOtherWallet,
			userTransactionDeadlineValue,
			setUserTransactionDeadlineValue,
			userSlippageTolerance,
			setUserSlippageTolerance,
			transactions,
			setTransactions,
			approvalState,
			setApprovalState,
			approvalSubmitted,
			setApprovalSubmitted,
			currentTxHash,
			setCurrentTxHash,
			currentInputTokenName,
			setCurrentInputTokenName,
			isGovernance,
			setIsGovernance,
			setPendingTxLength,
			pendingTxLength,
			showCancelled,
			setShowCancelled,
		}),
		[
			isConnected,
			walletAddress,
			provider,
			signer,
			connectWallet,
			walletError,
			connectorSelected,
			currentNetworkChainId,
			expert,
			otherWallet,
			userTransactionDeadlineValue,
			userSlippageTolerance,
			transactions,
			approvalState,
			approvalSubmitted,
			currentTxHash,
			isGovernance,
			pendingTxLength,
			showCancelled,
		]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
