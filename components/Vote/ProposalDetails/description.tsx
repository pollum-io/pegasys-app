import React from "react";
import { Flex, Text, Link } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { useGovernance } from "pegasys-services";

const Description: React.FC = () => {
	const theme = usePicasso();
	const { selectedProposals } = useGovernance();

	if (!selectedProposals) {
		return null;
	}

	return (
		<Flex
			justifyContent="flex-start"
			w="full-content"
			gap="3"
			flexDirection="column"
		>
			<Text color={theme.text.mono} fontWeight="bold">
				Description
			</Text>
			<Flex mb="2rem" flexDirection="column">
				{selectedProposals.description.map((description, index) => {
					const parts = description.split("[here]");

					if (parts[1]) {
						const otherDescriptions = parts[1].split(")");

						const link = otherDescriptions[0].slice(1);

						return (
							<Text key={`description-${index}`} color={theme.text.mono}>
								{parts[0]}
								<Link color={theme.text.cyanPurple} isExternal href={link}>
									here
								</Link>
								{otherDescriptions.slice(1).join(")")}
							</Text>
						);
					}

					return (
						<Text key={`description-${index}`} color={theme.text.mono}>
							{description}
						</Text>
					);
				})}
			</Flex>
		</Flex>
	);
};

export default Description;
