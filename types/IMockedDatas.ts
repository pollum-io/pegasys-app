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
