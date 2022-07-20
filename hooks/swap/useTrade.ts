import {
	Currency,
	Trade,
	CurrencyAmount,
	Pair,
	TokenAmount,
	Route,
	TradeType,
	ChainId,
} from "@pollum-io/pegasys-sdk";
import { IWalletHookInfos } from "types";
import { useAllCommonPairs } from "./useAllCommonPairs";

export async function useTradeExactIn(
	currencyAmountIn?: CurrencyAmount,
	currencyOut?: Currency,
	walletInfos?: IWalletHookInfos,
	typedValue?: string
): Promise<Trade | null> {
	console.log("ExactIn - ", {
		currencyIn: currencyAmountIn?.currency,
		currencyOut,
	});
	const allowedPairs = await useAllCommonPairs(
		currencyAmountIn?.currency as Currency,
		currencyOut as Currency,
		walletInfos as IWalletHookInfos
	);
	console.log("allowedPairs: ", allowedPairs);
	// const tokenIn = allowedPairs[0]?.token1;
	// const tokenOut = allowedPairs[0]?.token0;

	// // console.log("allowedPairs", { tokenIn, tokenOut, currencyAmountIn });

	// const pair =
	// 	tokenIn &&
	// 	tokenOut &&
	// 	new Pair(new TokenAmount(tokenIn, "39"), new TokenAmount(tokenOut, "8992"));

	// const route = pair && new Route([pair], tokenIn);

	// const trade =
	// 	route &&
	// 	new Trade(
	// 		route,
	// 		new TokenAmount(tokenIn, typedValue),
	// 		TradeType.EXACT_INPUT,
	// 		ChainId.TANENBAUM
	// 	);
	// console.log("exactIn - ", {
	// 	input: Number(trade?.inputAmount.toExact()) * 10 ** 18,
	// 	output: Number(trade?.outputAmount.toExact()) * 10 ** 18,
	// });

	// return trade;

	if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
		return (Trade.bestTradeExactIn(
			allowedPairs,
			currencyAmountIn,
			currencyOut,
			{
				maxHops: 3,
				maxNumResults: 1,
			}
		) ?? null)[0];
	}
	return null;
}

export async function useTradeExactOut(
	currencyIn?: Currency,
	currencyAmountOut?: CurrencyAmount,
	walletInfos?: IWalletHookInfos,
	typedValue?: string
): Promise<Trade | null> {
	console.log("ExactOut - ", {
		currencyIn,
		currencyOut: currencyAmountOut?.currency,
	});
	const allowedPairs = await useAllCommonPairs(
		currencyIn as Currency,
		currencyAmountOut?.currency as Currency,
		walletInfos as IWalletHookInfos
	);

	// console.log('allowedPairs', allowedPairs)
	// const tokenIn = allowedPairs[0]?.token0;
	// const tokenOut = allowedPairs[0]?.token1;

	// const pair =
	// 	tokenIn &&
	// 	tokenOut &&
	// 	new Pair(new TokenAmount(tokenIn, "8992"), new TokenAmount(tokenOut, "39"));

	// const route = pair && new Route([pair], tokenIn);

	// const trade =
	// 	route &&
	// 	new Trade(
	// 		route,
	// 		new TokenAmount(tokenOut, typedValue),
	// 		TradeType.EXACT_OUTPUT,
	// 		ChainId.TANENBAUM
	// 	);

	// console.log("exactOut - ", {
	// 	input: Number(trade?.inputAmount.toExact()) * 10 ** 18,
	// 	output: Number(trade?.outputAmount.toExact()) * 10 ** 18,
	// });

	// return trade;

	if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
		return (Trade.bestTradeExactOut(
			allowedPairs,
			currencyIn,
			currencyAmountOut
		) ?? null)[0];
	}
	return null;
}
