import { TokenAmount } from "@pollum-io/pegasys-sdk";

export interface IDeposited {
	token0: TokenAmount | undefined;
	token1: TokenAmount | undefined;
}
