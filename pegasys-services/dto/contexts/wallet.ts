import { ChainId } from "@pollum-io/pegasys-sdk";
import { IWalletInfo } from "types";
import { TProvider, TSigner } from "../framework";
import { children, setType } from "../react";

export interface IWalletProviderValue {
	isConnected: boolean;
	setIsConnected: setType<boolean>;
	chainId: ChainId | null;
	setChainId: setType<ChainId | null>;
	address: string;
	setAddress: setType<string>;
	connect: () => Promise<void>;
	disconnect: () => void;
	provider: TProvider | null;
	setProvider: setType<TProvider | null>;
	signer: TSigner | null;
	setSigner: setType<TSigner | null>;
	walletError: boolean;
	setWalletError: setType<boolean>;
	connectorSelected: IWalletInfo | null;
	setConnectorSelected: setType<IWalletInfo | null>;
}

export interface IWalletProviderProps {
	children: children;
}
