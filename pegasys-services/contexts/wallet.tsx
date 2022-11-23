import React, { useEffect, createContext, useState, useMemo } from "react";

import { ChainId } from "@pollum-io/pegasys-sdk";
import { IWalletInfo } from "types";
import { useTranslation } from "react-i18next";
import { SUPPORTED_NETWORK_CHAINS } from "../constants";
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
	const { t: translation } = useTranslation();
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
				title: translation("toasts.connectingError"),
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
		const p = provider ?? WalletFramework.getProvider();

		p.on("network", (newNetwork, oldNetwork) => {
			if (oldNetwork) {
				setChainId(newNetwork.chainId ?? ChainId.NEVM);
				// window.location.reload();
			}
		});

		// eslint-disable-next-line
		const { ethereum } = window as any;

		ethereum.on("accountsChanged", () => {
			connect();
		});
	}, [provider]);

	useEffect(() => {
		const p = WalletFramework.getProvider();

		setProvider(p);

		const checkConnection = async () => {
			const c = await WalletFramework.getChain(p);

			setChainId(c ?? ChainId.NEVM);

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
