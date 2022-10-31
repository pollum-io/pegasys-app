import React, { useEffect, createContext, useState, useMemo } from "react";

import { ChainId } from "@pollum-io/pegasys-sdk";
import { SUPPORTED_NETWORK_CHAINS } from "helpers/consts";
import { IWalletInfo } from "types";
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
	const [chainId, setChainId] = useState<ChainId | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [provider, setProvider] = useState<TProvider | null>(null);
	const [signer, setSigner] = useState<TSigner | null>(null);
	const [walletError, setWalletError] = useState<boolean>(false);
	const [connectorSelected, setConnectorSelected] =
		useState<IWalletInfo | null>(null);
	const { toast } = useToasty();

	const disconnect = () => {
		setAddress("");
		setChainId(null);
		setIsConnected(false);
		setSigner(undefined);
		PersistentFramework.remove("wallet");
	};

	const connect = async () => {
		try {
			const data = await WalletFramework.connect();

			setChainId(data.chainId);
			setAddress(data.address);
			setSigner(data.signer ?? null);
			setProvider(data.provider ?? null);
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
		if (chainId) {
			if (!SUPPORTED_NETWORK_CHAINS.includes(chainId)) {
				setWalletError(true);
			}
		}
	}, [chainId]);

	useEffect(() => {
		if (provider) {
			provider.on("network", (newNetwork, oldNetwork) => {
				if (oldNetwork) {
					setChainId(newNetwork.chainId ?? ChainId.NEVM);
				}
			});

			provider.on("accountsChanged", () => {
				connect();
			});
		}
	}, [provider]);

	useEffect(() => {
		const provider = WalletFramework.getProvider();

		setProvider(provider);

		const checkConnection = async () => {
			const value = PersistentFramework.get("wallet") as { [k: string]: any };

			if (value?.isConnected) {
				const connection = await WalletFramework.getConnectionInfo();

				if (connection.address && connection.chainId) {
					setAddress(connection.address);
					setChainId(connection.chainId);
					setIsConnected(true);
					setSigner(connection.signer);
					setProvider(connection.provider);
				} else {
					disconnect();
				}
			} else {
				disconnect();
			}
		};

		checkConnection();
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
			walletError,
			setWalletError,
			connectorSelected,
			setConnectorSelected,
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
