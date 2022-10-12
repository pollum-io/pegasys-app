import { JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { IEarnInfo } from "../contexts";

export interface IStakeInfo extends IEarnInfo {
	periodFinish?: Date;
	isPeriodFinished: boolean;
	apr: JSBI;
	rewardRatePerWeekInUsd: number;
	totalRewardRatePerWeekInUsd: number;
}
