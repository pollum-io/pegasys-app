import React from "react";
import { Flex } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { useGovernance } from "pegasys-services";
import Status from "./status";
import Vote from "./vote";
import Details from "./details";
import Description from "./description";

const Body: React.FC = () => {
	const theme = usePicasso();
	const { selectedProposals } = useGovernance();

	if (!selectedProposals) {
		return null;
	}

	return (
		<Flex
			mt="0.875rem"
			w="100%"
			bgColor={theme.bg.blackAlpha}
			borderRadius="xl"
			h="max-content"
			boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
			flexDirection="column"
		>
			<Flex
				bgColor={theme.bg.blueNavy}
				h="max-content"
				w="100%"
				borderTopRadius="xl"
				flexDirection="column"
				pb={["2", "4", "4", "4"]}
			>
				<Status />
				<Vote />
			</Flex>
			<Flex
				mx={["4", "5", "5", "5"]}
				mt={["7", "6", "6", "6"]}
				flexDirection="column"
				gap="7"
			>
				<Details />
				<Description />
			</Flex>
		</Flex>
	);
};

export default Body;
