import { apolloClient, GET_TOKENS_GRAPH_CANDLE } from "apollo/index";
import { Token } from "@pollum-io/pegasys-sdk";

export async function getTokensGraphCandle(
	token0: Token,
	token1: Token,
	period = 900
) {
	const result = await apolloClient.query({
		query: GET_TOKENS_GRAPH_CANDLE,
		variables: {
			token0: token0?.address,
			token1: token1?.address,
			period,
		},
		fetchPolicy: "cache-first",
	});

	return result.data.candles;
}
