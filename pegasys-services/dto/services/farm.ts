// import { Token } from "@pollum-io/pegasys-sdk";
import { TokenAmount, Token } from "@pollum-io/pegasys-sdk";
import { WrappedTokenInfo } from "types";

export interface IFarmInfo {
	tokenA: WrappedTokenInfo;
	tokenB: Token;
	swapFeeApr: number;
	superFarmApr?: number;
	combinedApr: number;
	poolId: number;
	stakedAmount: TokenAmount;
	totalStakedAmount: TokenAmount;
	unclaimedPSYS: TokenAmount;
	availableLpTokens: TokenAmount;
	totalRewardRatePerWeek: TokenAmount;
	rewarderMultiplier?: bigint;
	lpToken: Token;
}
