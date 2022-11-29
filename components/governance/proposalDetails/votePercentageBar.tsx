import React from "react";
import { useGovernance } from "pegasys-services";
import { Flex, Text } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { IProposalDetailsPercentageBar } from "./dto";

const ProposalDetailsPercentageBar: React.FC<IProposalDetailsPercentageBar> = ({
	quorum,
	support,
}) => {
	const { selectedProposals } = useGovernance();
	const theme = usePicasso();

	if (!selectedProposals) return null;

	return (
		<Flex justifyContent="space-between" flexDirection="column" w="100%">
			<Flex
				justifyContent="space-between"
				w="full-content"
				pb={["4", "4", "4", "4"]}
				fontSize="0.75rem"
				fontWeight="600"
				color={theme.text.mono}
			>
				<Text>{support ? "For" : "Against"}</Text>
				<Flex>
					<Text mr="0.563rem">
						{support
							? selectedProposals.forVotes
							: selectedProposals.againstVotes}
					</Text>
					{!!quorum && (
						<Text fontWeight="400">/ {selectedProposals.quorumCount}</Text>
					)}
				</Flex>
			</Flex>
			<Flex
				w="100%"
				borderRadius="xl"
				h="0.375rem"
				bgColor={theme.bg.voteGray}
				mb={["0.9375rem", "0.9375rem", "0.5rem", "0.5rem"]}
			>
				<Flex
					w={`${
						support
							? selectedProposals.forVotesQuorumPercentage
							: selectedProposals.againstVotesQuorumPercentage
					}%`}
					borderRadius="xl"
					h="0.375rem"
					bgColor={support ? "#48BB78" : "#F56565"}
					mb={["0.9375rem", "0.9375rem", "0.5rem", "0.5rem"]}
				/>
			</Flex>
		</Flex>
	);
};

export default ProposalDetailsPercentageBar;
