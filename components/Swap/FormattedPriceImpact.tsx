import { Percent } from "@pollum-io/pegasys-sdk";
import { Text } from "@chakra-ui/react";
import { priceImpactSeverity } from "utils";
import { usePicasso } from "hooks";
import { ONE_BIPS } from "pegasys-services";

export const FormattedPriceImpat = ({
	priceImpact,
}: {
	priceImpact?: Percent;
}) => {
	const theme = usePicasso();

	const getColorBySeverity = () => {
		const severity = priceImpactSeverity(priceImpact);

		return severity === 3 || severity === 4
			? "#FF6871"
			: severity === 2
			? "#FFE270"
			: severity === 1
			? theme.text.mono
			: "#27AE60";
	};

	return (
		<Text fontWeight="medium" fontSize="sm" color={getColorBySeverity()}>
			{priceImpact
				? priceImpact.lessThan(ONE_BIPS)
					? "<0.01%"
					: `${priceImpact.toFixed(2)}%`
				: "-"}
		</Text>
	);
};
