import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers, Signer } from "ethers";
import { SUPPORTED_WALLETS } from "helpers/consts";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { ConnectSyscoinNetwork } from "utils/ConnectSyscoinNetwork";
import { injected, walletlink } from "utils";

interface IWeb3 {
	isConnected: boolean;
	walletAddress: string;
	connectWallet: any;
	error?: boolean;
	setError?: any;
}

export const WalletContext = createContext({} as IWeb3);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setAddress] = useState("");
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [pendingError, setPendingError] = useState<boolean>();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [error, setError] = useState<boolean>();
	const [signer, setSigner] = useState<Signer>();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [provider, setProvider] = useState<
		ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
	>();

	console.log(isConnected, "isConnected");
	console.log(walletAddress, "walletAddress");

	useMemo(() => {
		const rpcProvider = new ethers.providers.JsonRpcProvider(
			"https://rpc.syscoin.org/" || "https://rpc.ankr.com/syscoin"
		);
		setProvider(rpcProvider);

		const rpcSigner = rpcProvider.getSigner();
		setSigner(rpcSigner);
	}, []);

	const connectWallet = async (connector: any) => {
		connector
			.activate()
			.then(() => {
				if (Number(window?.ethereum?.networkVersion) === 57) {
					setIsConnected(!!window?.ethereum?.selectedAddress);
					setAddress(window?.ethereum?.selectedAddress);
					setError(false);
				} else {
					setError(true);
				}
			})
			.catch((errorMessage: Error) => {
				if (errorMessage) {
					console.log(errorMessage, "errorMessage");
				}
			});
	};

	useEffect(() => {
		if (
			window?.ethereum?.selectedAddress &&
			Number(window?.ethereum?.networkVersion) === 57
		) {
			setIsConnected(!!window?.ethereum?.selectedAddress);
			setAddress(window?.ethereum?.selectedAddress);
			setError(false);
		}
		if (
			window?.ethereum?.selectedAddress &&
			Number(window?.ethereum?.networkVersion) !== 57
		) {
			setError(true);
		}
	}, []);

	useEffect(() => {
		if (Number(window?.ethereum?.networkVersion) === 57) {
			setError(false);
		} else {
			setError(true);
		}
	}, []);

	// eslint-disable-next-line
	const providerValue = {
		isConnected,
		walletAddress,
		connectWallet,
		error,
	};

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
