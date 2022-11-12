import { ChainId } from "@pollum-io/pegasys-sdk";
import { TContract, TProvider } from "../framework";

export interface ITokenServicesGetTokenName {
	contractAddress?: string;
	contract?: TContract;
	provider?: TProvider;
}

export interface ITokenServicesGetTokenSymbol {
	contractAddress?: string;
	contract?: TContract;
	provider?: TProvider;
}

export interface ITokenServicesGetTokenDecimals {
	contractAddress?: string;
	contract?: TContract;
	provider?: TProvider;
}

export interface ITokenServicesGetToken {
	contractAddress: string;
	contract?: TContract;
	provider?: TProvider;
	chainId?: ChainId | null;
}
