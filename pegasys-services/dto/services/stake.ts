import { JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";

export interface IStakeInfo {
	rewardToken: Token;
	periodFinish?: Date;
	isPeriodFinished: boolean;
	earnedAmount: TokenAmount;
	rewardRate: TokenAmount;
	totalRewardRate: TokenAmount;
	stakedAmount: TokenAmount;
	totalStakedAmount: TokenAmount;
	totalStakedInPsys: TokenAmount;
	apr: JSBI;
	totalRewardRatePerWeek: TokenAmount;
	totalRewardRatePerSecond: TokenAmount;
	rewardRatePerWeek: TokenAmount;
	unstakedPsysAmount: TokenAmount;
}
