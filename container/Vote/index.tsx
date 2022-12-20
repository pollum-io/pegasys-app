import {
	Button,
	Flex,
	Img,
	Switch,
	Text,
	useColorMode,
	useMediaQuery,
} from "@chakra-ui/react";
import { usePicasso, useModal } from "hooks";
import { NextPage } from "next";
import { VoteCards, ProposalDetails, LoadingTransition } from "components";
import { MdOutlineCallMade } from "react-icons/md";
import { UnlockVotesModal } from "components/Modals/UnlockVoting";
import { useTranslation } from "react-i18next";
import { useWallet, useGovernance, PegasysContracts } from "pegasys-services";
import { shortAddress } from "utils";

export const VoteContainer: NextPage = () => {
	const theme = usePicasso();
	const { chainId, isConnected } = useWallet();
	const {
		selectedProposals,
		showCancelled,
		setShowCancelled,
		votesLocked,
		delegatedTo,
		proposals,
		dataLoading,
		currentVotes,
	} = useGovernance();
	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const { colorMode } = useColorMode();

	const { t: translation, i18n } = useTranslation();

	const {
		onOpenUnlockVotesModal,
		isOpenUnlockVotesModal,
		onCloseUnlockVotesModal,
		isOpenTransaction,
		onCloseTransaction,
	} = useModal();

	const { language } = i18n;

	return (
		<Flex justifyContent="center" alignItems="center">
			<UnlockVotesModal
				isOpen={isOpenUnlockVotesModal}
				onClose={onCloseUnlockVotesModal}
			/>
			<LoadingTransition
				isOpen={isOpenTransaction}
				onClose={onCloseTransaction}
			/>
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
								h={!votesLocked ? "85%" : "100%"}
							/>
							<Flex
								zIndex="docked"
								flexDirection="column"
								px={["1rem", "1.3rem", "1.625rem", "1.625rem"]}
								py={["0.8rem", "1.1rem", "1.375rem", "1.375rem"]}
								gap="2"
								h={
									!votesLocked
										? ["9rem", "10rem", "10rem", "10rem"]
										: ["10rem", "10rem", "10rem", "10rem"]
								}
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
									position="relative"
									borderBottomRadius="xl"
									top={["2rem", "3", "3", "3"]}
									py="0.531rem"
									px="1rem"
								>
									<>
										<Text
											fontWeight="500"
											fontSize={
												language === "vn"
													? ["1rem", "0.85rem", "1rem", "1rem"]
													: "1rem"
											}
											color="white"
										>
											{translation("votePage.yourVotes")}:{" "}
											{currentVotes ? currentVotes.toSignificant() : 0}
										</Text>
										<Flex
											gap="4"
											fontSize={
												language === "vn"
													? ["0.875rem", "0.75rem", "0.875rem", "0.875rem"]
													: "0.875rem"
											}
										>
											<Text color="white">
												{translation("votePage.delegatedTo")}{" "}
												{delegatedTo.toLocaleLowerCase() === "self"
													? delegatedTo
													: shortAddress(delegatedTo)}
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
									</>
								</Flex>
							)}
						</Flex>
						<Flex
							alignItems="flex-start"
							my={["1", "4", "8", "8"]}
							mt={["3rem", "3rem", "3rem", "3rem"]}
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
								{!!proposals.length && (
									<Flex
										flexDirection="row"
										justifyContent="space-between"
										alignItems="baseline"
										w="100%"
										h="max-content"
									>
										<Flex>
											<Text
												fontSize={["1.25rem", "1.25rem", "2xl", "2xl"]}
												fontWeight="semibold"
												color={theme.text.mono}
											>
												{translation("votePage.proposals")}
											</Text>
										</Flex>
										{!votesLocked ? (
											<Flex gap="2.5rem" fontSize="0.875rem">
												<Flex
													gap="2"
													alignItems="center"
													display={["none", "none", "flex", "flex"]}
													_hover={{ cursor: "pointer", opacity: "0.9" }}
												>
													<Text color={theme.text.mono}>
														{translation("votePage.discussAtTheForum")}
													</Text>
													<MdOutlineCallMade
														size={18}
														color={theme.text.mono}
													/>
												</Flex>
												<Flex flexDirection="row" gap="2" alignItems="center">
													<Text color={theme.text.mono}>
														{translation("votePage.showCancelled")}
													</Text>
													<Switch
														isChecked={showCancelled}
														size="md"
														onChange={() => setShowCancelled(!showCancelled)}
													/>
												</Flex>
											</Flex>
										) : (
											isConnected &&
											chainId &&
											PegasysContracts[chainId]?.GOVERNANCE_ADDRESS && (
												<Flex w="max-content" h="max-content">
													<Button
														fontSize="0.875rem"
														fontWeight="semibold"
														px={["1.7rem", "1.5rem", "1.5rem", "1.5rem"]}
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
											)
										)}
									</Flex>
								)}
								{isConnected ? (
									<Flex
										fontSize="0.875rem"
										gap="2"
										alignItems="center"
										display={["flex", "flex", "none", "none"]}
										_hover={{ cursor: "pointer" }}
										pl="2"
									>
										<Text color={theme.text.mono}>
											{translation("votePage.discussAtTheForum")}
										</Text>
										<MdOutlineCallMade size={18} color={theme.text.mono} />
									</Flex>
								) : (
									<Flex />
								)}
							</Flex>

							{!isConnected || !proposals.length ? (
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
									<Flex mt="0.9375rem">
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
							) : !chainId || !PegasysContracts[chainId]?.GOVERNANCE_ADDRESS ? (
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
										{translation("earnPages.featNotAvailable")}
									</Text>
								</Flex>
							) : dataLoading ? (
								<Flex
									w="100%"
									mt={["3rem", "3rem", "4rem", "4rem"]}
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
									gap="16"
								>
									<Flex
										className="circleLoading"
										width="3.75rem !important"
										height="3.75rem !important"
										id={
											colorMode === "dark"
												? "pendingTransactionsDark"
												: "pendingTransactionsLight"
										}
									/>
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
