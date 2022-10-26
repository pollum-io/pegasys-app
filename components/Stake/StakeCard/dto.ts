import { TokenAmount } from "@pollum-io/pegasys-sdk";
import { IStakeInfo } from "pegasys-services";

export interface ICardItemProps {
	text: string;
	value: string;
	usdValue?: string;
}

export interface IStakeCardsProps {
	stakeInfo?: IStakeInfo;
}

export interface IButtonsProps {
	unstakedAmount: TokenAmount;
	stakedAmount: TokenAmount;
	unclaimedAmount: TokenAmount;
	symbol: string;
	onClick: (id: string) => void;
}

export interface IHeaderProps {
	unclaimedAmount: TokenAmount;
	symbol: string;
	onClick: (id: string) => void;
}

export interface IBodyProps {
	symbol: string;
	apr: string;
	totalStakedInUsd: number;
	totalStakedAmount: TokenAmount;
	rewardRatePerWeekInUsd: number;
	rewardRatePerWeek: TokenAmount;
	stakedInUsd: number;
	stakedAmount: TokenAmount;
	unclaimedInUsd: number;
	unclaimedAmount: TokenAmount;
}
