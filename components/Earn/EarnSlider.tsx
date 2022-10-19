import React, { useState } from "react";
import {
	Collapse,
	Flex,
	Slider,
	SliderFilledTrack,
	SliderMark,
	SliderThumb,
	SliderTrack,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { JSBI, Percent, TokenAmount } from "@pollum-io/pegasys-sdk";

import { usePicasso } from "hooks";
import { useEarn } from "pegasys-services";

const EarnSlider: React.FC = () => {
	const [sliderValue, setSliderValue] = useState<number>(0);
	const [showTooltip, setShowTooltip] = useState<boolean>(false);
	const { selectedOpportunity, setWithdrawTypedValue } = useEarn();
	const theme = usePicasso();

	if (!selectedOpportunity) {
		return null;
	}

	return (
		<Flex justify="center">
			<Slider
				id="slider"
				mt="9"
				defaultValue={5}
				min={0}
				max={100}
				mb="4"
				w="85%"
				colorScheme="teal"
				onChange={(value: number) => {
					setSliderValue(value);
					const percent = new Percent(value.toString(), "100");

					const valuePercent = percent.multiply(
						selectedOpportunity.stakedAmount.raw ?? JSBI.BigInt(0)
					).quotient;

					const amount = new TokenAmount(
						selectedOpportunity.stakeToken,
						valuePercent
					);

					setWithdrawTypedValue(amount.toExact());
				}}
				onMouseEnter={() => setShowTooltip(true)}
				onMouseLeave={() => setShowTooltip(false)}
			>
				<SliderMark value={0} mt="0.5rem" ml="1.5" fontSize="sm">
					0%
				</SliderMark>
				<SliderMark value={25} mt="0.5rem" ml="-2.5" fontSize="sm">
					25%
				</SliderMark>
				<SliderMark value={50} mt="0.5rem" ml="-2.5" fontSize="sm">
					50%
				</SliderMark>
				<SliderMark value={75} mt="0.5rem" ml="-2.5" fontSize="sm">
					75%
				</SliderMark>
				<SliderMark value={100} mt="0.5rem" ml="-8" fontSize="sm">
					100%
				</SliderMark>
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
					label={`${sliderValue}%`}
				>
					<SliderThumb />
				</Tooltip>
			</Slider>
		</Flex>
	);
};

export default EarnSlider;
