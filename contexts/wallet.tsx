import React, {
	useEffect,
	createContext,
	useState,
	useMemo,
	ReactNode,
} from "react";
import { ethers, Signer } from "ethers";
import { convertHexToNumber } from "utils";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { IWalletInfo } from "types/index";
import { SYS_TESTNET_CHAIN_PARAMS } from "../helpers/consts";

interface IWeb3 {
	isConnected: boolean;
	currentNetworkChainId: number | null;
	provider:
		| ethers.providers.Provider
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| Signer
		| undefined;
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
					setAddress(window?.ethereum?.selectedAddress);
					getSignerIfConnected();
					setWalletError(false);
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

	useMemo(async () => {
		if (!connectorSelected) return;

		const getCurrentConnectorProvider =
			await connectorSelected?.connector?.getProvider();

		getCurrentConnectorProvider?.on("chainChanged", (chainId: string) => {
			setCurrentNetworkChainId(convertHexToNumber(chainId));
		});
	}, [connectorSelected]);

	console.log("connector", connectorSelected);

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
			setAddress(verifySysNetwork ? window?.ethereum?.selectedAddress : "");
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
		}),
		[
			isConnected,
			walletAddress,
			provider,
			connectWallet,
			walletError,
			connectorSelected,
		]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
