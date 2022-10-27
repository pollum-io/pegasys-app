import React from "react";
import { Flex, Grid } from "@chakra-ui/react";

import { formattedNum } from "utils/numberFormat";
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
		width="100%"
	>
		<Grid
			templateColumns={[
				"repeat(1, 1fr)",
				"repeat(1, 1fr)",
				"repeat(3, 1fr)",
				"repeat(3, 1fr)",
			]}
			gap={["1rem", "1rem", "2rem", "2rem"]}
			px="8"
		>
			<CardItem text="APR" value={`${apr}%`} />
			<CardItem
				text="Total staked"
				usdValue={`${formattedNum(totalStakedInUsd, true)} USD`}
				value={`${totalStakedAmount.toSignificant()} ${symbol}`}
			/>
			<CardItem
				text="Your rate"
				usdValue={`${formattedNum(rewardRatePerWeekInUsd, true)} USD/Week`}
				value={`${rewardRatePerWeek.toSignificant()} ${symbol}/Week`}
			/>
			<CardItem
				text="Your Staked"
				usdValue={`${formattedNum(stakedInUsd, true)} USD`}
				value={`${stakedAmount.toSignificant()} ${symbol}`}
			/>
			<CardItem
				text="Your unclaimed"
				usdValue={`${formattedNum(unclaimedInUsd, true)} USD`}
				value={`${unclaimedAmount.toSignificant()} ${symbol}`}
			/>
		</Grid>
	</Flex>
);

export default Body;
