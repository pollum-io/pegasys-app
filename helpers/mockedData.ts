import {
	ONE_HOUR_IN_SECONDS,
	ONE_DAY_IN_SECONDS,
	FIVE_MINUTES_IN_SECONDS,
	FIFTEEN_MINUTES_IN_SECONDS,
	FOUR_HOURS_IN_SECONDS,
	ONE_WEEK_IN_SECONDS,
} from "helpers/consts";
import {
	IPeriodsMockedData,
	ISlippageMockedValues,
	ILiquidityCardsMockedData,
} from "types";

export const mockedSlippageValues: ISlippageMockedValues[] = [
	{
		id: 0,
		valueInBips: 10,
	},
	{
		id: 1,
		valueInBips: 50,
	},
	{
		id: 2,
		valueInBips: 100,
	},
];

export const periodsMockedData: IPeriodsMockedData[] = [
	{
		id: 1,
		inputValue: "5m",
		period: FIVE_MINUTES_IN_SECONDS,
	},
	{
		id: 2,
		inputValue: "15m",
		period: FIFTEEN_MINUTES_IN_SECONDS,
	},
	{
		id: 3,
		inputValue: "1h",
		period: ONE_HOUR_IN_SECONDS,
	},
	{
		id: 4,
		inputValue: "4h",
		period: FOUR_HOURS_IN_SECONDS,
	},
	{
		id: 5,
		inputValue: "1d",
		period: ONE_DAY_IN_SECONDS,
	},
	{
		id: 6,
		inputValue: "1w",
		period: ONE_WEEK_IN_SECONDS,
	},
];

export const liquidityCardsMockedData: ILiquidityCardsMockedData[] = [
	{
		id: 0,
		firstAsset: "SYS",
		secondAsset: "PSYS",
		firstIcon: "icons/syscoin-logo.png",
		secondIcon: "icons/pegasys.png",
		apr: "1%",
		poolShare: "< 0.015%",
		value: "$0.1433",
		firstPooledTokens: "0.0325644",
		secondPooledTokens: "0.6598744",
	},
	{
		id: 1,
		firstAsset: "SYS",
		secondAsset: "PSYS",
		firstIcon: "icons/syscoin-logo.png",
		secondIcon: "icons/pegasys.png",
		apr: "2%",
		poolShare: "< 0.015%",
		value: "$0.3",
		firstPooledTokens: "0.0325644",
		secondPooledTokens: "0.6598744",
	},
	{
		id: 2,
		firstAsset: "SYS",
		secondAsset: "PSYS",
		firstIcon: "icons/syscoin-logo.png",
		secondIcon: "icons/pegasys.png",
		apr: "3%",
		poolShare: "< 0.015%",
		value: "$0.4",
		firstPooledTokens: "0.0325644",
		secondPooledTokens: "0.6598744",
	},
	{
		id: 3,
		firstAsset: "SYS",
		secondAsset: "PSYS",
		firstIcon: "icons/syscoin-logo.png",
		secondIcon: "icons/pegasys.png",
		apr: "4%",
		poolShare: "< 0.015%",
		value: "$0.5",
		firstPooledTokens: "0.0325644",
		secondPooledTokens: "0.6598744",
	},
];
