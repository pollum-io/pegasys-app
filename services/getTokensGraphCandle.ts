import { apolloClient, GET_TOKENS_GRAPH_CANDLE } from "apollo/index";
import { Token } from "@pollum-io/pegasys-sdk";
import { IChartComponentData, WrappedTokenInfo } from "types";

export async function getTokensGraphCandle(
	token0: Token | WrappedTokenInfo,
	token1: Token | WrappedTokenInfo,
	setIsLoadingCandles: React.Dispatch<React.SetStateAction<boolean>>,
	period = 900
): Promise<IChartComponentData[]> {
	const isWrap =
		(token0.symbol === "SYS" && token1.symbol === "WSYS") ||
		(token0.symbol === "WSYS" && token1.symbol === "SYS");

	if (isWrap) return [];

	setIsLoadingCandles(true);

	const result = await apolloClient.query({
		query: GET_TOKENS_GRAPH_CANDLE,
		variables: {
			token0: token0?.address,
			token1: token1?.address,
			period,
		},
		fetchPolicy: "cache-first",
	});
	// .catch(() => setIsLoadingCandles(false))
	// .finally(() => setIsLoadingCandles(false));

	return result?.data?.candles;
}
