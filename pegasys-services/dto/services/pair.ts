import { ChainId, Token } from "@pollum-io/pegasys-sdk";
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

export enum PairState {
	LOADING,
	NOT_EXISTS,
	EXISTS,
	INVALID,
}
