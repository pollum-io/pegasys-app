import { CurrencyAmount, Trade } from "@pollum-io/pegasys-sdk";
import { basisPointsToPercent } from "./basisPointsToPercent";

export enum Field {
	INPUT = "INPUT",
	OUTPUT = "OUTPUT",
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
	trade: Trade | undefined,
	allowedSlippage: number
): { [field in Field]?: CurrencyAmount } {
	const pct = basisPointsToPercent(allowedSlippage);
	return {
		[Field.INPUT]: trade?.maximumAmountIn(pct),
		[Field.OUTPUT]: trade?.minimumAmountOut(pct),
	};
}
