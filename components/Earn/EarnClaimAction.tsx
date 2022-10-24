import React from "react";
import { Flex, Img, Text } from "@chakra-ui/react";
import { JSBI } from "@pollum-io/pegasys-sdk";

import { usePicasso } from "hooks";
import { useEarn } from "pegasys-services";
import EarnButton from "./EarnButton";

interface IEarnClaimActionProps {
	claim: () => Promise<void>;
}

const EarnClaimAction: React.FC<IEarnClaimActionProps> = ({ claim }) => {
	const { selectedOpportunity, buttonId, loading } = useEarn();
	const theme = usePicasso();

	if (
		!selectedOpportunity ||
		buttonId !== "claim" ||
		JSBI.lessThanOrEqual(
			selectedOpportunity.unclaimedAmount.raw,
			JSBI.BigInt(0)
		)
	) {
		return null;
	}

	return (
		<Flex flexDirection="column" gap="6">
			<Flex
				bgColor={theme.bg.button}
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				py="2"
				gap="2"
				borderRadius="xl"
				w="100%"
			>
				<Flex flexDirection="row" alignItems="center">
					<Img src="icons/pegasys.png" w="6" h="6" />
					<Text fontSize="2xl" fontWeight="semibold" pl="2">
						{selectedOpportunity.unclaimedAmount.toSignificant(10, {
							groupSeparator: ",",
						})}
					</Text>
				</Flex>
				<Flex flexDirection="row">
					<Text>Unclaimed {selectedOpportunity.rewardToken.symbol}</Text>
				</Flex>
			</Flex>
			<EarnButton
				width="100%"
				height="max-content"
				px="1.5rem"
				py="3"
				my="4"
				onClick={claim}
				disabled={loading}
				solid
			>
				{`Claim ${selectedOpportunity.rewardToken.symbol}`}
			</EarnButton>
		</Flex>
	);
};

export default EarnClaimAction;
