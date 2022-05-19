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

export const Web3Context = createContext({} as IWeb3);

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

	const connectWallet = async () => {};

	return (
		<Web3Context.Provider
			value={{
				isConnected,
				walletAddress,
				connectWallet,
			}}
		>
			{children}
		</Web3Context.Provider>
	);
};
export const useWeb3 = () => useContext(Web3Context);
