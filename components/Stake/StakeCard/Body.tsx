import React from "react";
import { Flex } from "@chakra-ui/react";

import { formattedNum } from "utils/convert/numberFormat";
import { BIG_INT_ONE, formatBigNumbers } from "pegasys-services";
import { useTranslation } from "react-i18next";
import { JSBI } from "@pollum-io/pegasys-sdk";
import { verifyZerosInBalanceAndFormat } from "utils";
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
	depositFee,
	isPeriodFinish,
}) => {
	const { t } = useTranslation();

	return (
		<Flex
			flexDirection="column"
			width="100%"
			alignItems="center"
			gap="1rem"
			padding="1rem 0"
		>
			<Flex
				alignItems={["flex-start", "flex-start", "center", "center"]}
				justifyContent="space-between"
				flexWrap="wrap"
				rowGap="1rem"
				width="85%"
			>
				<CardItem
					tooltip={
						typeof depositFee === "number"
							? "The APR metric shows an annualized return that is forecasted, based on the revenue collected over the previous thirty days."
							: undefined
					}
					text="APR"
					value={`${isPeriodFinish ? 0 : apr}%`}
				/>
				<CardItem
					text={t("earnPages.totalStaked")}
					usdValue={`${formattedNum(totalStakedInUsd, true)} USD`}
					value={`${formatBigNumbers(
						parseFloat(totalStakedAmount.toExact())
					)} ${symbol}`}
					opacity={JSBI.lessThanOrEqual(totalStakedAmount.raw, BIG_INT_ONE)}
				/>
				{rewardRatePerWeek && typeof rewardRatePerWeekInUsd === "number" && (
					<CardItem
						text={t("earnPages.yourRate")}
						usdValue={`${formattedNum(rewardRatePerWeekInUsd, true)} USD/${t(
							"earnPages.week"
						)}`}
						value={`${verifyZerosInBalanceAndFormat(
							parseFloat(rewardRatePerWeek.toExact())
						)} ${symbol}/${t("earnPages.week")}`}
						opacity={JSBI.lessThanOrEqual(rewardRatePerWeek.raw, BIG_INT_ONE)}
					/>
				)}
				{typeof depositFee === "number" && (
					<CardItem
						tooltip="Deposit fee is deducted when you deposit your PSYS tokens. The deposit fee may be modified at any time."
						text="Deposit Fee"
						value={`${depositFee}%`}
					/>
				)}
			</Flex>
			<Flex
				alignItems={["flex-start", "flex-start", "center", "center"]}
				width="85%"
				rowGap="1rem"
				flexWrap="wrap"
			>
				<CardItem
					text={t("earnPages.yourStake")}
					usdValue={`${formattedNum(stakedInUsd, true)} USD`}
					value={`${verifyZerosInBalanceAndFormat(
						parseFloat(stakedAmount.toExact())
					)} ${symbol}`}
					opacity={JSBI.lessThanOrEqual(stakedAmount.raw, BIG_INT_ONE)}
				/>
				<CardItem
					text={t("earnPages.yourUnclaimed")}
					usdValue={`${formattedNum(unclaimedInUsd, true)} USD`}
					value={`${verifyZerosInBalanceAndFormat(
						parseFloat(unclaimedAmount.toExact())
					)} ${symbol}`}
					opacity={JSBI.lessThanOrEqual(unclaimedAmount.raw, BIG_INT_ONE)}
				/>
			</Flex>
		</Flex>
	);
};

export default Body;
