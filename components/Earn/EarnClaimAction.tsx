import React, { useMemo } from "react";
import { Flex, Img, Text } from "@chakra-ui/react";
import { JSBI } from "@pollum-io/pegasys-sdk";
import { useTranslation } from "react-i18next";

import { usePicasso, useTokens } from "hooks";
import { useEarn } from "pegasys-services";
import EarnButton from "./EarnButton";

interface IEarnClaimActionProps {
	claim: () => Promise<void>;
}

const EarnClaimAction: React.FC<IEarnClaimActionProps> = ({ claim }) => {
	const { selectedOpportunity, buttonId, loading } = useEarn();
	const { userTokensBalance } = useTokens();
	const theme = usePicasso();
	const { t } = useTranslation();

	const extraTokenLogo = useMemo(() => {
		const extraTokenWrapped = userTokensBalance.find(
			ut =>
				ut.address === selectedOpportunity?.extraRewardToken?.address &&
				selectedOpportunity?.extraRewardToken.chainId === ut.chainId
		);

		return extraTokenWrapped?.logoURI ?? "";
	}, [
		userTokensBalance,
		selectedOpportunity,
		selectedOpportunity?.extraRewardToken,
	]);

	if (
		!selectedOpportunity ||
		buttonId !== "claim" ||
		JSBI.lessThanOrEqual(selectedOpportunity.stakedAmount.raw, JSBI.BigInt(0))
	) {
		return null;
	}

	return (
		<Flex flexDirection="column" gap="6">
			<Flex
				bgColor={theme.bg.darkBlueGray}
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				py="2"
				gap="2"
				borderRadius="xl"
			>
				<Flex
					flexDirection="row"
					alignItems="center"
					w="80%"
					justifyContent="center"
				>
					<Img src="icons/pegasys.png" w="6" h="6" />
					<Text fontSize="2xl" fontWeight="semibold" pl="2" w="100%">
						{selectedOpportunity.unclaimedAmount.toSignificant(10, {
							groupSeparator: ",",
						})}
					</Text>
				</Flex>
				<Flex flexDirection="row">
					<Text>
						{t("earnPages.unclaimed", {
							token: selectedOpportunity.rewardToken.symbol,
						})}
					</Text>
				</Flex>
			</Flex>
			{selectedOpportunity.extraRewardToken &&
				selectedOpportunity.extraUnclaimed && (
					<Flex
						bgColor={theme.bg.darkBlueGray}
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						py="2"
						gap="2"
						borderRadius="xl"
						w="100%"
					>
						<Flex flexDirection="row" alignItems="center">
							<Img src={extraTokenLogo} w="6" h="6" />
							<Text fontSize="2xl" fontWeight="semibold" pl="2">
								{selectedOpportunity.extraUnclaimed.toSignificant(10, {
									groupSeparator: ",",
								})}
							</Text>
						</Flex>
						<Flex flexDirection="row">
							<Text>
								{t("earnPages.unclaimed", {
									token: selectedOpportunity.extraRewardToken.symbol,
								})}
							</Text>
						</Flex>
					</Flex>
				)}
			<EarnButton
				width="100%"
				height="max-content"
				px="1.5rem"
				py="3"
				my="4"
				mb={["4", "2", "2", "2"]}
				onClick={claim}
				disabled={loading}
				fontSize={16}
				solid
			>
				{t("earnPages.claim")}
			</EarnButton>
		</Flex>
	);
};

export default EarnClaimAction;
