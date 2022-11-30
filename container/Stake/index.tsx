import {
	Button,
	Flex,
	Img,
	Text,
	useMediaQuery,
	useColorMode,
	SlideFade,
	Collapse,
} from "@chakra-ui/react";
import { StakeCard, LoadingTransition } from "components";
import { useModal, usePicasso } from "hooks";
import { NextPage } from "next";
import { MdOutlineCallMade } from "react-icons/md";
import { useTranslation } from "react-i18next";
import {
	useWallet as psUseWallet,
	useStake,
	useEarn,
	IStakeInfo,
	IEarnInfo,
	RoutesFramework,
} from "pegasys-services";
import { StakeActions } from "components/Modals/StakeActions";

export const StakeContainer: NextPage = () => {
	const theme = usePicasso();
	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const { colorMode } = useColorMode();
	const { isConnected, address, chainId } = psUseWallet();
	const { showInUsd, setShowInUsd } = useStake();
	const { earnOpportunities, loading, signatureLoading, dataLoading } =
		useEarn();
	const { isOpenStakeActions, onCloseStakeActions } = useModal();
	const { t: translation } = useTranslation();

	return (
		<Flex w="100%" h="100%" alignItems="flex-start" justifyContent="center">
			<LoadingTransition isOpen={loading || signatureLoading} />
			<StakeActions isOpen={isOpenStakeActions} onClose={onCloseStakeActions} />
			<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
				<SlideFade in={Boolean(isMobile || !isMobile)} offsetY="-30px">
					<Flex
						flexDirection="column"
						zIndex="docked"
						position="relative"
						borderRadius="xl"
						backgroundColor={theme.bg.alphaPurple}
					>
						<Img
							borderRadius="xl"
							src={isMobile ? theme.bg.stakeBannerMobile : theme.bg.stakeBanner}
							position="absolute"
							zIndex="base"
							w="100%"
							h="85%"
						/>
						<Flex
							zIndex="docked"
							flexDirection="column"
							px="1.625rem"
							py="1.375rem"
							gap="3"
							h={["7.5rem", "8rem", "10rem", "10rem"]}
							color="white"
						>
							<Text fontWeight="bold" color="white" fontSize="md">
								{translation("earnPages.stakingTitle")}
							</Text>
							<Text
								fontWeight="medium"
								fontSize="sm"
								lineHeight="shorter"
								w={["70%", "50%", "50%", "50%"]}
							>
								{translation("earnPages.stakingDescription")}
							</Text>
						</Flex>
						<Flex
							alignItems="center"
							justifyContent="center"
							flexDirection="row"
							bgColor={theme.bg.alphaPurple}
							zIndex="0"
							position="relative"
							top="2"
							borderBottomRadius="xl"
							py="0.531rem"
							gap="2.5"
							color="white"
							cursor="pointer"
							onClick={() => window.open("https://pegasys.finance/blog/psys/")}
						>
							<Text fontWeight="medium" fontSize="xs">
								{translation("earnPages.stakingLink")}
							</Text>
							<MdOutlineCallMade size={20} />
						</Flex>
					</Flex>
				</SlideFade>
				<Flex
					alignItems="center"
					my="8"
					justifyContent="flex-start"
					w="100%"
					flexDirection="row"
					zIndex="docked"
				>
					<Flex
						mt={["4"]}
						flexDirection={["column", "column", "row", "row"]}
						justifyContent="space-between"
						w="100%"
						zIndex="docked"
					>
						<SlideFade in={Boolean(isMobile || !isMobile)} offsetY="-50px">
							<Text fontSize="2xl" fontWeight="semibold">
								{translation("earnPages.stakes")}
							</Text>
						</SlideFade>
						<Collapse in={Boolean(!dataLoading && address)}>
							{address && !dataLoading && (
								<Flex
									gap="1"
									mt={["4", "4", "0", "0"]}
									justifyContent={[
										"center",
										"center",
										"space-between",
										"space-between",
									]}
								>
									<Button
										onClick={() => setShowInUsd(false)}
										color={
											showInUsd
												? theme.border.lightGray
												: theme.text.darkBluePurple
										}
										bgColor={
											showInUsd ? "transparent" : theme.bg.babyBluePurple
										}
										borderRadius="full"
										w="5.688rem"
										h="max-content"
										py="2"
										px="6"
										fontWeight="semibold"
										_hover={{
											opacity: "0.9",
										}}
									>
										PSYS
									</Button>
									<Button
										onClick={() => setShowInUsd(true)}
										color={
											showInUsd
												? theme.text.darkBluePurple
												: theme.border.lightGray
										}
										bgColor={
											showInUsd ? theme.bg.babyBluePurple : "transparent"
										}
										borderRadius="full"
										w="5.688rem"
										h="max-content"
										py="2"
										px="6"
										fontWeight="semibold"
										_hover={{
											opacity: "0.9",
										}}
									>
										USD
									</Button>
								</Flex>
							)}
						</Collapse>
					</Flex>
				</Flex>
				<Collapse in={dataLoading}>
					{dataLoading && (
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
								width="60px !important"
								height="60px !important"
								id={
									colorMode === "dark"
										? "pendingTransactionsDark"
										: "pendingTransactionsLight"
								}
							/>
						</Flex>
					)}
				</Collapse>

				<Collapse in={!dataLoading && !isConnected}>
					{!dataLoading && !isConnected && (
						<Flex
							w="100%"
							mt={["3rem", "3rem", "4rem", "4rem"]}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							mb={["3rem", "3rem", "4rem", "4rem"]}
						>
							<Text
								fontSize={["sm", "sm", "md", "md"]}
								fontWeight="normal"
								textAlign="center"
							>
								{translation("earnPages.walletConnect")}
							</Text>
						</Flex>
					)}
				</Collapse>

				<Collapse
					in={
						!dataLoading &&
						isConnected &&
						(!chainId || !RoutesFramework.getStakeAddress(chainId))
					}
				>
					{!dataLoading &&
						isConnected &&
						(!chainId || !RoutesFramework.getStakeAddress(chainId)) && (
							<Flex
								w="100%"
								mt={["3rem", "3rem", "4rem", "4rem"]}
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
								mb={["3rem", "3rem", "4rem", "4rem"]}
							>
								<Text
									fontSize={["sm", "sm", "md", "md"]}
									fontWeight="normal"
									textAlign="center"
								>
									{translation("earnPages.featNotAvailable")}
								</Text>
							</Flex>
						)}
				</Collapse>

				<Collapse
					in={Boolean(
						!dataLoading &&
							isConnected &&
							!(!chainId || !RoutesFramework.getStakeAddress(chainId)) &&
							!earnOpportunities.length
					)}
				>
					{!dataLoading &&
						isConnected &&
						!(!chainId || !RoutesFramework.getStakeAddress(chainId)) &&
						!earnOpportunities.length && (
							<Flex
								w="100%"
								mt={["3rem", "3rem", "4rem", "4rem"]}
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
								mb={["3rem", "3rem", "4rem", "4rem"]}
							>
								<Text
									fontSize={["sm", "sm", "md", "md"]}
									fontWeight="normal"
									textAlign="center"
								>
									{translation("earnPages.anyAvailableOpportunities")}
								</Text>
							</Flex>
						)}
				</Collapse>

				<Collapse
					in={Boolean(
						!dataLoading &&
							isConnected &&
							!(!chainId || !RoutesFramework.getStakeAddress(chainId)) &&
							earnOpportunities.length
					)}
				>
					{!dataLoading &&
						isConnected &&
						!(!chainId || !RoutesFramework.getStakeAddress(chainId)) &&
						earnOpportunities.length && (
							<Flex
								flexDirection="column"
								gap="8"
								mb="24"
								alignItems={["center", "center", "center", "center"]}
							>
								{earnOpportunities.map((stakeInfo: IEarnInfo, index) => (
									<StakeCard key={index} stakeInfo={stakeInfo as IStakeInfo} />
								))}
							</Flex>
						)}
				</Collapse>
			</Flex>
		</Flex>
	);
};
