import React from "react";
import { Flex, Text } from "@chakra-ui/react";

import { usePicasso } from "hooks";

const UnlockVotingBody: React.FC = () => {
	const theme = usePicasso();

	return (
		<Flex gap="6" flexDirection="column" w="100%" textAlign="justify">
			<Text fontSize="1rem" color={theme.text.mono}>
				Earned PSYS tokens represent voting shares in Pegasys governance.
			</Text>

			<Text fontSize="1rem" color={theme.text.mono}>
				You can either vote on each proposal yourself or delegate your votes to
				a third party.
			</Text>
		</Flex>
	);
};

export default UnlockVotingBody;
