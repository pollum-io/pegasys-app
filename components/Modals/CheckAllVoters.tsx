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
	useColorMode,
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
	const { colorMode } = useColorMode();

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
				borderTopRadius="30px"
				borderBottomRadius={["0", "30px", "30px", "30px"]}
				mb={["0", "5rem", "5rem", "5rem"]}
				h="max-content"
				borderTop={
					colorMode === "dark"
						? ["1px solid transparent", "none", "none", "none"]
						: ["none", "none", "none", "none"]
				}
				position={["absolute", "relative", "relative", "relative"]}
				bottom={["0", "unset", "unset", "unset"]}
				w={["100vw", "22.375rem", "22.375rem", "22.375rem"]}
				boxShadow={
					colorMode === "dark"
						? "0px 0px 0px 1px rgba(0, 0, 0, 0.1)"
						: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
				}
				filter={
					colorMode === "dark"
						? "drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.2)) drop-shadow(0px 15px 40px rgba(0, 0, 0, 0.4))"
						: "none"
				}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(270.16deg, rgba(24,54,61, 0.8) 90.76%, rgba(24,54,61, 0) 97.76%) border-box`}
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
										{translation("votePage.addresses")}
									</Text>
									<Text>{translation("votePage.votes")}</Text>
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
								{votersType === "favor"
									? translation("votePage.voteInFavor")
									: translation("votePage.voteAgainst")}
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
