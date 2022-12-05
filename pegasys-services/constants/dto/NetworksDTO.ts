import { ChainId } from "@pollum-io/pegasys-sdk";

type IChainParamsValues = {
	chainId: string;
	chainName: string;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	rpcUrls: string[];
	blockExplorerUrls: string[];
	apiUrls: string[];
};

export type INetworksChainParams = {
	[chainId in ChainId]: IChainParamsValues;
};
