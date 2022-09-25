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
	IWalletStatsCardsMockedData,
	ITransactionCardsMockedData,
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
		value: "$900.000",
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
		poolShare: "< 0.01544%",
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

export const walletStatsCardsMockedData: IWalletStatsCardsMockedData[] = [
	{
		id: 0,
		asset: "SYS",
		icon: "icons/syscoin-logo.png",
		price: "$1.999,043.27",
		balance: "0.00005544",
		value: "$0.06",
	},
	{
		id: 1,
		asset: "USDC",
		icon: "icons/usdc.png",
		price: "$1,043.27",
		balance: "0.00005",
		value: "$0.01",
	},
	{
		id: 2,
		asset: "PSYS",
		icon: "icons/syscoin-logo.png",
		price: "$3,043.27",
		balance: "0.0000554999",
		value: "$0.06",
	},
	{
		id: 3,
		asset: "SYS",
		icon: "icons/syscoin-logo.png",
		price: "$1,043.27",
		balance: "1.555667",
		value: "$0.10",
	},
];

export const transactionCardsMockedData: ITransactionCardsMockedData[] = [
	{
		id: 0,
		type: "Add USDT and BUSD",
		totalValue: "$0.112",
		totalAmount: "0.045234 USDT",
		tokenAmount: "0.0034234 BUSD",
		time: "1 days ago",
	},
	{
		id: 1,
		type: "Add USDT and BUSD",
		totalValue: "$0.045747555",
		totalAmount: "0.04345 USDT",
		tokenAmount: "0.01221 BUSD",
		time: "2 days ago",
	},
	{
		id: 2,
		type: "Add USDT and BUSD",
		totalValue: "$0.09",
		totalAmount: "0.045 USDT",
		tokenAmount: "0.00 BUSD",
		time: "3 days ago",
	},
	{
		id: 3,
		type: "Add USDT and BUSD",
		totalValue: "$0.09",
		totalAmount: "0.045856 USDT",
		tokenAmount: "0.00 BUSD",
		time: "19 Jan 2021",
	},
];
