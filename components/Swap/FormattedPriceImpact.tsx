import { Percent } from "@pollum-io/pegasys-sdk";
import { Text } from "@chakra-ui/react";
import {
	ALLOWED_PRICE_IMPACT_HIGH,
	ALLOWED_PRICE_IMPACT_LOW,
	ALLOWED_PRICE_IMPACT_MEDIUM,
	BLOCKED_PRICE_IMPACT_NON_EXPERT,
	ONE_BIPS,
} from "helpers/consts";

export const FormattedPriceImpat = ({
	priceImpact,
}: {
	priceImpact?: Percent;
}) => {
	const priceImpactSererity = (receivedPriceImpact: Percent | undefined) => {
		if (!receivedPriceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT))
			return 4;
		if (!receivedPriceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3;
		if (!receivedPriceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2;
		if (!receivedPriceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1;
		return 0;
	};

	const getColorBySeverity = () => {
		const severity = priceImpactSererity(priceImpact);

		return severity === 3 || severity === 4
			? "#FF6871"
			: severity === 2
			? "#FFE270"
			: severity === 1
			? "#FFFFFF"
			: "#27AE60";
	};

	return (
		<Text fontWeight="medium" color={getColorBySeverity()}>
			{priceImpact
				? priceImpact.lessThan(ONE_BIPS)
					? "<0.01%"
					: `${priceImpact.toFixed(2)}%`
				: "-"}
		</Text>
	);
};
