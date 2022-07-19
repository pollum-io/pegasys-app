import {
	ChainId,
	Currency,
	CurrencyAmount,
	NSYS,
	Token,
	TokenAmount,
	WSYS,
} from "@pollum-io/pegasys-sdk";

const SYS: Currency = {
	decimals: 18,
	symbol: "SYS",
	name: "Syscoin",
};

export function wrappedCurrency(currency: Currency, chainId: ChainId) {
	console.log("currency", currency);
	return chainId && currency?.name === "Syscoin"
		? WSYS[chainId]
		: currency instanceof Token
		? currency
		: undefined;
}

export function wrappedCurrencyAmount(
	currencyAmount: CurrencyAmount | undefined,
	chainId: ChainId | undefined
): TokenAmount | undefined {
	const token =
		currencyAmount && chainId
			? wrappedCurrency(currencyAmount?.currency, chainId)
			: undefined;
	return token && currencyAmount
		? new TokenAmount(token, currencyAmount?.raw)
		: undefined;
}

export function unwrappedToken(token: Token): Currency {
	if (token?.equals(WSYS[token?.chainId])) return NSYS;
	return token;
}
