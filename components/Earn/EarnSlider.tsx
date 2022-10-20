import React, { useState } from "react";
import {
	Flex,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Tooltip,
} from "@chakra-ui/react";
import { Percent, TokenAmount } from "@pollum-io/pegasys-sdk";

import { usePicasso } from "hooks";
import { BIG_INT_ZERO, useEarn } from "pegasys-services";

const EarnSlider: React.FC = () => {
	const [showTooltip, setShowTooltip] = useState<boolean>(false);
	const { selectedOpportunity, setWithdrawTypedValue, withdrawPercentage } =
		useEarn();
	const theme = usePicasso();

	const setPercentage = (value: number) => {
		if (selectedOpportunity) {
			const percent = new Percent(value.toString(), "100");

			const valuePercent = percent.multiply(
				selectedOpportunity.stakedAmount.raw ?? BIG_INT_ZERO
			).quotient;

			const amount = new TokenAmount(
				selectedOpportunity.stakeToken,
				valuePercent
			);

			setWithdrawTypedValue(amount.toExact());
		}
	};

	if (!selectedOpportunity) {
		return null;
	}

	return (
		<Flex alignItems="center" flexDirection="column">
			<Slider
				id="slider"
				mt="9"
				defaultValue={5}
				min={0}
				max={100}
				mb="4"
				w="85%"
				colorScheme="teal"
				onChange={setPercentage}
				onMouseEnter={() => setShowTooltip(true)}
				onMouseLeave={() => setShowTooltip(false)}
				value={withdrawPercentage}
			>
				<SliderTrack>
					<SliderFilledTrack bg={theme.text.psysBalance} />
				</SliderTrack>

				<Tooltip
					hasArrow
					filter="drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.1)) drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.06))"
					bgColor={theme.bg.secondary}
					color={theme.text.mono}
					placement="top"
					isOpen={showTooltip}
					label={`${withdrawPercentage}%`}
				>
					<SliderThumb />
				</Tooltip>
			</Slider>
			<Flex w="85%" justifyContent="space-between">
				{[0, 25, 50, 75, 100].map(value => (
					<Flex
						key={value}
						cursor="pointer"
						fontSize="sm"
						color={theme.text.softGray}
						onClick={() => setPercentage(value)}
					>
						{value}%
					</Flex>
				))}
			</Flex>
		</Flex>
	);
};

export default EarnSlider;
