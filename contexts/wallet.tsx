import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers, Signer } from "ethers";
import { convertHexToNumber, isAddress } from "utils";
import { AbstractConnector } from "@web3-react/abstract-connector";
import {
	INITIAL_ALLOWED_SLIPPAGE,
	SYS_TESTNET_CHAIN_PARAMS,
} from "../helpers/consts";

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
	connectorSelected: AbstractConnector | undefined;
	setConnectorSelected: React.Dispatch<
		React.SetStateAction<AbstractConnector | undefined>
	>;
	userSlippageTolerance: number;
	setUserSlippageTolerance: React.Dispatch<React.SetStateAction<number>>;
	setTransactions: React.Dispatch<React.SetStateAction<object>>;
	transactions: object;
	wssProvider: ethers.providers.WebSocketProvider;
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
	const [signer, setSigner] = useState<Signer | undefined>();
	const [provider, setProvider] = useState<
		ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
	>();
	const [connectorSelected, setConnectorSelected] =
		useState<AbstractConnector>();
	const [userSlippageTolerance, setUserSlippageTolerance] = useState<number>(
		INITIAL_ALLOWED_SLIPPAGE
	);
	const [transactions, setTransactions] = useState<object>({
		57: {},
		5700: {},
	});

	const [approvalState, setApprovalState] = useState();

	const wssProvider = new ethers.providers.WebSocketProvider(
		"wss://rpc.tanenbaum.io/wss"
	);

	const connectToSysRpcIfNotConnected = () => {
		const rpcProvider = new ethers.providers.JsonRpcProvider(
			SYS_TESTNET_CHAIN_PARAMS.rpcUrls[0]
		);
		setProvider(rpcProvider);

		const rpcSigner = rpcProvider.getSigner();

		setSigner(rpcSigner);
	};

	const getSignerIfConnected = async () => {
		const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

		await web3Provider.send("eth_requestAccounts", []);

		const web3Signer = web3Provider.getSigner();

		setProvider(web3Provider);
		setSigner(web3Signer);
	};

	const connectWallet = async (connector: AbstractConnector) => {
		connector
			.activate()
			.then(() => {
				if (Number(window?.ethereum?.networkVersion) === 5700) {
					setIsConnected(!!window?.ethereum?.selectedAddress);
					setAddress(isAddress(window?.ethereum?.selectedAddress));
					getSignerIfConnected();
					setWalletError(false);
					setCurrentNetworkChainId(Number(window?.ethereum?.networkVersion));
				} else {
					setWalletError(true);
				}
			})
			.catch((errorMessage: Error) => {
				if (errorMessage) {
					// eslint-disable-next-line no-console
					console.log(errorMessage, "errorMessage");
				}
			});
	};

	provider?.on("chainChanged", () => {
		setWalletError(Number(window?.ethereum?.networkVersion) === 5700);
	});

	provider?.on("accountsChanged", () =>
		setIsConnected(!!window?.ethereum?.selectedAddress)
	);

	wssProvider
		.waitForTransaction()
		.then(result => console.log("TX info: ", result));

	useMemo(async () => {
		const getCurrentConnectorProvider = await connectorSelected?.getProvider();

		getCurrentConnectorProvider?.on("chainChanged", (chainId: string) => {
			setCurrentNetworkChainId(convertHexToNumber(chainId));
		});
	}, [connectorSelected]);

	useEffect(() => {
		const verifySysNetwork =
			window?.ethereum?.selectedAddress &&
			Number(window?.ethereum?.networkVersion) === 5700;

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
			userSlippageTolerance,
			setUserSlippageTolerance,
			transactions,
			setTransactions,
			wssProvider,
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
