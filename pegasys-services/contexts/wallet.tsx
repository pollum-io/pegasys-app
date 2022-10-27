import React, { useEffect, createContext, useState, useMemo } from "react";

import { useToasty } from "../hooks";
import {
	IWalletProviderValue,
	IWalletProviderProps,
	TProvider,
	TSigner,
} from "../dto";
import { WalletFramework, PersistentFramework } from "../frameworks";

export const WalletContext = createContext({} as IWalletProviderValue);

export const WalletProvider: React.FC<IWalletProviderProps> = ({
	children,
}) => {
	const [address, setAddress] = useState<string>("");
	const [chainId, setChainId] = useState<number | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [provider, setProvider] = useState<TProvider>();
	const [signer, setSigner] = useState<TSigner | undefined>();
	const { toast } = useToasty();

	const disconnect = () => {
		setAddress("");
		setChainId(null);
		setIsConnected(false);
		setProvider(undefined);
		setSigner(undefined);
		PersistentFramework.remove("wallet");
	};

	const connect = async () => {
		try {
			const data = await WalletFramework.connect();

			setChainId(data.chainId);
			setAddress(data.address);
			setIsConnected(true);
			PersistentFramework.add("wallet", { isConnected: true });
		} catch {
			toast({
				title: "Error while connecting the wallet.",
				status: "error",
			});
			disconnect();
		}
	};

	useEffect(() => {
		if (provider) {
			const watchAccounts = async () => {
				const newAddress = await WalletFramework.getAddress();

				if (newAddress !== address) {
					setAddress(newAddress);
				}
			};

			const watchChains = async () => {
				const newChain = await WalletFramework.getChain();

				if (newChain !== chainId) {
					setChainId(newChain ?? 0);
				}
			};

			provider.addListener("accountsChanged", () => {
				watchAccounts();
			});

			provider.addListener("chainChanged", () => {
				watchChains();
			});
		}
	}, [provider]);

	useEffect(() => {
		const checkConnection = async () => {
			const value = PersistentFramework.get("wallet");

			if (value?.isConnected) {
				const connection = await WalletFramework.getConnectionInfo();

				const currentProvider = WalletFramework.getProvider();
				const currentSigner = WalletFramework.getSigner();

				if (connection.address && connection.chainId) {
					setAddress(connection.address);
					setChainId(connection.chainId);
					setIsConnected(true);
					setProvider(currentProvider);
					setSigner(currentSigner);
				} else {
					disconnect();
				}
			} else {
				disconnect();
			}
		};
		checkConnection();

		const provider = WalletFramework.getProvider();
		setProvider(provider);
	}, []);

	const providerValue = useMemo(
		() => ({
			connect,
			disconnect,
			chainId,
			setChainId,
			address,
			setAddress,
			isConnected,
			setIsConnected,
			provider,
			setProvider,
			signer,
			setSigner,
		}),
		[
			chainId,
			setChainId,
			address,
			setAddress,
			isConnected,
			setIsConnected,
			connect,
			disconnect,
			provider,
			setProvider,
			signer,
			setSigner,
		]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
