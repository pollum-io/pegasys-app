import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers, Signer } from "ethers";
import { createContractUsingAbi } from "utils/contractInstance";
import abi20 from "../utils/abi/erc20.json";

interface IWeb3 {
	isConnected: boolean;
	walletAddress: string;
	connectWallet: any;
	error?: boolean;
	setError?: any;
}

export const WalletContext = createContext({} as IWeb3);

declare let window: any;

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setAddress] = useState("");
	const [pendingError, setPendingError] = useState<boolean>();
	const [error, setError] = useState<boolean>();
	const [signer, setSigner] = useState<Signer>();
	const [provider, setProvider] = useState<
		ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
	>();

	const connectToSysRpcIfNotConnected = () => {
		const rpcProvider = new ethers.providers.JsonRpcProvider(
			"https://rpc.syscoin.org/" || "https://rpc.ankr.com/syscoin"
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

	const connectWallet = async (connector: any) => {
		connector
			.activate()
			.then(() => {
				if (Number(window?.ethereum?.networkVersion) === 57) {
					setIsConnected(!!window?.ethereum?.selectedAddress);
					setAddress(window?.ethereum?.selectedAddress);
					getSignerIfConnected();
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

	provider?.on("chainChanged", () =>
		setError(Number(window?.ethereum?.networkVersion) === 57)
	);

	provider?.on("accountsChanged", () =>
		setIsConnected(!!window?.ethereum?.selectedAddress)
	);

	useEffect(() => {
		const verifySysNetwork =
			window?.ethereum?.selectedAddress &&
			Number(window?.ethereum?.networkVersion) === 57;

		if (!isConnected) {
			connectToSysRpcIfNotConnected();
		}

		if (verifySysNetwork) {
			setIsConnected(!!window?.ethereum?.selectedAddress);
			setAddress(window?.ethereum?.selectedAddress);
		}
	}, []);

	const getTokenBalance = async (address: string) => {
		try {
			const contract = await createContractUsingAbi(
				address,
				abi20,
				signer || provider
			);

			console.log(contract);

			const balance = await contract?.methods?.balanceOf(walletAddress).call();

			console.log("balance", balance);

			return balance;
		} catch (err) {
			console.log(err);
			return 0;
		}
	};

	getTokenBalance("0xE18c200A70908c89fFA18C628fE1B83aC0065EA4")
		.then((response: any) => console.log("teste", response))
		.catch(err => console.log("error", err));

	const providerValue = useMemo(
		() => ({
			isConnected,
			walletAddress,
			connectWallet,
			error,
		}),
		[]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
