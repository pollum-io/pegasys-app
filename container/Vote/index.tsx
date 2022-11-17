import {
	Button,
	Flex,
	Img,
	Switch,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { usePicasso, useModal } from "hooks";
import { NextPage } from "next";
import { VoteCards, ProposalDetails, LoadingTransition } from "components";
import { MdOutlineCallMade } from "react-icons/md";
import { UnlockVotesModal } from "components/Modals/UnlockVoting";
import { useWallet, useGovernance } from "pegasys-services";
import { useTranslation } from "react-i18next";

export const VoteContainer: NextPage = () => {
	const theme = usePicasso();
	const { isConnected } = useWallet();
	const {
		selectedProposals,
		// isGovernance,
		showCancelled,
		setShowCancelled,
		votesLocked,
		delegatedTo,
		proposals,
		loading,
	} = useGovernance();
	const [isMobile] = useMediaQuery("(max-width: 480px)");

	const { t: translation } = useTranslation();

	const {
		onOpenUnlockVotesModal,
		isOpenUnlockVotesModal,
		onCloseUnlockVotesModal,
	} = useModal();

	return (
		<Flex justifyContent="center" alignItems="center">
			<UnlockVotesModal
				isOpen={isOpenUnlockVotesModal}
				onClose={onCloseUnlockVotesModal}
			/>
			<LoadingTransition isOpen={loading} />
			<Flex alignItems="flex-start" justifyContent="center" mb="6.2rem">
				{!selectedProposals ? (
					<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
						<Flex
							flexDirection="column"
							zIndex="docked"
							position="relative"
							borderRadius="xl"
							backgroundColor={theme.bg.alphaPurple}
						>
							<Img
								borderRadius="xl"
								src={
									isMobile
										? theme.bg.governanceBannerMobile
										: theme.bg.governanceBanner
								}
								position="absolute"
								zIndex="base"
								w="100%"
								h={votesLocked ? "100%" : "85%"}
							/>
							<Flex
								zIndex="docked"
								flexDirection="column"
								px={["1rem", "1.3rem", "1.6rem", "1.6rem"]}
								py={["0.8rem", "1.375rem", "1.375rem", "2.1rem"]}
								gap="2"
								h={["9rem", "10rem", "10rem", "10rem"]}
								color="white"
							>
								<Text fontWeight="bold" fontSize="md">
									{translation("votePage.pegasysGovernance")}
								</Text>
								<Text
									color="white"
									fontWeight="medium"
									fontSize="sm"
									lineHeight="shorter"
									w={["100%", "70%", "60%", "60%"]}
								>
									{translation("votePage.earnedPsysTokens")}{" "}
									{translation("votePage.youCanVote")}
								</Text>
							</Flex>
							{!votesLocked && (
								<Flex
									alignItems={["flex-start", "center", "center", "center"]}
									justifyContent="space-between"
									flexDirection={["column", "row", "row", "row"]}
									bgColor={theme.bg.alphaPurple}
									zIndex="0"
									position="relative"
									top="4"
									borderBottomRadius="xl"
									py="0.531rem"
									px="1rem"
								>
									<Text
										fontWeight="500"
										fontSize="16px"
										color="white"
										textTransform="lowercase"
									>
										12.73 {translation("votePage.votes")}
									</Text>
									<Flex gap="4" fontSize="14px">
										<Text color="white">
											{translation("votePage.delegatedTo")} {delegatedTo}
										</Text>
										<Text
											fontWeight="semibold"
											_hover={{ cursor: "pointer", opacity: "0.9" }}
											transition="100ms ease-in-out"
											color={theme.text.cyan}
											onClick={onOpenUnlockVotesModal}
										>
											{translation("votePage.edit")}
										</Text>
									</Flex>
								</Flex>
							)}
						</Flex>
						<Flex
							alignItems="flex-start"
							my={["1", "4", "8", "8"]}
							justifyContent="flex-start"
							w="100%"
							flexDirection="column"
							zIndex="docked"
						>
							<Flex
								mt={["2rem", "5", "5", "5"]}
								flexDirection="column"
								gap="1rem"
								w="100%"
								zIndex="docked"
								alignItems="flex-start"
							>
								<Flex
									flexDirection="row"
									justifyContent="space-between"
									alignItems="center"
									w="100%"
									bgColor=""
									h="max-content"
								>
									<Flex>
										<Text
											fontSize={["20px", "20px", "2xl", "2xl"]}
											fontWeight="semibold"
											color={theme.text.mono}
										>
											{translation("votePage.proposals")}
										</Text>
									</Flex>
									{!votesLocked ? (
										<Flex gap="2.5rem" fontSize="14px">
											<Flex
												gap="2"
												alignItems="center"
												display={["none", "none", "flex", "flex"]}
												_hover={{ cursor: "pointer", opacity: "0.9" }}
											>
												<Text color={theme.text.mono}>
													{translation("votePage.discussAtTheForum")}
												</Text>
												<MdOutlineCallMade size={18} color={theme.text.mono} />
											</Flex>
											<Flex flexDirection="row" gap="2" alignItems="center">
												<Text color={theme.text.mono}>
													{translation("votePage.showCancelled")}
												</Text>
												<Switch
													size="md"
													onChange={() => setShowCancelled(!showCancelled)}
												/>
											</Flex>
										</Flex>
									) : (
										<Flex w="max-content" h="max-content">
											<Button
												fontSize="14px"
												fontWeight="semibold"
												px={["1.2rem", "1.5rem", "1.5rem", "1.5rem"]}
												size="sm"
												py="0.8rem"
												bgColor={theme.bg.blueNavyLightness}
												color={theme.text.cyan}
												_hover={{
													bgColor: theme.bg.bluePurple,
												}}
												onClick={onOpenUnlockVotesModal}
												borderRadius="full"
											>
												{translation("votePage.unlockVoting")}
											</Button>
										</Flex>
									)}
								</Flex>
								{isConnected ? (
									<Flex
										fontSize="14px"
										gap="2"
										alignItems="center"
										display={["flex", "flex", "none", "none"]}
										_hover={{ cursor: "pointer" }}
										pl="2"
									>
										<Text color={theme.text.mono}>Discuss at the Forum</Text>
										<MdOutlineCallMade size={18} color={theme.text.mono} />
									</Flex>
								) : (
									<Flex />
								)}
							</Flex>

							{!isConnected ? (
								<Flex
									w="100%"
									mt={["3rem", "3rem", "4rem", "4rem"]}
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
								>
									<Text
										fontSize={["sm", "sm", "md", "md"]}
										fontWeight="semibold"
										textAlign="center"
										color={theme.text.mono}
									>
										{translation("votePage.noProposalsFound")}
									</Text>
									<Text
										fontSize={["sm", "sm", "md", "md"]}
										fontWeight="normal"
										textAlign="center"
										color={theme.text.mono}
									>
										{translation("votePage.proposalCommunityMembers")}
									</Text>
									<Flex mt="15px">
										<Text
											fontSize={["sm", "sm", "md", "md"]}
											fontWeight="normal"
											textAlign="center"
											color={theme.text.gray45}
											fontStyle="Italic"
										>
											{translation("votePage.minimumThreshold")}
										</Text>
									</Flex>
								</Flex>
							) : (
								<Flex
									flexDirection="column"
									mt={["1.5rem", "1.5rem", "2rem", "2rem"]}
								>
									{proposals.map((proposal, index) => (
										<VoteCards proposal={proposal} key={`voteCard-${index}`} />
									))}
								</Flex>
							)}
						</Flex>
					</Flex>
				) : (
					<ProposalDetails />
				)}
			</Flex>
		</Flex>
	);
};
