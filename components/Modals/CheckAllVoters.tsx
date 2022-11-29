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
	Link,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, useMemo } from "react";
import {
	useGovernance,
	BIG_INT_ZERO,
	NETWORKS_CHAIN_PARAMS,
	useWallet,
} from "pegasys-services";

import { MdClose } from "react-icons/md";
import Jazzicon from "react-jazzicon";
import { shortAddress } from "utils";
import { useTranslation } from "react-i18next";
import { ChainId, JSBI } from "@pollum-io/pegasys-sdk";
import { ProposalDetailsPercentageBar } from "../governance";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const CheckAllVotersModal: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const { t: translation } = useTranslation();

	const theme = usePicasso();
	const { votersType, selectedProposals, currentVotes, vote } = useGovernance();
	const { chainId } = useWallet();

	const getLink = (addr: string) =>
		`${
			NETWORKS_CHAIN_PARAMS[chainId ?? ChainId.NEVM].blockExplorerUrls[0]
		}address/${addr}`;

	const isOpenToVote = useMemo(() => {
		if (selectedProposals?.endDate) return false;

		if (!currentVotes || JSBI.lessThanOrEqual(currentVotes.raw, BIG_INT_ZERO))
			return false;

		return true;
	}, []);

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
				bgColor={theme.bg.blueNavyLight}
			>
				<ModalHeader
					borderTopRadius="30px"
					pt="1.5rem"
					pb="1rem"
					flexDirection="column"
				>
					<Flex flexDirection="column">
						<Flex pb="1rem" justifyContent="end">
							<MdClose
								size={22}
								onClick={onClose}
								color={theme.text.mono}
								cursor="pointer"
							/>
						</Flex>
						<ProposalDetailsPercentageBar
							quorum
							support={votersType === "favor"}
						/>
					</Flex>
				</ModalHeader>
				<ModalBody
					pb="6"
					pr={["2rem", "2.4rem", "2.4rem", "2.4rem"]}
					flexDirection="column"
				>
					<Flex flexDirection="column">
						<Flex
							width="100%"
							justifyContent="space-between"
							color={theme.text.cyanPurple}
							fontSize="0.875rem"
							mb="1.5rem"
						>
							{(votersType === "favor" &&
								selectedProposals.supportVotes.length) ||
							(votersType === "against" &&
								selectedProposals.notSupportVotes.length) ? (
								<>
									<Text>
										{votersType === "favor"
											? selectedProposals.supportVotes.length
											: selectedProposals.notSupportVotes.length}{" "}
										addresses
									</Text>
									<Text>Votes</Text>
								</>
							) : (
								<Text width="100%" align="center">
									No Votes
								</Text>
							)}
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
										<Link
											isExternal
											href={getLink(vote.voter)}
											fontSize="0.875rem"
										>
											{shortAddress(vote.voter)}
										</Link>
									</Flex>
									<Text>{vote.votes.toFixed(2)}</Text>
								</Flex>
							))}
						</Flex>
						{isOpenToVote && (
							<Button
								display={["flex", "none", "none", "none"]}
								mt="2.5rem"
								mb="3rem"
								fontWeight="semibold"
								w="100%"
								fontSize="1rem"
								py="0.5rem"
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								_hover={{
									bgColor: theme.bg.bluePurple,
								}}
								borderRadius="full"
								onClick={() =>
									vote(selectedProposals.id, votersType === "favor")
								}
							>
								{votersType === "favor" ? "Vote in Favor" : "Vote Against"}
							</Button>
						)}
					</Flex>
				</ModalBody>
				{isOpenToVote && (
					<ModalFooter
						bgColor={theme.bg.blackAlpha}
						justifyContent="center"
						py="1.3rem"
						borderBottomRadius={["0", "30px", "30px", "30px"]}
						display={["none", "flex", "flex", "flex"]}
					>
						<Text
							fontSize="0.875rem"
							color={theme.text.cyanPurple}
							_hover={{ cursor: "pointer" }}
							fontWeight="semibold"
							onClick={() => vote(selectedProposals.id, votersType === "favor")}
						>
							{votersType === "favor" ? "Vote in Favor" : "Vote Against"}
						</Text>
					</ModalFooter>
				)}
			</ModalContent>
		</Modal>
	);
};
