import { IChartComponentPeriod } from "types";

export interface IPeriodsMockedData extends IChartComponentPeriod {
	inputValue: string;
}

export interface ISlippageMockedValues {
	id: number;
	valueInBips: number;
}

export interface ILiquidityCardsMockedData {
	id: number;
	firstAsset: string;
	secondAsset: string;
	firstIcon: string;
	secondIcon: string;
	apr: string;
	poolShare: string;
	value: string;
	firstPooledTokens: string;
	secondPooledTokens: string;
}

export interface IWalletStatsCardsMockedData {
	id: number;
	asset: string;
	icon: string;
	price: string;
	balance: string;
	value: string;
}
export interface ITransactionCardsMockedData {
	id: number;
	type: string;
	totalValue: string;
	totalAmount: string;
	tokenAmount: string;
	time: string;
}
