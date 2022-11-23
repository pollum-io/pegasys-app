import React from "react";
import { Flex } from "@chakra-ui/react";

import { formattedNum } from "utils/convert/numberFormat";
import { BIG_INT_ONE, formatBigNumbers } from "pegasys-services";
import { JSBI } from "@pollum-io/pegasys-sdk";
import { IBodyProps } from "./dto";
import CardItem from "./CardItem";

const Body: React.FC<IBodyProps> = ({
	symbol,
	apr,
	totalStakedInUsd,
	totalStakedAmount,
	rewardRatePerWeekInUsd,
	rewardRatePerWeek,
	stakedInUsd,
	stakedAmount,
	unclaimedInUsd,
	unclaimedAmount,
}) => (
	<Flex
		alignItems={["flex-start", "flex-start", "center", "center"]}
		rowGap={["1rem", "1rem", "2rem", "2rem"]}
		justifyContent="center"
		flexWrap="wrap"
		width="100%"
		padding="0rem 1rem"
	>
		<CardItem text="APR" value={`${apr}%`} />
		<CardItem
			text="Total staked"
			usdValue={`${formattedNum(totalStakedInUsd, true)} USD`}
			value={`${formatBigNumbers(
				Number(totalStakedAmount.toSignificant())
			)} ${symbol}`}
			opacity={JSBI.lessThanOrEqual(totalStakedAmount.raw, BIG_INT_ONE)}
		/>
		<CardItem
			text="Your rate"
			usdValue={`${formattedNum(rewardRatePerWeekInUsd, true)} USD/Week`}
			value={`${rewardRatePerWeek.toSignificant()} ${symbol}/Week`}
			opacity={JSBI.lessThanOrEqual(rewardRatePerWeek.raw, BIG_INT_ONE)}
		/>
		<CardItem
			text="Your Staked"
			usdValue={`${formattedNum(stakedInUsd, true)} USD`}
			value={`${stakedAmount.toSignificant()} ${symbol}`}
			opacity={JSBI.lessThanOrEqual(stakedAmount.raw, BIG_INT_ONE)}
		/>
		<CardItem
			text="Your unclaimed"
			usdValue={`${formattedNum(unclaimedInUsd, true)} USD`}
			value={`${unclaimedAmount.toSignificant()} ${symbol}`}
			opacity={JSBI.lessThanOrEqual(unclaimedAmount.raw, BIG_INT_ONE)}
		/>
	</Flex>
);

export default Body;
