import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers, Signer } from "ethers";
import { convertHexToNumber, isAddress } from "utils";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { IWalletInfo } from "types";
import { useToasty } from "hooks";
import {
	INITIAL_ALLOWED_SLIPPAGE,
	SYS_TESTNET_CHAIN_PARAMS,
	NEVM_CHAIN_PARAMS,
	SUPPORTED_NETWORK_CHAINS,
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
	userSlippageTolerance: number;
	setUserSlippageTolerance: React.Dispatch<React.SetStateAction<number>>;
	setTransactions: React.Dispatch<React.SetStateAction<object>>;
	transactions: object;
	setApprovalState: React.Dispatch<React.SetStateAction<IApprovalState>>;
	approvalState: IApprovalState;
	isGovernance: boolean;
	setIsGovernance: React.Dispatch<React.SetStateAction<boolean>>;
	setPendingTxLength: React.Dispatch<React.SetStateAction<number>>;
	pendingTxLength: number;
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
	const [isGovernance, setIsGovernance] = useState<boolean>(false);
	const [userSlippageTolerance, setUserSlippageTolerance] = useState<number>(
		INITIAL_ALLOWED_SLIPPAGE
	);
	const [transactions, setTransactions] = useState<object>({
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
		setAddress(isAddress(window?.ethereum?.selectedAddress));
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
				} else {
					console.log(error);
				}
			});
	};

	useMemo(() => {
		if (approvalState.status === ApprovalState.PENDING) {
			const timer = setInterval(async () => {
				const result = await fetch(
					`${rpcUrl}?module=account&action=pendingtxlist&address=${walletAddress}`
				).then(result => result.json());
				if (result?.result[0]) {
					const hash: string = result?.result[0]?.hash;
					setPendingTxLength(Number(result?.result?.length));
					provider?.getTransaction(hash).then(result => {
						if (
							result.from.toLowerCase() === walletAddress.toLowerCase() &&
							result.confirmations !== 0
						) {
							setTransactions({
								...transactions,
								[currentNetworkChainId]: {
									...transactions[currentNetworkChainId],
									[hash]: {
										...transactions[currentNetworkChainId][hash],
										...result,
										hash,
									},
								},
							});
							setPendingTxLength(Number(result?.result?.length));
							setApprovalState({
								status: ApprovalState.APPROVED,
								type: approvalState.type,
							});
							clearInterval(timer);
							// eslint-disable-next-line
							return;
						}
					});
				}
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
	}, [approvalState]);

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
				verifySysNetwork ? isAddress(window?.ethereum?.selectedAddress) : ""
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
			userSlippageTolerance,
			setUserSlippageTolerance,
			transactions,
			setTransactions,
			approvalState,
			setApprovalState,
			isGovernance,
			setIsGovernance,
			setPendingTxLength,
			pendingTxLength,
		}),
		[
			isConnected,
			walletAddress,
			provider,
			signer,
			connectWallet,
			walletError,
			connectorSelected,
			userSlippageTolerance,
		]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
