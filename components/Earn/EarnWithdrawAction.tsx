import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { JSBI } from "@pollum-io/pegasys-sdk";

import { useEarn } from "pegasys-services";
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
	const { selectedOpportunity, withdrawTypedValue, buttonId } = useEarn();

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
				Deposited {selectedOpportunity.stakeToken.name}:{" "}
				{selectedOpportunity.stakedAmount.toSignificant()}
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
				>
					Cancel
				</EarnButton>
				<EarnButton
					width="100%"
					height={["2.5rem", "2.5rem", "3rem", "3rem"]}
					py="3"
					px="1.5rem"
					disabled={!withdrawTypedValue}
					onClick={withdraw}
					solid
				>
					{buttonTitle}
				</EarnButton>
			</Flex>
		</Flex>
	);
};

export default EarnWithdrawAction;
