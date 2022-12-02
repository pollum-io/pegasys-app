import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { usePicasso } from "hooks";

const UnlockVotingBody: React.FC = () => {
	const theme = usePicasso();
	const { t: translation } = useTranslation();

	return (
		<Flex gap="6" flexDirection="column" w="100%" textAlign="justify">
			<Text fontSize="1rem" color={theme.text.mono}>
				{translation("vote.earnedPsys")}
			</Text>

			<Text fontSize="1rem" color={theme.text.mono}>
				{translation("vote.canEitherVote")}
			</Text>
		</Flex>
	);
};

export default UnlockVotingBody;
