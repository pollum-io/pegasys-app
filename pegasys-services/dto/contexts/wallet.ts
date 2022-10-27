import { ChainId } from "@pollum-io/pegasys-sdk";
import { TProvider, TSigner } from "../framework";
import { children, setType } from "../react";

export interface IWalletProviderValue {
	isConnected: boolean;
	setIsConnected: setType<boolean>;
	chainId: ChainId;
	setChainId: setType<ChainId>;
	address: string;
	setAddress: setType<string>;
	connect: () => Promise<void>;
	disconnect: () => void;
	provider: TProvider | undefined;
	setProvider: setType<TProvider | undefined>;
	signer: TSigner | undefined;
	setSigner: setType<TSigner | undefined>;
}

export interface IWalletProviderProps {
	children: children;
}
