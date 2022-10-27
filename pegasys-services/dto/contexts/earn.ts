import { JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { BigNumber } from "ethers";
import { TContract } from "../framework";
import { children, setType } from "../react";

export interface IEarnProviderProps {
	children: children;
}

export interface IEarnInfo {
	stakeToken: Token;
	rewardToken: Token;
	stakedAmount: TokenAmount;
	unstakedAmount: TokenAmount;
	unclaimedAmount: TokenAmount;
	totalStakedAmount: TokenAmount;
	rewardRatePerWeek: TokenAmount;
	totalRewardRatePerWeek: TokenAmount;
	stakedInUsd: number;
	totalStakedInUsd: number;
	tokenA: Token;
	tokenB?: Token;
	extraRewardToken?: Token;
	extraRewardRatePerWeek?: TokenAmount;
	extraTotalRewardRatePerWeek?: TokenAmount;
	extraUnclaimed?: TokenAmount;
}

export type TButtonId = "withdraw" | "claim" | "deposit" | null;

export type TSignature = {
	v: number;
	r: string;
	s: string;
	deadline: BigNumber;
} | null;

export interface IEarnProviderValue {
	withdrawTypedValue: string;
	setWithdrawTypedValue: (newValue: string) => void;
	depositTypedValue: string;
	setDepositTypedValue: (newValue: string) => void;
	buttonId: TButtonId;
	setButtonId: setType<TButtonId>;
	signature: TSignature;
	onSign: (
		contract: TContract,
		name: string,
		spender: string,
		verifyingContract: string,
		version?: string
	) => Promise<void>;
	getTypedValue: (
		isDeposit?: boolean
	) => { percentage: number; value: JSBI } | undefined;
	earnOpportunities: IEarnInfo[];
	setEarnOpportunities: setType<IEarnInfo[]>;
	selectedOpportunity: IEarnInfo | null;
	setSelectedOpportunity: setType<IEarnInfo | null>;
	withdrawPercentage: number;
	depositPercentage: number;
	reset: () => void;
	signatureLoading: boolean;
	loading: boolean;
	setLoading: setType<boolean>;
	onContractCall: (
		promise: () => Promise<{ hash: string; response: any } | undefined>,
		summary: string,
		type: string
	) => Promise<void>;
}
