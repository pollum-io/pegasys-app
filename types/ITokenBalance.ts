import { TokenInfo } from "@pollum-io/syscoin-tokenlist-sdk";

export interface ITokenBalance extends TokenInfo {
	balance: string;
}

export interface ITokenBalanceWithId extends ITokenBalance {
	id: number;
}
