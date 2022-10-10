import { JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";

export interface IStakeInfo {
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
	periodFinish?: Date;
	isPeriodFinished: boolean;

	// rewardToken: Token;
	// earnedAmount: TokenAmount;
	// rewardRate: TokenAmount;
	// totalRewardRate: TokenAmount;
	// stakedAmount: TokenAmount;
	// totalStakedAmount: TokenAmount;
	// totalStakedInPsys: TokenAmount;
	apr: JSBI;
	// totalRewardRatePerWeek: TokenAmount;
	// totalRewardRatePerSecond: TokenAmount;
	// rewardRatePerWeek: TokenAmount;
	// unstakedPsysAmount: TokenAmount;
}
