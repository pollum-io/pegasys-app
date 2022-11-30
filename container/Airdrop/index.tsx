import { NextPage } from "next";
import {
	Button,
	Flex,
	Icon,
	Img,
	Link,
	Text,
	useMediaQuery,
	useColorMode,
} from "@chakra-ui/react";
import {
	useClaimCallback,
	usePicasso,
	userHasAvailableClaim,
	userUnclaimedAmount,
} from "hooks";
import { SiDiscord, SiTwitter } from "react-icons/si";
import { FaTelegramPlane } from "react-icons/fa";
import { useMemo, useEffect, useState } from "react";
import { MdOutlineCallMade } from "react-icons/md";
import { BorderAnimation } from "components/Airdrop/BorderAnimation";
import { ChainId, TokenAmount } from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { useWallet, ApprovalState, useTransaction } from "pegasys-services";
import { useTranslation } from "react-i18next";

export const AirdropContainer: NextPage = () => {
	const theme = usePicasso();
	const [isMobile] = useMediaQuery("(max-width: 480px)");

	const {
		setCurrentTxHash,
		setApprovalState,
		approvalState,
		setTransactions,
		transactions,
	} = useTransaction();

	const {
		chainId: currentNetworkChainId,
		isConnected,
		address: walletAddress,
		signer,
		provider,
	} = useWallet();

	const chainId =
		currentNetworkChainId === 57 ? ChainId.NEVM : ChainId.TANENBAUM;

	const [isAvailable, setIsAvailable] = useState<boolean>(true);
	const [isClaim, setIsClaim] = useState<boolean>(false);
	const [isClaimed, setIsClaimed] = useState<boolean>(false);
	const [availableClaimAmount, setAvailableClaimAmount] =
		useState<TokenAmount>();

	const { t: translation, i18n } = useTranslation();

	const { language } = i18n;

	const { colorMode } = useColorMode();

	const isClaiming =
		approvalState.status === ApprovalState.PENDING &&
		approvalState.type === "claim";

	const walletInfos = {
		walletAddress,
		provider,
		chainId,
	};

	const { claimCallback } = useClaimCallback(
		walletAddress,
		chainId,
		signer as Signer,
		walletInfos,
		setApprovalState,
		setCurrentTxHash,
		setTransactions,
		transactions
	);

	useMemo(async () => {
		if (!isConnected || !walletAddress) return null;

		const canClaim = await userHasAvailableClaim(
			walletAddress,
			chainId,
			provider
		);
		setIsClaim(canClaim);

		if (!canClaim) return setIsAvailable(false);
		const claimAmount = await userUnclaimedAmount(
			walletAddress,
			chainId,
			provider
		);
		setAvailableClaimAmount(claimAmount);

		return null;
	}, [isConnected, isClaiming]);

	useEffect(() => {
		if (
			approvalState.status === ApprovalState.APPROVED &&
			approvalState.type === "claim"
		)
			setIsClaimed(true);
	}, [isClaiming]);

	return (
		<Flex alignItems="flex-start" justifyContent="center" mb="6.2rem">
			<Flex
				flexDirection="column"
				w={["18rem", "md", "2xl", "2xl"]}
				alignItems="center"
				borderRadius="12px"
			>
				<Flex
					flexDirection="column"
					zIndex="99"
					position="relative"
					borderTopRadius="3xl"
					backgroundColor="transparent"
					w={["20rem", "md", "2xl", "2xl"]}
					boxShadow={
						colorMode === "dark"
							? "0px 4px 4px rgba(0, 0, 0, 0.25)"
							: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)"
					}
					filter={
						colorMode === "dark"
							? "drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.2)) drop-shadow(0px 15px 40px rgba(0, 0, 0, 0.4))"
							: ""
					}
				>
					<Img
						src={isMobile ? theme.bg.aidropBannerMobile : theme.bg.psysAirdrop}
						position="absolute"
						zIndex="base"
						w="100%"
						h="100%"
					/>
					<Flex
						zIndex="docked"
						flexDirection="column"
						px={["1rem", "1.3rem", "1.625rem", "1.625rem"]}
						py={["0.8rem", "1.1rem", "1.375rem", "1.375rem"]}
						h="10rem"
						gap="3"
					>
						<Text fontWeight="bold" color="white" fontSize="md">
							{translation("airdrop.airdropTime")}
						</Text>
						<Text
							color="white"
							fontWeight="medium"
							fontSize="sm"
							lineHeight="shorter"
							w={["100%", "90%", "60%", "60%"]}
						>
							{translation("airdrop.mainText")}
						</Text>
					</Flex>
					{colorMode === "dark" && (
						<Flex
							w="65%"
							h="100%"
							borderTopLeftRadius="2xl"
							borderBottomRadius="2xl"
							zIndex="base"
							position="absolute"
							background="linear-gradient(89.54deg, rgba(8, 17, 32, 0.9) 44.27%, rgba(8, 17, 32, 0) 100.3%)"
						/>
					)}
				</Flex>
				<Flex>
					{!isConnected ? (
						<BorderAnimation>
							<Flex
								py={["0", "0", "0", "0"]}
								w={
									language === "fr"
										? ["unset", "20rem", "unset", "unset"]
										: ["unset", "unset", "unset", "unset"]
								}
							>
								<Flex>
									<Text
										textAlign="center"
										color={theme.text.mono}
										px={["4", "2", "2", "2"]}
										fontSize={["sm", "sm", "md", "md"]}
									>
										{translation("airdrop.connectWalletViewLiquidity")}
									</Text>
								</Flex>
							</Flex>
						</BorderAnimation>
					) : (
						<Flex w="100%">
							{!isAvailable && !isClaimed && (
								<BorderAnimation>
									<Flex
										justifyContent="space-between"
										flexDirection={["column", "column", "row", "row"]}
										w="100%"
										gap={["1.5rem", "1.5rem", "0", "0"]}
										alignItems="center"
									>
										<Flex
											w={
												language === "tr"
													? ["100%", "max-content", "50%", "50%"]
													: ["100%", "max-content", "60%", "60%"]
											}
											alignItems="center"
											justifyContent={["left", "left", "unset", "unset"]}
										>
											<Text color="white" fontSize={["sm", "sm", "md", "md"]}>
												{translation("airdrop.noAvailableClaim")}
											</Text>
										</Flex>
										<Flex
											gap="2"
											_hover={{
												textDecoration: "underline",
												cursor: "pointer",
												opacity: "0.9",
											}}
											alignItems="center"
											w={["100%", "max-content", "18rem", "18rem"]}
											justifyContent={["left", "left", "right", "right"]}
										>
											<Text
												color={theme.text.cyanPurple}
												fontSize="sm"
												fontWeight="medium"
												h="100%"
											>
												{translation("earnPage.readMoreAboutPsys")}
											</Text>
											<Flex
												h="100%"
												alignItems="center"
												pb={["0.03rem", "0.03rem", "0.1rem", "0.1rem"]}
											>
												<MdOutlineCallMade size={15} color="cyan" />
											</Flex>
										</Flex>
									</Flex>
								</BorderAnimation>
							)}
							{isClaim && (
								<BorderAnimation>
									<Flex
										px="2rem"
										justifyContent="space-between"
										w="100%"
										flexDirection={["column", "column", "row", "row"]}
										alignItems="center"
									>
										<Flex
											gap="2"
											flexDirection={["column", "column", "row", "row"]}
											alignItems={["center", "center", "unset", "unset"]}
										>
											<Flex h="2rem">
												<Img
													src={theme.bg.blurPegasysLogo}
													w="4rem"
													h="4rem"
													filter="drop-shadow(0px 4px 7px rgba(0, 217, 239, 0.25))"
												/>
											</Flex>
											<Flex alignItems="baseline">
												<Text fontSize="4xl" fontWeight="semibold" ml="2">
													{availableClaimAmount
														? availableClaimAmount?.toFixed(2, {
																groupSeparator: ",",
														  })
														: "-"}
												</Text>
												<Text fontSize="xl" pl="2">
													$PSYS
												</Text>
											</Flex>
										</Flex>
										<Flex
											align="center"
											gap="2"
											pt={["0.5rem", "0.5rem", "unset", "unset"]}
										>
											{isClaiming ? (
												<Button
													fontSize="sm"
													fontWeight="semibold"
													py="0.625rem"
													w="3xs"
													h="max-content"
													bgColor={theme.bg.blueNavyLightness}
													color={theme.text.cyan}
													_hover={{ opacity: "1" }}
													_active={{}}
													onClick={claimCallback}
													borderRadius="full"
												>
													{translation("airdrop.claim")}
												</Button>
											) : (
												<Button
													fontSize="sm"
													fontWeight="semibold"
													py="0.525rem"
													pr="1"
													w="3xs"
													h="max-content"
													bgColor={theme.bg.blueNavyLightness}
													color={theme.text.cyan}
													_hover={{ opacity: "1" }}
													_active={{}}
													borderRadius="full"
												>
													<Flex>
														<Flex
															className="circleLoading"
															h="4"
															w="4"
															pr="2"
															mr="2"
															borderColor="#00D9EF rgba(255, 255, 255, 0.48) rgba(255, 255, 255, 0.48) rgba(255, 255, 255, 0.48)"
														/>
														<Flex mt="0.05rem">
															{translation("airdrop.loading")}...
														</Flex>
													</Flex>
												</Button>
											)}
										</Flex>
									</Flex>
								</BorderAnimation>
							)}
							{isClaimed && (
								<BorderAnimation>
									<Flex gap="8" flexDirection="column" alignItems="center">
										<Flex
											align="center"
											gap="2"
											flexDirection={["column", "column", "row", "row"]}
										>
											<Flex h="3.5rem">
												<Img
													src={theme.bg.blurPegasysLogo}
													w="4rem"
													h="4rem"
													filter="drop-shadow(0px 4px 7px rgba(0, 217, 239, 0.25))"
												/>
											</Flex>
											<Flex alignItems="baseline">
												<Text
													fontSize={["xl", "2xl", "3xl", "3xl"]}
													fontWeight="semibold"
													textAlign="center"
													ml="2"
												>
													{translation("airdrop.welcomeToTeamPegasys")}
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
													w={["8", "10", "10", "10"]}
													h={["8", "10", "10", "10"]}
													color={theme.text.greenSocial}
												/>
											</Link>
											<Link href="https://twitter.com/PegasysDEX" isExternal>
												<Icon
													as={SiTwitter}
													w={["8", "10", "10", "10"]}
													h={["8", "10", "10", "10"]}
													color={theme.text.greenSocial}
												/>
											</Link>
											<Link
												href="https://t.me/joinchat/GNosBd1_76E5MTVh"
												isExternal
											>
												<Icon
													as={FaTelegramPlane}
													w={["8", "10", "10", "10"]}
													h={["8", "10", "10", "10"]}
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
