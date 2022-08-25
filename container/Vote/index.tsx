import {
	Button,
	Flex,
	Img,
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Switch,
	Text,
	ButtonProps,
} from "@chakra-ui/react";
import {
	MdHelpOutline,
	MdArrowBack,
	MdAdd,
	MdOutlineInfo,
	MdOutlineCallMade,
	MdSearch,
} from "react-icons/md";
import { DefaultTemplate } from "container";
import { usePicasso, useWallet } from "hooks";
import { NextPage } from "next";
import { VoteCards } from "components/Vote/VoteCards";
import { ReactNode } from "react";
import Jazzicon from "react-jazzicon";

interface IVoteProps extends ButtonProps {
	children?: ReactNode;
}

export const VoteContainer: NextPage<IVoteProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();
	const { isConnected } = useWallet();
	const { isGovernance, setIsGovernance } = useWallet();

	return (
		<Flex justifyContent="center" alignItems="center">
			<Flex
				alignItems="flex-start"
				justifyContent="center"
				pt={["10", "10", "20", "20"]}
				mb="6.2rem"
			>
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
								src={theme.bg.governanceBanner}
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
										<Switch size="md" />
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
					<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
						<Flex
							alignItems="flex-start"
							my={["1", "4", "2", "2"]}
							justifyContent="flex-start"
							w="100%"
							flexDirection="column"
							zIndex="docked"
						>
							<Flex
								flexDirection="row"
								zIndex="docked"
								alignItems="center"
								gap="2"
								_hover={{ cursor: "pointer" }}
								onClick={() => setIsGovernance(false)}
							>
								<MdArrowBack size={21} color={theme.icon.whiteGray} />
								<Text
									fontSize="xl"
									fontWeight="semibold"
									color={theme.icon.whiteGray}
								>
									All Proposals
								</Text>
							</Flex>
							<Flex
								mt="0.875rem"
								w="100%"
								bgColor={theme.bg.blackAlpha}
								borderRadius="xl"
								h="max-content"
								boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
								flexDirection="column"
							>
								<Flex
									bgColor={theme.bg.blueNavy}
									h="15.188rem"
									w="100%"
									borderTopRadius="xl"
									flexDirection="column"
								>
									<Flex
										alignItems="center"
										justifyContent="center"
										w="60%"
										h="1.625rem"
										mt="1.5rem"
										backgroundColor="#48BB78"
										borderRightRadius="full"
									>
										<Text
											fontWeight="semibold"
											color="white"
											fontSize="13px"
											pl="1rem"
										>
											EXECUTED
										</Text>
										<Text
											fontWeight="normal"
											color="white"
											fontSize="12px"
											pl="1rem"
										>
											Voting ended Ago 16, 2022 at 9:08 AM GMT-3
										</Text>
									</Flex>
									<Flex mx="7" mt="4" flexDirection="column">
										<Text
											fontWeight="semibold"
											color={theme.text.mono}
											fontSize="24px"
										>
											Should the Pegasys community participate in the Protocol
											Guild Pilot?
										</Text>
										<Flex
											bgColor="rgba(255, 255, 255, 0.04)"
											w="100%"
											h="4.563rem"
											borderRadius="xl"
											mt="4"
											py="2"
											px="3"
											justifyContent="space-between"
											color={theme.text.mono}
										>
											<Flex
												justifyContent="space-between"
												flexDirection="column"
											>
												<Flex justifyContent="space-between" w="full-content">
													<Text>For</Text>
													<Flex>
														<Text fontWeight="semibold" mr="0.563rem">
															50,634,749
														</Text>
														<Text>/ 40,000,000</Text>
													</Flex>
												</Flex>
												<Flex
													w="16.625rem"
													borderRadius="xl"
													h="0.375rem"
													bgColor="#48BB78"
													mb="8px"
												/>
											</Flex>
											<Flex
												justifyContent="space-between"
												flexDirection="column"
											>
												<Flex justifyContent="space-between" w="full-content">
													<Text color="">Against</Text>
													<Flex>
														<Text fontWeight="semibold" color={theme.text.mono}>
															390
														</Text>
													</Flex>
												</Flex>
												<Flex
													w="16.625rem"
													borderRadius="xl"
													h="0.375rem"
													bgColor={theme.bg.voteGray}
													mb="8px"
												>
													<Flex
														w="3.313rem"
														borderRadius="xl"
														h="0.375rem"
														bgColor="#F56565"
													/>
												</Flex>
											</Flex>
										</Flex>
									</Flex>
								</Flex>
								<Flex mx="7" mt="4" flexDirection="column" gap="5">
									<Flex
										justifyContent="flex-start"
										w="full-content"
										gap="3"
										flexDirection="column"
									>
										<Text fontWeight="bold" color={theme.text.mono}>
											Details
										</Text>
										<Flex>
											<Text>1:</Text>
											<Text
												color={theme.text.cyanPurple}
												ml="0.438rem"
												_hover={{ cursor: "pointer" }}
											>
												0x25aece71c96825BNJ6256vcsd3568DC98fA1
											</Text>
											<Text>.UNKNOWN()</Text>
										</Flex>
									</Flex>
									<Flex
										justifyContent="flex-start"
										w="full-content"
										gap="3"
										flexDirection="column"
									>
										<Text color={theme.text.mono} fontWeight="bold">
											Description
										</Text>
										<Flex>
											<Text color={theme.text.mono}>
												Sponsored by GFX Labs for MiLLie Since the lorem ipsum
												dolor sit amet, consectetur adipiscing elit. Viverra eu
												lectus tellus vitae convallis morbi nibh leo. Enim leo,
												fames massa molestie pulvinar ut dolor ante enim.
												Eleifend consectetur gravida quis arcu vel quis amet,
												sed. Quis non convallis elementum, viverra ornare ornare
												velit arcu eget. Phasellus amet bibendum ornare
												ultricies at. Fermentum dictum amet quis mauris, amet,
												integer fringilla non placerat. Elit rhoncus suscipit
												purus augue. Auctor at sollicitudin varius semper
												scelerisque. In eget massa vitae in vitae duis. Neque
												convallis (massa ut sit mus consequat), adipiscing
												parturient pulvinar. Ut senectus at orci egestas proin
												fames eu. Sed volutpat nam vestibulum, consequat tortor.
												Est, sed molestie sem neque, malesuada. Ultrices tempus,
												volutpat dui turpis vitae mattis in. Rhoncus turpis
												malesuada a non, scelerisque sit libero pellentesque
												morbi. Amet, dapibus leo felis, aliquam rutrum mi
												cursus. Tortor pellentesque id nam bibendum tincidunt.
												Ullamcorper mi et amet arcu vel pellentesque
												sollicitudin accumsan pretium. Eleifend cras augue lorem
												eu, libero pretium condimentum egestas. Netus vulputate
												id ullamcorper praesent egestas. Lacus tortor vel, in
												scelerisque velit, feugiat nisl ligula nam. In id semper
												scelerisque in lectus non sit. Praesent suspendisse
												justo etiam tellus amet dolor gravida id. More info can
												be found on the consensus check forum thread.
											</Text>
										</Flex>
									</Flex>

									<Flex
										justifyContent="flex-start"
										w="full-content"
										gap="4"
										flexDirection="row"
										alignItems="center"
										mb="1.563rem"
									>
										<Text color={theme.text.mono} fontWeight="bold">
											Proposer
										</Text>

										<Flex
											textTransform="lowercase"
											color={theme.text.mono}
											gap="2"
											alignItems="center"
										>
											<Jazzicon
												diameter={18}
												seed={Math.round(Math.random() * 10000000)}
											/>
											<Text>0x6856...BF99</Text>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};
