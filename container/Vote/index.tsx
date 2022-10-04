import { Flex, Img, Switch, Text, useMediaQuery } from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import { NextPage } from "next";
import { VoteCards } from "components/Vote/VoteCards";
import { ProposalDetails } from "components/Vote/ProposalDetails";
import { useWallet as psUseWallet } from "pegasys-services";

export const VoteContainer: NextPage = () => {
	const theme = usePicasso();
	const { isConnected } = psUseWallet();
	const { isGovernance, showCancelled, setShowCancelled } = useWallet();
	const [isMobile] = useMediaQuery("(max-width: 480px)");

	return (
		<Flex justifyContent="center" alignItems="center">
			<Flex alignItems="flex-start" justifyContent="center" mb="6.2rem">
				{!isGovernance ? (
					<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
						<Flex
							flexDirection="column"
							zIndex="docked"
							position="relative"
							borderRadius="xl"
							backgroundColor={theme.bg.whiteGray}
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
								h="100%"
							/>
							<Flex
								zIndex="docked"
								flexDirection="column"
								px="1.625rem"
								py={["0.8rem", "1.375rem", "1.375rem", "1.375rem"]}
								gap="3"
								h={["9rem", "10rem", "10rem", "10rem"]}
								color="white"
							>
								<Text fontWeight="bold" fontSize="md">
									Pegasys Governance
								</Text>
								<Text
									color="white"
									fontWeight="medium"
									fontSize="sm"
									lineHeight="shorter"
									w={["100%", "70%", "60%", "60%"]}
								>
									PSYS tokens represent voting shares in Pegasys governance. You
									can vote on each proposal yourself or delegate your votes to a
									third party.
								</Text>
							</Flex>
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
								mt="2"
								flexDirection="row"
								justifyContent="space-between"
								w="100%"
								zIndex="docked"
								alignItems="center"
							>
								<Text
									fontSize="2xl"
									fontWeight="semibold"
									color={theme.text.mono}
								>
									Proposals
								</Text>
								{isConnected && (
									<Flex flexDirection="row" gap="2" alignItems="center">
										<Text color={theme.text.mono}>Show Cancelled</Text>
										<Switch
											size="md"
											onChange={() => setShowCancelled(!showCancelled)}
										/>
									</Flex>
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
										No proposals found.
									</Text>
									<Text
										fontSize={["sm", "sm", "md", "md"]}
										fontWeight="normal"
										textAlign="center"
										color={theme.text.mono}
									>
										Proposals submitted by community will appear here.
									</Text>
									<Flex mt="15px">
										<Text
											fontSize={["sm", "sm", "md", "md"]}
											fontWeight="normal"
											textAlign="center"
											color={theme.text.gray45}
										>
											A minimun threshold of 1,000,0000 PSYS is required to
											submit proposals.
										</Text>
									</Flex>
								</Flex>
							) : (
								<Flex
									flexDirection="column"
									mt={["1.5rem", "1.5rem", "2rem", "2rem"]}
								>
									<VoteCards />
									<VoteCards />
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
