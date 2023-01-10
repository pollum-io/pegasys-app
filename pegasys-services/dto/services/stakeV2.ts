import { ChainId, JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { BigNumber } from "ethers";
import { IEarnInfo } from "../contexts";
import { TContract, TProvider, TSigner } from "../framework";

export interface IStakeV2Info extends IEarnInfo {
	apr: JSBI;
	rewardRatePerWeekInUsd: number;
	unclaimedInUsd: number;
}

export interface IStakeV2ServicesGetUnstake {
	stakeToken: Token;
	walletAddress: string;
	provider?: TProvider | TSigner;
}

// export interface IStakeServicesGetApr {
// 	chainId?: ChainId;
// 	totalRewardRatePerSecond: TokenAmount;
// 	isPeriodFinished: boolean;
// 	totalStaked: TokenAmount;
// 	provider?: TProvider | TSigner;
// }

// export interface IStakeServicesGetTotalStakedAmount {
// 	chainId?: ChainId;
// 	stakeContract?: TContract;
// 	stakeToken: Token;
// 	provider?: TProvider | TSigner;
// }

// export interface IStakeServicesGetStakedAmount {
// 	chainId?: ChainId;
// 	stakeContract?: TContract;
// 	stakeToken: Token;
// 	provider?: TProvider | TSigner;
// 	walletAddress: string;
// }

export interface IStakeV2ServicesGetUnclaimed {
	chainId?: ChainId;
	stakeContract?: TContract;
	rewardToken: Token;
	provider?: TProvider | TSigner;
	walletAddress: string;
}

// export interface IStakeServicesGetPeriodFinish {
// 	chainId?: ChainId;
// 	stakeContract?: TContract;
// 	provider?: TProvider | TSigner;
// }

// export interface IStakeServicesGetStakeReward {
// 	chainId?: ChainId;
// 	stakeContract?: TContract;
// 	provider?: TProvider | TSigner;
// 	rewardToken: Token;
// 	isPeriodFinished?: boolean;
// 	totalStaked: TokenAmount;
// 	staked: TokenAmount;
// }

// export interface IStakeServicesGetDollarValues {
// 	chainId?: ChainId | null;
// 	totalStaked: TokenAmount;
// 	staked: TokenAmount;
// 	rewardRatePerWeek: TokenAmount;
// 	unclaimedAmount: TokenAmount;
// }

export interface IStakeV2ServicesGetStakeOpportunities {
	chainId?: ChainId;
	provider?: TProvider | TSigner;
	walletAddress: string;
	stakeContract?: TContract;
}

export interface IStakeV2ServicesClaim {
	chainId?: ChainId;
	provider?: TProvider | TSigner;
	stakeContract?: TContract;
}

export interface IStakeV2ServicesUnstake {
	chainId?: ChainId;
	provider?: TProvider | TSigner;
	stakeContract?: TContract;
	amount: string;
}

export interface IStakeV2ServicesStake {
	chainId?: ChainId;
	provider?: TProvider | TSigner;
	stakeContract?: TContract;
	amount: string;
}
