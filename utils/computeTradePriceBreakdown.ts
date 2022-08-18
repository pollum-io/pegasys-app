import {
	CurrencyAmount,
	Fraction,
	Percent,
	TokenAmount,
	Trade,
} from "@pollum-io/pegasys-sdk";
import {
	ONE_HUNDRED_PERCENT,
	INPUT_FRACTION_AFTER_FEE,
	ALLOWED_PRICE_IMPACT_LOW,
	ALLOWED_PRICE_IMPACT_MEDIUM,
	ALLOWED_PRICE_IMPACT_HIGH,
	BLOCKED_PRICE_IMPACT_NON_EXPERT,
} from "helpers/consts";

export function warningSeverity(
	priceImpact: Percent | undefined
): 0 | 1 | 2 | 3 | 4 {
	if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4;
	if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3;
	if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2;
	if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1;
	return 0;
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade: Trade): {
	priceImpactWithoutFee?: Percent;
	realizedLPFee?: CurrencyAmount;
	priceImpactSeverity?: 0 | 1 | 2 | 3 | 4;
} {
	if (!trade) return {};

	// for each hop in our trade, take away the x*y=k price impact from 0.3% fees
	// e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
	const realizedLPFee = !trade
		? undefined
		: ONE_HUNDRED_PERCENT.subtract(
				trade.route.pairs.reduce<Fraction>(
					(currentFee: Fraction): Fraction =>
						currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
					ONE_HUNDRED_PERCENT
				)
		  );

	// remove lp fees from price impact
	const priceImpactWithoutFeeFraction =
		trade && realizedLPFee
			? trade.priceImpact.subtract(realizedLPFee)
			: undefined;

	// the x*y=k impact
	const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
		? new Percent(
				priceImpactWithoutFeeFraction?.numerator,
				priceImpactWithoutFeeFraction?.denominator
		  )
		: undefined;

	// the amount of the input that accrues to LPs
	const realizedLPFeeAmount =
		realizedLPFee &&
		trade &&
		(trade.inputAmount instanceof TokenAmount
			? new TokenAmount(
					trade.inputAmount.token,
					realizedLPFee.multiply(trade.inputAmount.raw).quotient
			  )
			: CurrencyAmount.ether(
					realizedLPFee.multiply(trade.inputAmount.raw).quotient
			  ));

	// warnings on slippage
	const priceImpactSeverity = warningSeverity(priceImpactWithoutFeePercent);

	return {
		priceImpactWithoutFee: priceImpactWithoutFeePercent,
		realizedLPFee: realizedLPFeeAmount,
		priceImpactSeverity,
	};
}
