import React, { useEffect, createContext, useState, useMemo } from "react";
import { BigNumber, ethers, Signer } from "ethers";
import { convertHexToNumber } from "utils";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { IWalletInfo, ITx, IPersistTxs } from "types";
import { useToasty, useWallet } from "pegasys-services";
import { UseENS } from "hooks";
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
	provider:
		| ethers.providers.Provider
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| Signer
		| undefined;
	signer: Signer | undefined;
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
	votersType: string;
	setVotersType: React.Dispatch<React.SetStateAction<string>>;
	votesLocked: boolean;
	setVotesLocked: React.Dispatch<React.SetStateAction<boolean>>;
	delegatedTo: string;
	setDelegatedTo: React.Dispatch<React.SetStateAction<string>>;
	walletAddress: string;
	currentNetworkChainId: number;
	isConnected: boolean;
	setCurrentLpAddress: React.Dispatch<React.SetStateAction<string>>;
	currentLpAddress: string;
	currentSummary: string;
	setCurrentSummary: React.Dispatch<React.SetStateAction<string>>;
}

export const WalletContext = createContext({} as IWeb3);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [walletError, setWalletError] = useState<boolean>(false);
	const [signer, setSigner] = useState<Signer>();
	const [connecting, setConnecting] = useState<boolean>(false);
	const [votesLocked, setVotesLocked] = useState<boolean>(true);
	const [votersType, setVotersType] = useState<string>("");
	const [delegatedTo, setDelegatedTo] = useState<string>("");
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
	const [currentLpAddress, setCurrentLpAddress] = useState<string>("");
	const [currentSummary, setCurrentSummary] = useState<string>("");

	const [approvalState, setApprovalState] = useState<IApprovalState>({
		status: ApprovalState.UNKNOWN,
		type: "",
	});
	const { toast } = useToasty();
	const {
		isConnected,
		address,
		chainId,
		connect,
		setChainId,
		setIsConnected,
		setAddress,
	} = useWallet();

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
		chainId === 5700
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

	const defaultActionsWhenConnectWallet = async () => {
		await connect();
		getSignerIfConnected();
		setWalletError(false);
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
		if (approvalState.status === ApprovalState.PENDING && isConnected) {
			const timer = setInterval(async () => {
				const getTx = await fetch(
					`${rpcUrl}?module=account&action=pendingtxlist&address=${address}`
				).then(result => result.json());
				const hash = `${currentTxHash}`;
				const summary = `${currentSummary}`;
				const storageSummary = localStorage.getItem("currentSummary");

				setPendingTxLength(Number(getTx?.result?.length));
				provider?.getTransaction(hash).then(result => {
					localStorage.setItem(
						"txs",
						JSON.stringify({
							...JSON.parse(`${localStorage.getItem("txs")}`),
							[result.hash]: {
								...result,
								summary: storageSummary || summary,
								chainId,
								txType: approvalState.type,
								finished: false,
							},
						})
					);
					if (
						result.from.toLowerCase() === address.toLowerCase() &&
						result.confirmations !== 0
					) {
						setTransactions(prevTransactions => ({
							...prevTransactions,
							[Number(chainId)]: {
								...prevTransactions[chainId === 57 ? 57 : 5700],
								[hash]: {
									...prevTransactions[chainId === 57 ? 57 : 5700][hash],
									...result,
									chainId,
									summary: storageSummary || summary,
									txType: approvalState.type,
									finished: true,
									hash,
								},
							},
						}));
						setPendingTxLength(Number(getTx?.result?.length));
						setApprovalState({
							status: ApprovalState.APPROVED,
							type: approvalState.type,
						});
						localStorage.setItem(
							"txs",
							JSON.stringify({
								...JSON.parse(`${localStorage.getItem("txs")}`),
								[result.hash]: {
									...result,
									summary: storageSummary || summary,
									finished: true,
								},
							})
						);
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
	}, [approvalState, currentTxHash]);

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
		const persistTxs: IPersistTxs = JSON.parse(
			`${localStorage.getItem("txs")}`
		);
		if (persistTxs && isConnected) {
			Object.values(persistTxs).map(tx => {
				if (tx.finished === false) {
					setTransactions(prevState => ({
						...prevState,
						[chainId]: {
							...prevState[tx.chainId === 57 ? 57 : 5700],
							[tx.hash]: tx,
						},
					}));
					setApprovalState({
						status: ApprovalState.PENDING,
						type: `${tx.txType}`,
					});
					setCurrentTxHash(tx.hash);
					return null;
				}
				setTransactions(prevState => ({
					...prevState,
					[chainId]: {
						...prevState[tx.chainId === 57 ? 57 : 5700],
						[tx.hash]: tx,
					},
				}));
				return null;
			});
		}
	}, [isConnected]);

	useEffect(() => {
		if (currentTxHash) localStorage.setItem("currentTxHash", currentTxHash);
		if (currentSummary) localStorage.setItem("currentSummary", currentSummary);
	}, [currentTxHash, currentSummary]);

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
			setChainId(convertedChainId);
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
	}, [chainId]);

	const providerValue = useMemo(
		() => ({
			walletAddress: address,
			currentNetworkChainId: chainId,
			isConnected,
			provider,
			signer,
			connectWallet,
			walletError,
			setWalletError,
			setConnectorSelected,
			connectorSelected,
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
			votersType,
			setVotersType,
			votesLocked,
			setVotesLocked,
			delegatedTo,
			setDelegatedTo,
			currentLpAddress,
			setCurrentLpAddress,
			currentSummary,
			setCurrentSummary,
		}),
		[
			provider,
			signer,
			connectWallet,
			walletError,
			connectorSelected,
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
