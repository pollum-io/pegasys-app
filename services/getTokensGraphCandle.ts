import { apolloClient, GET_TOKENS_GRAPH_CANDLE } from "apollo/index";

export async function getTokensGraphCandle(
	token0: string,
	token1: string,
	period: number
) {
	const result = await apolloClient.query({
		query: GET_TOKENS_GRAPH_CANDLE,
		variables: {
			token0,
			token1,
			period,
		},
		fetchPolicy: "cache-first",
	});

	return result.data.candles;
}
