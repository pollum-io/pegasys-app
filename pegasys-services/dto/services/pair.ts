import { ChainId, Token } from "@pollum-io/pegasys-sdk";
import { WrappedTokenInfo } from "types";
import { TContract, TProvider } from "../framework";

export interface IPairServicesDoesPairExists {
	pairAddress: string;
	provider?: TProvider;
}

export interface IPairServicesGetPairReserve {
	pairAddress?: string;
	provider?: TProvider;
	pairContract?: TContract;
	tokenA: Token;
	tokenB: Token;
	chainId?: ChainId;
}

export interface IGetMixedTokenPairs {
	chainId: ChainId;
	allTokens: WrappedTokenInfo[];
}

export interface ITokensMixed {
	[address: string]: WrappedTokenInfo;
}

export enum PairState {
	LOADING,
	NOT_EXISTS,
	EXISTS,
	INVALID,
}
