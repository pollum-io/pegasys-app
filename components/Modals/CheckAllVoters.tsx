import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useGovernance } from "pegasys-services";

import { MdClose } from "react-icons/md";
import Jazzicon from "react-jazzicon";
import { shortAddress } from "utils";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const CheckAllVotersModal: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const { t: translation } = useTranslation();

	const theme = usePicasso();
	const { votersType, selectedProposals } = useGovernance();

	if (!selectedProposals) return null;

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="30px"
				my={["0", "40", "40", "40"]}
				mb={["0", "0", "24rem", "24rem"]}
				h="max-content"
				position={["absolute", "relative", "relative", "relative"]}
				bottom={["0", "0", "0", "0"]}
				w={["100vw", "22.375rem", "22.375rem", "22.375rem"]}
			>
				<ModalHeader
					borderTopRadius="30px"
					bgColor={theme.bg.blueNavyLight}
					pt="1.5rem"
					pb="1rem"
					flexDirection="column"
				>
					<Flex flexDirection="column">
						<Flex alignItems="center" justifyContent="space-between" mb="1rem">
							<Flex
								justifyContent="space-between"
								w={["85%", "83%", "83%", "83%"]}
							>
								<Text fontSize="14px" fontWeight="semibold">
									{votersType === "favor"
										? translation("votePage.for")
										: translation("votePage.against")}
								</Text>
								{votersType === "favor" ? (
									<Flex fontSize="14px">
										<Text mr="0.563rem">{selectedProposals.forVotes}</Text>
										<Text fontWeight="400">
											/ {selectedProposals.totalVotes}
										</Text>
									</Flex>
								) : (
									<Flex>
										<Text fontSize="14px" fontWeight="semibold">
											<Text mr="0.563rem">
												{selectedProposals.againstVotes}
											</Text>
											<Text fontWeight="400">
												/ {selectedProposals.totalVotes}
											</Text>
										</Text>
									</Flex>
								)}
							</Flex>

							<Flex _hover={{ cursor: "pointer" }}>
								<MdClose size={22} onClick={onClose} color={theme.text.mono} />
							</Flex>
						</Flex>

						{votersType === "favor" ? (
							<Flex
								w={["85%", "83%", "83%", "83%"]}
								borderRadius="xl"
								h="0.375rem"
								bgColor={theme.bg.voteGray}
								mb={["15px", "8px", "8px", "8px"]}
							>
								<Flex
									w={`${
										(selectedProposals.forVotes * 100) /
										selectedProposals.totalVotes
									}%`}
									borderRadius="xl"
									h="0.375rem"
									bgColor="#48BB78"
								/>
							</Flex>
						) : (
							<Flex
								w={["85%", "83%", "83%", "83%"]}
								borderRadius="xl"
								h="0.375rem"
								bgColor={theme.bg.voteGray}
								mb={["15px", "8px", "8px", "8px"]}
							>
								<Flex
									w={`${
										(selectedProposals.againstVotes * 100) /
										selectedProposals.totalVotes
									}%`}
									borderRadius="xl"
									h="0.375rem"
									bgColor="#F56565"
									mb={["15px", "8px", "8px", "8px"]}
								/>
							</Flex>
						)}
					</Flex>
				</ModalHeader>
				<ModalBody
					bgColor={theme.bg.blueNavyLight}
					pb="6"
					pr={["2rem", "2.4rem", "2.4rem", "2.4rem"]}
					flexDirection="column"
				>
					<Flex flexDirection="column">
						<Flex
							justifyContent="space-between"
							color={theme.text.cyanPurple}
							fontSize="14px"
							mb="1.5rem"
						>
							<Text>
								{votersType === "favor"
									? selectedProposals.supportVotes.length
									: selectedProposals.notSupportVotes.length}{" "}
								addresses
							</Text>
							<Text>Votes</Text>
						</Flex>
						<Flex w="100%" flexDirection="column" fontSize="14px" pr="0.5rem">
							{(votersType === "favor"
								? selectedProposals.supportVotes
								: selectedProposals.notSupportVotes
							).map(vote => (
								<Flex
									key={`vote-${vote.voter}`}
									justifyContent="space-between"
									textTransform="lowercase"
									color={theme.text.mono}
									gap="2"
									alignItems="center"
									mb="3"
								>
									<Flex gap="2">
										<Jazzicon diameter={18} seed={Number(vote.voter)} />
										<Text fontSize="14px">{shortAddress(vote.voter)}</Text>
									</Flex>
									<Text>{vote.votes}</Text>
								</Flex>
							))}
						</Flex>
						<Button
							display={["flex", "none", "none", "none"]}
							mt="2.5rem"
							mb="3rem"
							fontWeight="semibold"
							w="100%"
							fontSize="16px"
							py="0.5rem"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							_hover={{
								bgColor: theme.bg.bluePurple,
							}}
							borderRadius="full"
						>
							{votersType === "favor"
								? translation("votePage.voteInFavor")
								: translation("votePage.voteAgainst")}
						</Button>
					</Flex>
				</ModalBody>
				<ModalFooter
					bgColor={theme.bg.blackAlpha}
					justifyContent="center"
					py="1.3rem"
					borderBottomRadius={["0", "30px", "30px", "30px"]}
					display={["none", "flex", "flex", "flex"]}
				>
					<Text
						fontSize="14px"
						color={theme.text.cyanPurple}
						_hover={{ cursor: "pointer" }}
						fontWeight="semibold"
					>
						{votersType === "favor"
							? translation("votePage.voteInFavor")
							: translation("votePage.voteAgainst")}
					</Text>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
