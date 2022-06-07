import React, { useEffect, createContext, useState, useMemo } from 'react';
import { ethers, Signer } from 'ethers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { SUPPORTED_WALLETS } from 'helpers/consts';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { ConnectSyscoinNetwork } from 'utils/ConnectSyscoinNetwork';
import { injected } from 'utils';

interface IWeb3 {
	isConnected: boolean;
	walletAddress: string;
	connectWallet: (connector: AbstractConnector | undefined) => Promise<void>;
	error: Error | undefined;
	account: string | null | undefined;
	connector: AbstractConnector | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

export const WalletContext = createContext({} as IWeb3);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setAddress] = useState('');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [pendingError, setPendingError] = useState<boolean>();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [signer, setSigner] = useState<Signer>();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [provider, setProvider] = useState<
		ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
	>();
	const { active, account, connector, activate, error } = useWeb3React();

	useMemo(() => {
		const rpcProvider = new ethers.providers.JsonRpcProvider(
			'https://rpc.syscoin.org/' || 'https://rpc.ankr.com/syscoin'
		);
		setProvider(rpcProvider);

		const rpcSigner = rpcProvider.getSigner();
		setSigner(rpcSigner);
	}, []);

	useEffect(() => {
		setIsConnected(active);
	}, [active]);

	const connectWallet = async (
		providedConnector: AbstractConnector | undefined
	) => {
		Object.keys(SUPPORTED_WALLETS).map(key => {
			if (providedConnector === SUPPORTED_WALLETS[key].connector) {
				return SUPPORTED_WALLETS[key].name;
			}
			return true;
		});
	};

	useMemo(() => {
		if (window?.ethereum?.selectedAddress) {
			connectWallet(injected);
			setAddress(window?.ethereum?.selectedAddress);
		}
	}, [walletAddress, injected]);

	useMemo(() => {
		if (connector) {
			activate(connector, undefined, true)
				.then(() => {
					setIsConnected(true);
					setAddress(window?.ethereum?.selectedAddress);
					const isCbWalletDappBrowser = window?.ethereum?.isCoinbaseWallet;
					const isWalletlink =
						!!window?.WalletLinkProvider || !!window?.walletLinkExtension;
					const isCbWallet = isCbWalletDappBrowser || isWalletlink;
					if (isCbWallet) {
						ConnectSyscoinNetwork();
					}
				})
				.catch((errorMessage: unknown) => {
					if (errorMessage instanceof UnsupportedChainIdError) {
						activate(connector); // a little janky...can't use setError because the connector isn't set
					} else {
						setPendingError(true);
					}
				});
		}
	}, [activate, connector]);

	const providerValue = useMemo(
		() => ({
			isConnected,
			walletAddress,
			connectWallet,
			account,
			error,
			connector,
		}),
		[]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
