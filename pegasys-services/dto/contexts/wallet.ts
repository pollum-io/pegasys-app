import { children, setType } from "../react";

export interface IWalletProviderValue {
	isConnected: boolean;
	setIsConnected: setType<boolean>;
	chainId: number | null;
	setChainId: setType<number | null>;
	address: string;
	setAddress: setType<string>;
	connect: () => Promise<void>;
	disconnect: () => void;
}

export interface IWalletProviderProps {
	children: children;
}
