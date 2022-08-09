import gql from "graphql-tag";

export const GET_TOKENS_GRAPH_CANDLE = gql`
	query candles($token0: String!, $token1: String!, $period: Int!) {
		candles(
			orderBy: time
			orderDirection: desc
			where: { token0: $token0, token1: $token1, period: $period }
		) {
			id
			time
			period
			open
			high
			low
			close
		}
	}
`;
