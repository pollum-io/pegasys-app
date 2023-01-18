import { TokenAmount } from "@pollum-io/pegasys-sdk";
import { IStakeInfo, IStakeV2Info } from "pegasys-services";

export interface ICardItemProps {
	text: string;
	value: string;
	usdValue?: string;
	opacity?: boolean;
}

export interface IStakeCardsProps {
	stakeInfo?: IStakeInfo | IStakeV2Info;
	v1?: boolean;
}

export interface IButtonsProps {
	unstakedAmount: TokenAmount;
	stakedAmount: TokenAmount;
	unclaimedAmount: TokenAmount;
	symbol: string;
	onClick: (id: string) => void;
}

export interface IHeaderProps {
	stakedAmount: TokenAmount;
	symbol: string;
	onClick: (id: string) => void;
}

export interface IBodyProps {
	symbol: string;
	apr: string;
	totalStakedInUsd: number;
	totalStakedAmount: TokenAmount;
	rewardRatePerWeekInUsd?: number;
	rewardRatePerWeek?: TokenAmount;
	stakedInUsd: number;
	stakedAmount: TokenAmount;
	unclaimedInUsd: number;
	unclaimedAmount: TokenAmount;
	depositFee?: number;
}
