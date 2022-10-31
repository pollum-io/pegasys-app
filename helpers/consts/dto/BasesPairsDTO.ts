import { ChainId, Token } from "@pollum-io/pegasys-sdk";

export type IBasePairsDTO = {
	readonly [chainId in ChainId]: Token[];
};

export type ICustomBasePairDTO = {
	[chainId in ChainId]?: { [tokenAddress: string]: Token[] };
};
