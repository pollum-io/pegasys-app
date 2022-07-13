import {
	Currency,
	Pair,
	Trade,
	Token,
	TokenAmount,
	Route,
	ChainId,
} from "@pollum-io/pegasys-sdk";

interface CurrencyWithAddress extends Currency {
	address?: string;
}

export function useTradeExactIn(
	currencyIn: CurrencyWithAddress,
	valueIn: string,
	currencyOut: CurrencyWithAddress,
	valueOut: string,
	chain: number
): Trade | null {
	const tokenIn = new Token(
		chain === 5700 ? ChainId.TANENBAUM : ChainId.NEVM,
		currencyIn.address,
		18,
		currencyIn.symbol,
		currencyIn.name
	);

	const tokenOut = new Token(
		chain === 5700 ? ChainId.TANENBAUM : ChainId.NEVM,
		currencyOut.address,
		18,
		currencyOut.symbol,
		currencyOut.name
	);

	const pair = new Pair(
		new TokenAmount(tokenIn, "2000000"),
		new TokenAmount(tokenOut, "1000000"),
		ChainId.TANENBAUM
	);

	const TokenInToTokenOutRoute = new Route([pair], tokenOut);

	const trade = new Trade(
		TokenInToTokenOutRoute,
		new TokenAmount(tokenIn, valueIn)
	);

	return trade;
}
