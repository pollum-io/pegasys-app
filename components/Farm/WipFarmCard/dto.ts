import { Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { IFarmInfo } from "pegasys-services";

export interface ICardItemProps {
	text: string;
	value: string;
	color?: boolean;
}

export interface IFarmCardsProps {
	stakeInfo: IFarmInfo;
}

export interface IButtonsProps {
	unstakedAmount: TokenAmount;
	stakedAmount: TokenAmount;
	unclaimedAmount: TokenAmount;
	tokenA: Token;
	tokenB: Token;
	onClick: (id: string) => void;
}

export interface IHeaderProps {
	tokenA: Token;
	tokenB: Token;
	extraToken?: Token;
}

export interface IBodyProps {
	swapFeeApr: number;
	combinedApr: number;
	superFarmApr?: number;
	totalStakedInUsd: number;
	rewardRatePerWeek: TokenAmount;
	stakedInUsd: number;
	unclaimedAmount: TokenAmount;
	symbol: string;
}
