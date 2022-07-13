import {
	Currency,
	CurrencyAmount,
	JSBI,
	Token,
	TokenAmount,
} from "@pollum-io/pegasys-sdk";
import { parseUnits } from "@ethersproject/units";

export function tryParseAmount(
	value: string,
	currency: Currency
): CurrencyAmount {
	try {
		const typedValueParsed = parseUnits(value, currency.decimals).toString();
		if (typedValueParsed !== "0") {
			return new TokenAmount(currency as Token, JSBI.BigInt(typedValueParsed));
		}
	} catch (error) {
		// should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
		// eslint-disable-next-line
		console.debug(`Failed to parse input amount: "${value}"`, error);
	}
	// necessary for all paths to return a value
	return undefined;
}
