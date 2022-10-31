import { ChainId, Token } from "@pollum-io/pegasys-sdk";

export type ITokensDTO = {
	[chainId in ChainId]: {
		[k: string]: Token;
	};
};
