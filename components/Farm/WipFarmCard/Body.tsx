import React, { useMemo } from "react";
import { Flex, Text } from "@chakra-ui/react";

import { formattedNum } from "utils/convert/numberFormat";
import { usePicasso } from "hooks";
import { BIG_INT_ZERO } from "pegasys-services";
import { JSBI } from "@pollum-io/pegasys-sdk";
import { IBodyProps, ICardItemProps } from "./dto";

const CardItem: React.FC<ICardItemProps> = ({ text, value, color }) => {
	const theme = usePicasso();

	const finalColor = useMemo(
		() => (color ? theme.text.cyanPurple : undefined),
		[color]
	);

	return (
		<Flex justifyContent="space-between" py="1.5" fontSize="sm">
			<Text fontWeight="semibold" color={finalColor}>
				{text}
			</Text>
			<Text color={finalColor}>{value}</Text>
		</Flex>
	);
};

const Body: React.FC<IBodyProps> = ({
	swapFeeApr,
	combinedApr,
	superFarmApr,
	totalStakedInUsd,
	rewardRatePerWeek,
	stakedInUsd,
	unclaimedAmount,
	symbol,
}) => {
	const theme = usePicasso();

	const showUserEarn = useMemo(
		() =>
			JSBI.greaterThan(rewardRatePerWeek.raw, BIG_INT_ZERO) ||
			JSBI.greaterThan(unclaimedAmount.raw, BIG_INT_ZERO),
		[rewardRatePerWeek, unclaimedAmount]
	);

	return (
		<Flex alignItems="center" width="100%" flexDirection="column">
			<Flex flexDirection="column" pt="6">
				<CardItem
					value={`${formattedNum(totalStakedInUsd, true)}`}
					text="Total Staked"
					color
				/>
				<CardItem
					value={`${formattedNum(stakedInUsd, true)}`}
					text="Your Stake"
				/>
				<CardItem value={`${swapFeeApr}%`} text="Swap Fee APR" />
				{!!superFarmApr && (
					<>
						<CardItem value={`${superFarmApr}%`} text="Super Farm APR" />
						<CardItem value={`${combinedApr}%`} text="Total APR" />
					</>
				)}
			</Flex>
			{showUserEarn && (
				<Flex
					flexDirection="column"
					backgroundColor={theme.bg.neutralGray}
					borderRadius="0.375rem"
					py="0.5rem"
					px="1rem"
					mt="0.688rem"
					// mb="1.5rem"
				>
					<CardItem
						value={`${rewardRatePerWeek.toSignificant(6)} ${symbol}/Week`}
						text="Your Rate"
					/>
					<CardItem
						value={`${unclaimedAmount.toSignificant()} ${symbol}`}
						text="Your Unclaimed"
					/>
				</Flex>
			)}
		</Flex>
	);
};

export default Body;
