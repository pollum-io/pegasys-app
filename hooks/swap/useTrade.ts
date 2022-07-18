import { useMemo } from "react";
import { Currency, Trade, CurrencyAmount, Route } from "@pollum-io/pegasys-sdk";
import { IWalletHookInfos } from "types";
import { useAllCommonPairs } from "./useAllCommonPairs";

export async function useTradeExactIn(
	currencyAmountIn?: CurrencyAmount,
	currencyOut?: Currency,
	walletInfos?: IWalletHookInfos
): Promise<Trade | null> {
	const allowedPairs = await useAllCommonPairs(
		currencyAmountIn?.currency as Currency,
		currencyOut as Currency,
		walletInfos as IWalletHookInfos
	);

	console.log("pairsIn:", allowedPairs);

	if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
		return (
			Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
				maxHops: 3,
				maxNumResults: 1,
			})[0] ?? null
		);
	}
	return null;
}

export async function useTradeExactOut(
	currencyIn?: Currency,
	currencyAmountOut?: CurrencyAmount,
	walletInfos?: IWalletHookInfos
): Promise<Trade | null> {
	const allowedPairs = await useAllCommonPairs(
		currencyIn as Currency,
		currencyAmountOut?.currency as Currency,
		walletInfos as IWalletHookInfos
	);

	console.log("pairsOut:", allowedPairs);

	if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
		return (
			Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut)[0] ??
			null
		);
	}
	return null;
}
