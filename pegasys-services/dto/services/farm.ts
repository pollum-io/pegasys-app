import { TokenAmount, Token, JSBI } from "@pollum-io/pegasys-sdk";
import { WrappedTokenInfo } from "types";

export interface IFarmInfo {
	stakeToken: Token;
	rewardToken: Token;
	stakedAmount: TokenAmount;
	unstakedAmount: TokenAmount;
	unclaimedAmount: TokenAmount;
	totalStakedAmount: TokenAmount;
	rewardRatePerWeek: TokenAmount;
	totalRewardRatePerWeek: TokenAmount;
	stakedInUsd: JSBI;
	totalStakedInUsd: TokenAmount;
	tokenA: WrappedTokenInfo;
	tokenB: Token;
	swapFeeApr: number;
	superFarmApr?: number;
	combinedApr: number;
	poolId: number;
	rewarderMultiplier?: bigint;
}
