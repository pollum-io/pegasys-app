import React, {
	useContext,
	useEffect,
	createContext,
	useState,
	useCallback,
	useMemo,
} from 'react';
import { ethers, providers, Signer } from 'ethers';

interface IWeb3 {
	isConnected: boolean;
	walletAddress: string;
	connectWallet: () => Promise<void>;
}

declare var window: any

export const WalletContext = createContext({} as IWeb3);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setAddress] = useState<string>('');
	const [signer, setSigner] = useState<Signer>();
	const [provider, setProvider] = useState<
		ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider
	>();

	useMemo(() => {
		const provider = new ethers.providers.JsonRpcProvider(
			'https://rpc.syscoin.org/' || 'https://rpc.ankr.com/syscoin'
		);
		setProvider(provider);

		const signer = provider.getSigner();
		setSigner(signer);
	}, []);

	const connectWallet = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		console.log(provider)
		await provider.send("eth_requestAccounts", []);
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
