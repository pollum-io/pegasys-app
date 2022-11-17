import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { useGovernance } from "pegasys-services";

const Detail: React.FC = () => {
	const theme = usePicasso();
	const { selectedProposals } = useGovernance();

	if (!selectedProposals) {
		return null;
	}

	return (
		<Flex
			justifyContent="flex-start"
			w="100%"
			gap="3"
			flexDirection="column"
			color={theme.text.mono}
		>
			<Text fontWeight="bold">Details</Text>
			<Flex w="100%" flexDirection={["column", "column", "row", "row"]}>
				<Text>1:</Text>
				<Text
					color={theme.text.cyanPurple}
					ml={["0", "0", "0.438rem", "0.438rem"]}
					_hover={{ cursor: "pointer" }}
				>
					{selectedProposals.details.callData}
				</Text>
				<Text>.{selectedProposals.details.functionSig}()</Text>
			</Flex>
		</Flex>
	);
};

export default Detail;
