import { ChainId, Token, TokenAmount, Pair } from "@pollum-io/pegasys-sdk";
import { BigNumber, ethers, Signer } from "ethers";
import { WrappedTokenInfo } from "types";
import { IEarnInfo } from "../contexts";
import { TContract, TProvider, TSigner } from "../framework";

export interface IFarmInfo extends IEarnInfo {
	swapFeeApr: number;
	superFarmApr?: number;
	combinedApr: number;
	poolId: number;
	pair: Pair;
}

export interface IFarmServicesGetTotalStake {
	chainId?: ChainId | null;
	lpContract?: TContract;
	stakeToken: Token;
	provider?: TProvider | TSigner;
}

export interface IFarmServicesGetStake {
	farmContract?: TContract;
	chainId?: ChainId | null;
	provider?: TProvider | TSigner;
	poolId: number;
	walletAddress: string;
	stakeToken: Token;
}

export interface IFarmServicesGetUnstake {
	lpContract?: TContract;
	provider?: TProvider | TSigner;
	walletAddress: string;
	stakeToken: Token;
}

export interface IFarmServicesGetUnclaimed {
	farmContract?: TContract;
	provider?: TProvider | TSigner;
	walletAddress: string;
	rewardToken: Token;
	chainId?: ChainId | null;
	poolId: number;
}

export interface IFarmServicesGetPoolRewardRate {
	stakeToken: Token;
	rewardToken: Token;
	poolId: number;
	farmContract?: TContract;
	provider?: TProvider | TSigner;
	chainId?: ChainId | null;
}

export interface IFarmServicesGetExtraReward {
	totalRewardRatePerWeek: TokenAmount;
	rewardRatePerWeek: TokenAmount;
	poolId: number;
	chainId?: ChainId | null;
	provider?: TProvider | TSigner | null;
	farmContract?: TContract;
	unclaimed: TokenAmount;
}

export interface IFarmServicesGetFarmOpportunities {
	tokenPairs: Array<[WrappedTokenInfo, Token]>;
	walletAddress: string;
	chainId?: ChainId | null;
	farmContract?: TContract;
	provider:
		| ethers.providers.Provider
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| Signer
		| null;
}

export interface IFarmServicesWithdraw {
	poolId: number;
	amount: string;
	address: string;
	chainId?: ChainId | null;
	farmContract?: TContract;
}

export interface IFarmServicesClaim {
	poolId: number;
	address: string;
	chainId?: ChainId | null;
	farmContract?: TContract;
}

export interface IFarmServicesDeposit {
	poolId: number;
	amount: string;
	address: string;
	signatureData: {
		v: number;
		r: string;
		s: string;
		deadline: BigNumber;
	} | null;
	chainId?: ChainId | null;
	farmContract?: TContract;
}
