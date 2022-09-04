import { CurrencyAmount, JSBI } from "@pollum-io/pegasys-sdk";

export function calculateSlippageAmount(
	value: CurrencyAmount,
	slippage: number
): [JSBI, JSBI] {
	if (slippage < 0 || slippage > 10000) {
		throw Error(`Unexpected slippage value: ${slippage}`);
	}
	return [
		JSBI.divide(
			JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)),
			JSBI.BigInt(10000)
		),
		JSBI.divide(
			JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)),
			JSBI.BigInt(10000)
		),
	];
}
