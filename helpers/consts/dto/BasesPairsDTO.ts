import { ChainId, Token } from "@pollum-io/pegasys-sdk";

export type IBasePairsDTO = {
	readonly [chainId in ChainId]: Token[];
};
