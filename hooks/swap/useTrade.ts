import {
	Currency,
	Trade,
	CurrencyAmount,
	Route,
	Pair,
	ChainId,
	TradeType,
} from "@pollum-io/pegasys-sdk";
import { IWalletHookInfos } from "types";
import { useAllCommonPairs } from "./useAllCommonPairs";

export async function useTradeExactIn(
	currencyAmountIn: CurrencyAmount,
	currencyOut: Currency,
	walletInfos: IWalletHookInfos
): Promise<Trade | null> {
	const allowedPairs = await useAllCommonPairs(
		currencyAmountIn?.currency as Currency,
		currencyOut as Currency,
		walletInfos as IWalletHookInfos
	);

	// console.log("pairsIn:", allowedPairs);

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
	currencyIn: Currency,
	currencyAmountOut: CurrencyAmount,
	walletInfos: IWalletHookInfos
): Promise<Trade | null> {
	const allowedPairs = await useAllCommonPairs(
		currencyIn as Currency,
		currencyAmountOut?.currency as Currency,
		walletInfos as IWalletHookInfos
	);

	const pair = new Pair(
		allowedPairs[0].reserve0,
		allowedPairs[0].reserve1,
		ChainId.TANENBAUM
	);

	const route = new Route([pair], allowedPairs[0].token0);

	const trade = new Trade(
		route,
		allowedPairs[0].reserve0,
		TradeType.EXACT_INPUT,
		ChainId.TANENBAUM
	);
	console.log(trade);

	return trade;
	// if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
	// 	return (
	// 		Trade.bestTradeExactOut(
	// 			allowedPairs,
	// 			currencyIn,
	// 			currencyAmountOut,
	// 			{
	// 				maxHops: 3,
	// 				maxNumResults: 1,
	// 			},
	// 			allowedPairs
	// 		)[0] ?? null
	// 	);
	// }
	// return null;
}
