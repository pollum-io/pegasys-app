import { Percent } from "@pollum-io/pegasys-sdk";
import {
	ALLOWED_PRICE_IMPACT_HIGH,
	ALLOWED_PRICE_IMPACT_LOW,
	ALLOWED_PRICE_IMPACT_MEDIUM,
	BLOCKED_PRICE_IMPACT_NON_EXPERT,
} from "helpers/consts";

export const priceImpactSeverity = (
	receivedPriceImpact: Percent | undefined
) => {
	if (!receivedPriceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4;
	if (!receivedPriceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3;
	if (!receivedPriceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2;
	if (!receivedPriceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1;
	return 0;
};
