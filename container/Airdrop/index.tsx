import { NextPage } from "next";
import {
	Button,
	Flex,
	Icon,
	Img,
	Link,
	Text,
	useMediaQuery,
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

	const { t: translation } = useTranslation();

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
			>
				<Flex
					flexDirection="column"
					zIndex="99"
					position="relative"
					borderTopRadius="2xl"
					backgroundColor="transparent"
					w={["20rem", "md", "2xl", "2xl"]}
				>
					<Img
						src={isMobile ? theme.bg.aidropBannerMobile : theme.bg.psysAirdrop}
						position="absolute"
						zIndex="base"
						w="100%"
						h={["100%", "100%", "100%", "100%"]}
					/>
					<Flex
						zIndex="docked"
						flexDirection="column"
						px="1.625rem"
						h={["10rem", "10rem", "10rem", "10rem"]}
						py="1.375rem"
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
					<Flex
						w="65%"
						h="100%"
						borderTopLeftRadius="2xl"
						borderBottomRadius="2xl"
						zIndex="base"
						position="absolute"
						background="linear-gradient(89.54deg, rgba(8, 17, 32, 0.9) 44.27%, rgba(8, 17, 32, 0) 100.3%)"
					/>
				</Flex>
				<Flex>
					{!isConnected ? (
						<BorderAnimation>
							<Flex py={["0", "0", "4", "4"]}>
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
										gap={["4", "4", "40", "40"]}
										flexDirection={["column", "column", "row", "row"]}
									>
										<Flex>
											<Text color="white" fontSize={["sm", "sm", "md", "md"]}>
												{translation("airdrop.noAvailableClaim")}
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
												textAlign="center"
											>
												{translation("earnPage.readMoreAboutPsys")}
											</Text>
											<MdOutlineCallMade size={15} color="cyan" />
										</Flex>
									</Flex>
								</BorderAnimation>
							)}
							{isClaim && (
								<BorderAnimation>
									<Flex
										gap={["5", "5", "28", "28"]}
										flexDirection={["column", "column", "row", "row"]}
										alignItems="center"
									>
										<Flex
											align="center"
											gap="2"
											flexDirection={["column", "column", "row", "row"]}
										>
											<Img
												src="icons/pegasys.png"
												w="14"
												h="14"
												filter="drop-shadow(0px 4px 7px rgba(0, 217, 239, 0.25))"
											/>
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
										<Flex align="center" gap="2">
											{!isClaiming ? (
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
													py="0.625rem"
													pr="1"
													w="3xs"
													h="max-content"
													bgColor={theme.bg.blueNavyLightness}
													color={theme.text.cyan}
													_hover={{ opacity: "1" }}
													_active={{}}
													borderRadius="full"
												>
													<Flex className="circleLoading" pr="2" mr="2" />
													{translation("airdrop.loading")}
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
											<Img
												src="icons/pegasys.png"
												w="14"
												h="14"
												filter="drop-shadow(0px 4px 7px rgba(0, 217, 239, 0.25))"
											/>
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
