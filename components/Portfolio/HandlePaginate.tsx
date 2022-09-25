import {
	ILiquidityCardsMockedData,
	ITransactionCardsMockedData,
	IWalletStatsCardsMockedData,
} from "types";

export const handlePaginate = (
	arrayValue:
		| ILiquidityCardsMockedData[]
		| IWalletStatsCardsMockedData[]
		| ITransactionCardsMockedData[],
	pageSize: number,
	currentPage: number,
	setCardsSliced: React.Dispatch<
		React.SetStateAction<
			| ILiquidityCardsMockedData[]
			| IWalletStatsCardsMockedData[]
			| ITransactionCardsMockedData[]
		>
	>
) => {
	const sliced = arrayValue?.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	);

	setCardsSliced(sliced);

	return sliced;
};
