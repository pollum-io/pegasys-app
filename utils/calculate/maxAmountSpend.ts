import { CurrencyAmount, JSBI, NSYS } from "@pollum-io/pegasys-sdk";
import { MIN_ETH } from "pegasys-services/constants";

export const maxAmountSpend = (
	currencyAmount?: CurrencyAmount
): CurrencyAmount | undefined => {
	if (!currencyAmount) return undefined;
	if (
		currencyAmount.currency === NSYS ||
		currencyAmount.currency.symbol === "SYS"
	) {
		if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
			return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH));
		}
		return CurrencyAmount.ether(JSBI.BigInt(0));
	}
	return currencyAmount;
};
