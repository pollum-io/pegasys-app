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

export interface IStakeV2ServicesGetUnclaimed {
	chainId?: ChainId;
	stakeContract?: TContract;
	rewardToken: Token;
	provider?: TProvider | TSigner;
	walletAddress: string;
}

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

export interface IStakeV2ServicesApprove {
	amountToApprove: TokenAmount;
	chainId?: ChainId | null;
}
