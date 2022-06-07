import React, {
	useContext,
	useEffect,
	createContext,
	useState,
	useCallback,
	useMemo,
} from 'react';
import { ethers, providers, Signer } from 'ethers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { SUPPORTED_WALLETS } from 'helpers/consts';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useSyscoinNetwork } from 'hooks/useSyscoinNetwork';
import { injected } from 'utils';

interface IWeb3 {
	isConnected: boolean;
	walletAddress: string;
	connectWallet: (connector: AbstractConnector | undefined) => Promise<void>
}

declare var window: any

export const WalletContext = createContext({} as IWeb3);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setAddress] = useState('');
	const [pendingError, setPendingError] = useState<boolean>()
	const [signer, setSigner] = useState<Signer>();
	const [provider, setProvider] = useState<
		ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
	>();
	const { active, account, connector, activate, error, setError } = useWeb3React()


	useMemo(() => {
		const provider = new ethers.providers.JsonRpcProvider(
			'https://rpc.syscoin.org/' || 'https://rpc.ankr.com/syscoin'
		);
		setProvider(provider);

		const signer = provider.getSigner();
		setSigner(signer);
	}, []);

	useEffect(() => {
		if (active) {
			setIsConnected(true)
		} else {
			setIsConnected(false)
		}

	}, [active])

	useEffect(() => {
		if (window?.ethereum?.selectedAddress) {
			connectWallet(injected)
			setAddress(window?.ethereum?.selectedAddress)
		}
	}, [walletAddress, injected])


	const connectWallet = async (connector: AbstractConnector | undefined) => {
		let name
		Object.keys(SUPPORTED_WALLETS).map(key => {
			if (connector === SUPPORTED_WALLETS[key].connector) {
				return (name = SUPPORTED_WALLETS[key].name)
			}
			return true
		})

		connector &&
			activate(connector, undefined, true)
				.then(() => {
					setIsConnected(true)
					const isCbWalletDappBrowser = window?.ethereum?.isCoinbaseWallet
					const isWalletlink = !!window?.WalletLinkProvider || !!window?.walletLinkExtension
					const isCbWallet = isCbWalletDappBrowser || isWalletlink
					if (isCbWallet) {
						useSyscoinNetwork()
					}
				})
				.catch(error => {
					if (error instanceof UnsupportedChainIdError) {
						activate(connector)  // a little janky...can't use setError because the connector isn't set
					} else {
						setPendingError(true)
					}
				})
	};

	return (
		<WalletContext.Provider
			value={{
				isConnected,
				walletAddress,
				connectWallet,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
};
