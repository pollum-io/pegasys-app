import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { usePicasso, useModal } from "hooks";
import Jazzicon from "react-jazzicon";
import { useGovernance } from "pegasys-services";

const Vote: React.FC = () => {
	const theme = usePicasso();
	const { setVotersType, selectedProposals, vote } = useGovernance();
	const { onOpenCheckAllVotersModal } = useModal();

	const isFavor = () => {
		setVotersType("favor");
		onOpenCheckAllVotersModal();
	};

	const isAgainst = () => {
		setVotersType("against");
		onOpenCheckAllVotersModal();
	};

	if (!selectedProposals) {
		return null;
	}

	return (
		<Flex mx={["4", "5", "5", "5"]} mt="4" flexDirection="column">
			<Text
				mr={["4", "4", "4", "0"]}
				fontWeight="semibold"
				color={theme.text.mono}
				fontSize={["16px", "16", "24px", "24px"]}
				mb="0.6rem"
			>
				{selectedProposals.title}
			</Text>
			<Flex
				justifyContent="flex-start"
				w="full-content"
				gap="4"
				flexDirection="row"
				alignItems="center"
				mb="1.5rem"
			>
				<Text color={theme.text.mono} fontWeight="bold" fontSize="16px">
					Proposer
				</Text>

				<Flex
					textTransform="lowercase"
					color={theme.text.mono}
					gap="2"
					alignItems="center"
				>
					<Jazzicon diameter={18} seed={Math.round(Math.random() * 10000000)} />
					<Text fontSize="14px">{selectedProposals.proposer}</Text>
				</Flex>
			</Flex>
			<Flex
				flexDirection={["column", "column", "row", "row"]}
				bgColor="rgba(255, 255, 255, 0.04)"
				w="100%"
				h="max-content"
				borderRadius="xl"
				py="3"
				px="4"
				justifyContent="space-between"
				color={theme.text.mono}
				flexWrap="wrap"
				gap="6"
			>
				<Flex
					justifyContent="space-between"
					flexDirection="column"
					w={["100%", "100%", "46%", "46%"]}
				>
					<Flex
						justifyContent="space-between"
						w="full-content"
						pb={["4", "4", "4", "4"]}
						fontSize="14px"
						fontWeight="600"
						color={theme.text.mono}
					>
						<Text>For</Text>
						<Flex>
							<Text mr="0.563rem">{selectedProposals.forVotes.toString()}</Text>
							<Text fontWeight="400">
								/ {selectedProposals.totalVotes.toString()}
							</Text>
						</Flex>
					</Flex>
					<Flex
						w="100%"
						borderRadius="xl"
						h="0.375rem"
						bgColor={theme.bg.voteGray}
						mb={["15px", "15px", "8px", "8px"]}
					>
						<Flex
							w={`${
								(selectedProposals.forVotes * 100) /
								selectedProposals.totalVotes
							}%`}
							borderRadius="xl"
							h="0.375rem"
							bgColor="#48BB78"
							mb={["15px", "15px", "8px", "8px"]}
						/>
						{/* <Flex
							w={`${
								(selectedProposals.againstVotes * 100) /
								selectedProposals.totalVotes
							}%`}
							borderRadius="xl"
							h="0.375rem"
							bgColor="#F56565"
							mb={["15px", "15px", "8px", "1rem"]}
						/> */}
					</Flex>
					<Flex
						justifyContent="space-between"
						alignItems="center"
						mt={["0", "0", "1.5", "1.5"]}
					>
						<Button
							fontSize="12px"
							fontWeight="normal"
							px="0.8rem"
							h="1.5rem"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							_hover={{
								bgColor: theme.bg.bluePurple,
							}}
							_active={{}}
							borderRadius="full"
							onClick={() => vote(selectedProposals.id, true)}
						>
							Vote in Favor
						</Button>
						<Text
							fontSize="12px"
							_hover={{ cursor: "pointer", opacity: "0.9" }}
							transition="100ms ease-in-out"
							onClick={isFavor}
							color="#718096"
						>
							Check all voters
						</Text>
					</Flex>
				</Flex>
				<Flex
					justifyContent="space-between"
					flexDirection="column"
					w={["100%", "100%", "46%", "46%"]}
				>
					<Flex
						justifyContent="space-between"
						w="full-content"
						pb={["4", "4", "4", "4"]}
						fontSize="14px"
						fontWeight="600"
						color={theme.text.mono}
					>
						<Text color="">Against</Text>
						<Flex>
							<Text mr="0.563rem">
								{selectedProposals.againstVotes.toString()}
							</Text>
							<Text fontWeight="400">
								/ {selectedProposals.totalVotes.toString()}
							</Text>
						</Flex>
					</Flex>
					<Flex
						w="100%"
						borderRadius="xl"
						h="0.375rem"
						bgColor={theme.bg.voteGray}
						mb={["15px", "15px", "8px", "8px"]}
					>
						<Flex
							w={`${
								(selectedProposals.againstVotes * 100) /
								selectedProposals.totalVotes
							}%`}
							borderRadius="xl"
							h="0.375rem"
							bgColor="#F56565"
							mb={["15px", "15px", "8px", "1rem"]}
						/>
					</Flex>
					<Flex
						justifyContent="space-between"
						alignItems="center"
						mt={["0", "0", "1.5", "1.5"]}
					>
						<Button
							fontSize="12px"
							fontWeight="normal"
							px="0.8rem"
							h="1.5rem"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							_hover={{
								bgColor: theme.bg.bluePurple,
							}}
							_active={{}}
							borderRadius="full"
							onClick={() => vote(selectedProposals.id, false)}
						>
							Vote Against
						</Button>
						<Text
							fontSize="12px"
							_hover={{ cursor: "pointer", opacity: "0.9" }}
							transition="100ms ease-in-out"
							onClick={isAgainst}
							color="#718096"
						>
							Check all voters
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Vote;
