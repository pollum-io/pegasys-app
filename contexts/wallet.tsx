import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers, Signer } from "ethers";
import { getBalanceOf } from "utils";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { SYS_TESTNET_CHAIN_PARAMS } from "../helpers/consts";

interface IWeb3 {
	isConnected: boolean;
	walletAddress: string;
	connectWallet: (connector: AbstractConnector) => Promise<void>;
	walletError?: boolean;
	setWalletError: React.Dispatch<React.SetStateAction<boolean | undefined>>;
	connectorSelected: AbstractConnector | undefined;
	setConnectorSelected: React.Dispatch<
		React.SetStateAction<AbstractConnector | undefined>
	>;
}

export const WalletContext = createContext({} as IWeb3);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

interface ITokenBalance {
	contract: string;
	balance: string;
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setAddress] = useState("");
	const [walletError, setWalletError] = useState<boolean>();
	const [signer, setSigner] = useState<Signer>();
	const [provider, setProvider] = useState<
		ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
	>();
	const [balances, setBalances] = useState<ITokenBalance[]>([]);
	const [connectorSelected, setConnectorSelected] =
		useState<AbstractConnector>();

	const connectToSysRpcIfNotConnected = () => {
		const rpcProvider = new ethers.providers.JsonRpcProvider(
			// "https://rpc.syscoin.org/" || "https://rpc.ankr.com/syscoin"
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

	provider?.on("chainChanged", () =>
		setWalletError(Number(window?.ethereum?.networkVersion) === 5700)
	);

	provider?.on("accountsChanged", () =>
		setIsConnected(!!window?.ethereum?.selectedAddress)
	);

	useEffect(() => {
		const verifySysNetwork =
			window?.ethereum?.selectedAddress &&
			Number(window?.ethereum?.networkVersion) === 5700;

		if (!isConnected) {
			connectToSysRpcIfNotConnected();
		}

		if (verifySysNetwork) {
			setIsConnected(!!window?.ethereum?.selectedAddress);
			setAddress(window?.ethereum?.selectedAddress);
		}
	}, []);

	const getBalance = async () => {
		const value = await provider
			.getBalance(walletAddress)
			.then(result => result.toString());

		const formattedValue = ethers.utils.formatEther(value);
		setBalances((previous: ITokenBalance[]) => [
			...previous,
			{ contract: "", balance: formattedValue },
		]);

		return formattedValue;
	};
	const getTokenBalance = async (tokenAddress: string) => {
		const balance = await getBalanceOf(tokenAddress, walletAddress, provider);
		const contract = tokenAddress.toLowerCase();
		const searchedBalance = balances.find(item => item.contract === contract);
		if (!searchedBalance) {
			setBalances((previous: ITokenBalance[]) => [
				...previous,
				{ contract, balance },
			]);
		} else {
			searchedBalance.balance = balance;
		}
	};

	useEffect(() => {
		if (!isConnected) return;
		const tokensToFetch = ["0x81821498cD456c9f9239010f3A9F755F3A38A778"];
		tokensToFetch.map(token => getTokenBalance(token));
		getBalance();
	}, [isConnected]);

	const providerValue = useMemo(
		() => ({
			isConnected,
			walletAddress,
			connectWallet,
			walletError,
			setWalletError,
			setConnectorSelected,
			connectorSelected,
		}),
		[
			isConnected,
			walletAddress,
			connectWallet,
			walletError,
			setWalletError,
			connectorSelected,
			setConnectorSelected,
		]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
