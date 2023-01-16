import React, { useMemo } from "react";
import { Collapse, Flex, Img, Text } from "@chakra-ui/react";
import { JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";
import { useTranslation } from "react-i18next";

import { usePicasso, useTokens } from "hooks";
import {
	BIG_INT_ONE_WEEK_IN_SECONDS,
	BIG_INT_ZERO,
	useEarn,
} from "pegasys-services";
import EarnButton from "./EarnButton";
import EarnInput from "./EarnInput";

interface IEarnDepositActionProps {
	deposit: () => Promise<void>;
	sign: () => Promise<void>;
	buttonTitle: string;
}

const EarnDepositAction: React.FC<IEarnDepositActionProps> = ({
	deposit,
	sign,
	buttonTitle,
}) => {
	const {
		selectedOpportunity,
		signature,
		depositTypedValue,
		buttonId,
		signatureLoading,
		loading,
		depositPercentage,
		depositValue,
	} = useEarn();
	const theme = usePicasso();
	const { userTokensBalance } = useTokens();
	const { t } = useTranslation();

	const tokenALogo = useMemo(() => {
		const tokenAWrapped = userTokensBalance.find(
			ut =>
				ut.address === selectedOpportunity?.tokenA?.address &&
				selectedOpportunity.tokenA.chainId === ut.chainId
		);

		return tokenAWrapped?.logoURI ?? "";
	}, [userTokensBalance, selectedOpportunity?.tokenA]);

	const tokenBLogo = useMemo(() => {
		const tokenBWrapped = userTokensBalance.find(
			ut =>
				ut.address === selectedOpportunity?.tokenB?.address &&
				selectedOpportunity.tokenB.chainId === ut.chainId
		);

		return tokenBWrapped?.logoURI ?? "";
	}, [userTokensBalance, selectedOpportunity?.tokenB]);

	const weeklyReward = useMemo(() => {
		if (!selectedOpportunity) return undefined;

		if (JSBI.lessThanOrEqual(depositValue, BIG_INT_ZERO))
			return selectedOpportunity.rewardRatePerWeek;

		const liveWeeklyRate = JSBI.divide(
			JSBI.multiply(
				JSBI.multiply(
					selectedOpportunity.rewardRate.raw,
					JSBI.add(selectedOpportunity.stakedAmount.raw, depositValue)
				),
				BIG_INT_ONE_WEEK_IN_SECONDS
			),
			selectedOpportunity.totalStakedAmount.raw
		);

		return new TokenAmount(
			selectedOpportunity.rewardRatePerWeek.token,
			liveWeeklyRate
		);
	}, [depositValue, selectedOpportunity]);

	if (
		!selectedOpportunity ||
		buttonId !== "deposit" ||
		JSBI.lessThanOrEqual(selectedOpportunity.unstakedAmount.raw, JSBI.BigInt(0))
	) {
		return null;
	}
	return (
		<Flex flexDirection="column">
			<Flex gap="2">
				<Flex position="relative">
					<Img src={tokenALogo} w="6" h="6" position="relative" />
					{selectedOpportunity.tokenB && (
						<Img src={tokenBLogo} w="6" h="6" position="absolute" ml="1.2rem" />
					)}
				</Flex>
				<Flex>
					<Text fontSize="lg" fontWeight="bold" ml="1.2rem">
						{selectedOpportunity.tokenA.symbol}
						{selectedOpportunity.tokenB
							? `:${selectedOpportunity.tokenB.symbol}`
							: ""}
					</Text>
				</Flex>
			</Flex>
			<Flex flexDirection="column" gap="2" mt="6">
				<Text fontWeight="normal">
					{t("earnPages.availableToDeposit")}:{" "}
					{selectedOpportunity.unstakedAmount.toSignificant()}{" "}
					{selectedOpportunity.stakeToken.symbol}
				</Text>
				<EarnInput deposit />
				<Collapse
					in={!!depositTypedValue || weeklyReward?.toSignificant() !== "0"}
				>
					<Text
						fontWeight="normal"
						transition="0.7s"
						color={depositTypedValue ? "inherit" : theme.text.lightnessGray}
					>
						{t("earnPages.weeklyRewards")}: {weeklyReward?.toSignificant()}{" "}
						{selectedOpportunity.rewardToken.symbol} / {t("earnPages.week")}
					</Text>
				</Collapse>
				{selectedOpportunity.extraRewardToken && (
					<Text fontWeight="normal">
						{t("earnPages.extraRewards")}:{" "}
						{selectedOpportunity.extraRewardRatePerWeek?.toSignificant()}{" "}
						{selectedOpportunity.extraRewardToken.symbol} /{" "}
						{t("earnPages.week")}
					</Text>
				)}
			</Flex>
			<EarnButton
				width="100%"
				height="max-content"
				py="3"
				px="1.5rem"
				mt="1.5rem"
				mb={["3rem", "0.5rem", "0.5rem", "0.5rem"]}
				disabled={
					!depositTypedValue ||
					signatureLoading ||
					depositPercentage > 100 ||
					!JSBI.greaterThan(depositValue, BIG_INT_ZERO) ||
					loading
				}
				onClick={signature ? deposit : sign}
				fontSize={16}
				solid
			>
				{signatureLoading
					? t("earnPages.loading")
					: signature
					? buttonTitle
					: t("earnPages.sign")}
			</EarnButton>
		</Flex>
	);
};

export default EarnDepositAction;
