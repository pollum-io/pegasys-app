import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useGovernance } from "pegasys-services";

const Status: React.FC = () => {
	const { selectedProposals } = useGovernance();

	if (!selectedProposals) {
		return null;
	}

	return (
		<Flex
			flexDirection={["column", "column", "row", "row"]}
			justifyContent="flex-start"
			w={["91%", "65%", "60%", "60%"]}
			h="max-content"
			mt="1.5rem"
			py="1"
			backgroundColor={selectedProposals.statusColor}
			borderRightRadius="full"
			alignItems={["none", "none", "center", "center"]}
		>
			<Text
				fontWeight="semibold"
				color="white"
				fontSize="13"
				pl="1rem"
				textTransform="uppercase"
			>
				{selectedProposals.status}
			</Text>
			<Text fontWeight="normal" color="white" fontSize="0.75rem" pl="1rem">
				{selectedProposals.endDate
					? `Voting ended ${selectedProposals.endDate.toUTCString()}`
					: `Voting ends at block ${selectedProposals.endBlock}`}
			</Text>
		</Flex>
	);
};

export default Status;
