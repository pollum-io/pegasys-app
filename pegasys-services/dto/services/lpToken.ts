import { ChainId } from "@pollum-io/pegasys-sdk";
import { TContract, TProvider, TSigner } from "../framework";

export interface ILpServicesGetBalanceProps {
	contractAddress?: string;
	chainId?: ChainId | null;
	provider?: TSigner | TProvider;
	lpContract?: TContract;
}

export interface ILpServicesGetAvailableLpTokens {
	contractAddress?: string;
	provider?: TSigner | TProvider;
	lpContract?: TContract;
	walletAddress: string;
}

export interface ILpServicesGetTotalSupply {
	contractAddress?: string;
	provider?: TSigner | TProvider;
	lpContract?: TContract;
}

export interface ILpServicesGetLpTokens {
	provider?: TSigner | TProvider;
	farmContract?: TContract;
	chainId?: ChainId | null;
}

export interface ILpServicesGetRewarder {
	provider: TSigner | TProvider | null;
	farmContract?: TContract;
	chainId?: ChainId | null;
	poolId: number;
}

export interface ILpServicesGetUserStake {
	provider?: TSigner | TProvider;
	farmContract?: TContract;
	chainId?: ChainId | null;
	poolId: number;
	walletAddress: string;
}

export interface ILpServicesGetUserUnclaimedPSYS {
	provider?: TSigner | TProvider;
	farmContract?: TContract;
	chainId?: ChainId | null;
	poolId: number;
	walletAddress: string;
}

export interface ILpServicesGetTotalAllocPoint {
	provider?: TSigner | TProvider;
	farmContract?: TContract;
	chainId?: ChainId | null;
}

export interface ILpServicesGetRewardPerSec {
	provider?: TSigner | TProvider;
	farmContract?: TContract;
	chainId?: ChainId | null;
}

export interface ILpServicesGetAllocPoint {
	provider?: TSigner | TProvider;
	farmContract?: TContract;
	chainId?: ChainId | null;
	poolId: number;
}

export interface ILpServicesGetPoolMap {
	provider?: TSigner | TProvider;
	farmContract?: TContract;
	chainId?: ChainId | null;
	tokenAddresses?: string[];
}
