import React, { useMemo } from "react";
import { Flex, Img, Text } from "@chakra-ui/react";
import { JSBI } from "@pollum-io/pegasys-sdk";
import { useTranslation } from "react-i18next";

import { useTokens } from "hooks";
import { BIG_INT_ZERO, useEarn } from "pegasys-services";
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
				<Text fontWeight="normal">
					{t("earnPages.weeklyRewards")}:{" "}
					{selectedOpportunity.totalRewardRatePerWeek.toSignificant()}{" "}
					{selectedOpportunity.rewardToken.symbol} / {t("earnPages.week")}
				</Text>
				{selectedOpportunity.extraRewardToken && (
					<Text fontWeight="normal">
						{t("earnPages.extraRewards")}:{" "}
						{selectedOpportunity.extraTotalRewardRatePerWeek?.toSignificant()}{" "}
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
				mb={["3rem", "1rem", "1rem", "1rem"]}
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
