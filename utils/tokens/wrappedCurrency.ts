import {
	ChainId,
	Currency,
	CurrencyAmount,
	NSYS,
	Token,
	TokenAmount,
	WSYS,
} from "@pollum-io/pegasys-sdk";

export function wrappedCurrency(currency: Currency, chainId: ChainId) {
	const currencyValidations =
		currency?.symbol === "SYS" ||
		currency?.symbol === "TSYS" ||
		currency?.symbol === "WSYS";

	return chainId && currencyValidations
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
