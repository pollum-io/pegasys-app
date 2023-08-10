import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { useGovernance } from "pegasys-services";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const Description: React.FC = () => {
	const theme = usePicasso();
	const { selectedProposals } = useGovernance();
	const { t: translation } = useTranslation();

	if (!selectedProposals) {
		return null;
	}
	const proposal = selectedProposals.description[0];
	const newText = proposal.replace(/\(LineBreak\)/g, "\n\n");
	return (
		<Flex
			justifyContent="flex-start"
			w="full-content"
			gap="3"
			flexDirection="column"
			padding="0.5rem"
		>
			<Text color={theme.text.mono} fontWeight="bold">
				{translation("votePage.description")}{" "}
			</Text>
			<ReactMarkdown>{newText}</ReactMarkdown>
		</Flex>
	);
};

export default Description;
