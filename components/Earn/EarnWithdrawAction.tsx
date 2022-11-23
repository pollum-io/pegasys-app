import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { JSBI } from "@pollum-io/pegasys-sdk";
import { useTranslation } from "react-i18next";

import { BIG_INT_ZERO, useEarn } from "pegasys-services";
import EarnButton from "./EarnButton";
import EarnInput from "./EarnInput";
import EarnSlider from "./EarnSlider";

interface IEarnWithdrawActionProps {
	withdraw: () => Promise<void>;
	buttonTitle: string;
	onClose: () => void;
}

const EarnWithdrawAction: React.FC<IEarnWithdrawActionProps> = ({
	withdraw,
	buttonTitle,
	onClose,
}) => {
	const {
		selectedOpportunity,
		withdrawTypedValue,
		buttonId,
		withdrawPercentage,
		loading,
		withdrawValue,
	} = useEarn();
	const { t } = useTranslation();

	if (
		!selectedOpportunity ||
		buttonId !== "withdraw" ||
		JSBI.lessThanOrEqual(selectedOpportunity.stakedAmount.raw, JSBI.BigInt(0))
	) {
		return null;
	}

	return (
		<Flex flexDirection="column">
			<Text fontWeight="normal" mb="2">
				{t("earnPages.deposited", {
					token: selectedOpportunity.stakeToken.name,
				})}
				: {selectedOpportunity.stakedAmount.toSignificant()}
			</Text>
			<EarnInput />
			<EarnSlider />
			<Flex mt="1.5rem" mb="1rem" gap="4">
				<EarnButton
					width="100%"
					height={["2.5rem", "2.5rem", "3rem", "3rem"]}
					py="3"
					px="1.5rem"
					onClick={onClose}
					fontSize={16}
				>
					{t("earnPages.cancel")}
				</EarnButton>
				<EarnButton
					width="100%"
					height={["2.5rem", "2.5rem", "3rem", "3rem"]}
					py="3"
					px="1.5rem"
					disabled={
						!withdrawTypedValue ||
						withdrawPercentage > 100 ||
						!JSBI.greaterThan(withdrawValue, BIG_INT_ZERO) ||
						loading
					}
					onClick={withdraw}
					solid
					fontSize={16}
				>
					{`${buttonTitle}
					${withdrawPercentage === 100 ? t("earnPages.andClaim") : ""}`}
				</EarnButton>
			</Flex>
		</Flex>
	);
};

export default EarnWithdrawAction;
