import { DefaultTemplate } from "container";
import { NextPage } from "next";
import { Button, Flex, Icon, Img, Link, Text } from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import { SiDiscord, SiTwitter } from "react-icons/si";
import { FaTelegramPlane } from "react-icons/fa";
import { useState } from "react";
import { MdOutlineCallMade } from "react-icons/md";
import { BorderAnimation } from "components/Airdrop/BorderAnimation";

export const AirdropContainer: NextPage = () => {
	const theme = usePicasso();

	const { isConnected } = useWallet();

	const [isNotAvailable, setIsNotAvailable] = useState();
	const [isClaim, setIsClaim] = useState();
	const [isClaiming, setIsClaiming] = useState();
	const [isClaimed, setIsClaimed] = useState();

	return (
		<Flex alignItems="flex-start" justifyContent="center" pt="20" mb="6.2rem">
			<Flex flexDirection="column" w="2xl">
				<Flex
					flexDirection="column"
					zIndex="99"
					position="relative"
					borderTopRadius="2xl"
					backgroundColor={theme.bg.blueNavy}
					w="2xl"
					box-shadow="0px 0px 0px 1px rgba(0, 0, 0, 0.1)"
					filter="drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.2)) drop-shadow(0px 15px 40px rgba(0, 0, 0, 0.4))"
				>
					<Img
						borderTopRadius="xl"
						src="images/backgrounds/PsysAirdrop.png"
						position="absolute"
						zIndex="base"
						w="100%"
						h="100%"
					/>
					<Flex
						zIndex="docked"
						flexDirection="column"
						px="1.625rem"
						py="1.375rem"
						gap="3"
					>
						<Text fontWeight="bold" color="white" fontSize="md">
							It’s airdrop time!
						</Text>
						<Text
							color="white"
							fontWeight="semibold"
							fontSize="sm"
							lineHeight="shorter"
							w="60%"
						>
							If you have taken the steps to qualify for the PSYS airdrop, this
							is the place to check how much you earned and claim your tokens.
						</Text>
					</Flex>
					<Flex
						w="65%"
						h="100%"
						borderTopLeftRadius="2xl"
						zIndex="base"
						position="absolute"
						background="linear-gradient(89.54deg, rgba(8, 17, 32, 0.9) 44.27%, rgba(8, 17, 32, 0) 100.3%)"
					/>
				</Flex>
				<Flex>
					{!isConnected ? (
						<BorderAnimation>
							<Flex py="4">
								<Flex>
									<Text color="white">
										Please connect your wallet in the button bellow to check
										your eligibility.
									</Text>
								</Flex>
							</Flex>
						</BorderAnimation>
					) : (
						<Flex w="100%">
							{isNotAvailable && (
								<BorderAnimation>
									<Flex gap="40" flexDirection="row" align="center">
										<Flex>
											<Text color="white">
												You have no available PSYS to claim.
											</Text>
										</Flex>
										<Flex
											gap="2"
											_hover={{
												textDecoration: "underline",
												cursor: "pointer",
												color: "cyan",
											}}
										>
											<Text
												color={theme.text.cyan}
												fontSize="sm"
												fontWeight="medium"
											>
												Read more about PSYS
											</Text>
											<MdOutlineCallMade size={15} color="cyan" />
										</Flex>
									</Flex>
								</BorderAnimation>
							)}
							{isClaim && (
								<BorderAnimation>
									<Flex gap="28" flexDirection="row" alignItems="center">
										<Flex align="center" gap="2">
											<Img
												src="icons/pegasys.png"
												w="14"
												h="14"
												filter="drop-shadow(0px 4px 7px rgba(0, 217, 239, 0.25))"
											/>
											<Flex alignItems="baseline">
												<Text fontSize="4xl" fontWeight="semibold" ml="2">
													234.32
												</Text>
												<Text fontSize="xl" pl="2">
													$PSYS
												</Text>
											</Flex>
										</Flex>
										<Flex align="center" gap="2">
											{!isClaiming ? (
												<Button
													fontSize="sm"
													fontWeight="semibold"
													py="0.625rem"
													w="3xs"
													h="max-content"
													bgColor={theme.bg.blueNavyLightness}
													color={theme.text.cyanWhite}
													_hover={{ opacity: "1" }}
													_active={{}}
													borderRadius="full"
												>
													Claim now
												</Button>
											) : (
												<Button
													fontSize="sm"
													fontWeight="semibold"
													py="0.625rem"
													pr="1"
													w="3xs"
													h="max-content"
													bgColor={theme.bg.blueNavyLightness}
													color={theme.text.cyanWhite}
													_hover={{ opacity: "1" }}
													_active={{}}
													borderRadius="full"
												>
													<Flex className="circleLoading" />
													Claiming...
												</Button>
											)}
										</Flex>
									</Flex>
								</BorderAnimation>
							)}
							{isClaimed && (
								<BorderAnimation>
									<Flex gap="8" flexDirection="column" alignItems="center">
										<Flex align="center" gap="2" flexDirection="row">
											<Img
												src="icons/pegasys.png"
												w="14"
												h="14"
												filter="drop-shadow(0px 4px 7px rgba(0, 217, 239, 0.25))"
											/>
											<Flex alignItems="baseline">
												<Text fontSize="3xl" fontWeight="semibold" ml="2">
													Welcome to the Pegasys DAO{" "}
												</Text>
											</Flex>
										</Flex>
										<Flex align="center" gap="10" flexDirection="row">
											<Link
												href="https://discord.com/invite/UzjWbWWERz"
												isExternal
											>
												<Icon
													as={SiDiscord}
													w="10"
													h="10"
													color={theme.text.greenSocial}
												/>
											</Link>
											<Link href="https://twitter.com/PegasysDEX" isExternal>
												<Icon
													as={SiTwitter}
													w="10"
													h="10"
													color={theme.text.greenSocial}
												/>
											</Link>
											<Link
												href="https://t.me/joinchat/GNosBd1_76E5MTVh"
												isExternal
											>
												<Icon
													as={FaTelegramPlane}
													w="10"
													h="10"
													color={theme.text.greenSocial}
												/>
											</Link>
										</Flex>
									</Flex>
								</BorderAnimation>
							)}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
