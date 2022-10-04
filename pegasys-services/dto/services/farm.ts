// import { Token } from "@pollum-io/pegasys-sdk";
import { TokenAmount, Token, JSBI } from "@pollum-io/pegasys-sdk";
import { WrappedTokenInfo } from "types";

export interface IFarmInfo {
	tokenA: WrappedTokenInfo;
	tokenB: Token;
	swapFeeApr: number;
	superFarmApr?: number;
	combinedApr: number;
	poolId: number;
	userStakedAmount: TokenAmount;
	totalStakedInUsd: TokenAmount;
	userStakeInUsd: JSBI;
	totalStakedAmount: TokenAmount;
	unclaimedPSYSAmount: TokenAmount;
	userAvailableLpTokenAmount: TokenAmount;
	totalRewardRatePerWeek: TokenAmount;
	rewarderMultiplier?: bigint;
	lpToken: Token;
}
