import {
	Button,
	Collapse,
	Flex,
	Img,
	SlideFade,
	Text,
	useColorMode,
	useMediaQuery,
} from "@chakra-ui/react";
import { LoadingTransition, StakeCard } from "components";
import { StakeActions } from "components/Modals/StakeActions";
import { StakeV2Actions } from "components/Modals/StakeV2Actions";
import { useModal, usePicasso } from "hooks";
import { NextPage } from "next";
import {
	IEarnInfo,
	IStakeInfo,
	IStakeV2Info,
	RoutesFramework,
	useWallet as psUseWallet,
	useEarn,
	useStake,
	useStakeV2,
} from "pegasys-services";
import { useTranslation } from "react-i18next";
import { MdOutlineCallMade } from "react-icons/md";

export const StakeContainer: NextPage = () => {
	const theme = usePicasso();
	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const { colorMode } = useColorMode();
	const { isConnected, address, chainId } = psUseWallet();
	const { showInUsd, setShowInUsd } = useStakeV2();
	const { stakeV1Opportunities } = useStake();
	const { earnOpportunities, dataLoading } = useEarn();
	const {
		isOpenStakeActions,
		onCloseStakeActions,
		isOpenTransaction,
		onCloseTransaction,
		isOpenStakeV2Actions,
		onCloseStakeV2Actions,
	} = useModal();
	const { t: translation } = useTranslation();

	return (
		<Flex
			w="100%"
			h="100%"
			alignItems="flex-start"
			justifyContent="center"
			mb="6rem"
		>
			<LoadingTransition
				isOpen={isOpenTransaction}
				onClose={onCloseTransaction}
			/>
			<StakeActions isOpen={isOpenStakeActions} onClose={onCloseStakeActions} />
			<StakeV2Actions
				isOpen={isOpenStakeV2Actions}
				onClose={onCloseStakeV2Actions}
			/>
			<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
				<SlideFade in={Boolean(isMobile || !isMobile)} offsetY="-30px">
					<Flex
						flexDirection="column"
						zIndex="docked"
						position="relative"
						borderRadius="xl"
						backgroundColor={theme.bg.alphaPurple}
						h={["10.75rem", "unset", "unset", "unset"]}
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
							px={["1rem", "1.325rem", "1.625rem", "1.625rem"]}
							py={["0.8rem", "1.1rem", "1.375rem", "1.375rem"]}
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
								w={["90%", "50%", "50%", "50%"]}
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
							top={["7", "2", "1", "1"]}
							borderBottomRadius="xl"
							py="0.531rem"
							pt="0.2rem"
							gap="2.5"
							color="white"
							cursor="pointer"
							onClick={() => window.open("https://pegasys.finance/blog/psys/")}
						>
							<Text fontWeight="medium" fontSize="xs">
								{translation("earnPages.stakingLink")}
							</Text>
							<MdOutlineCallMade size={18} />
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
								width="3.75rem !important"
								height="3.75rem !important"
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
							!earnOpportunities.length &&
							!stakeV1Opportunities.length
					)}
				>
					{!dataLoading &&
						isConnected &&
						!(!chainId || !RoutesFramework.getStakeAddress(chainId)) &&
						!earnOpportunities.length &&
						!stakeV1Opportunities.length && (
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
							(earnOpportunities.length || stakeV1Opportunities.length)
					)}
				>
					{!dataLoading &&
						isConnected &&
						!(!chainId || !RoutesFramework.getStakeAddress(chainId)) &&
						(earnOpportunities.length || stakeV1Opportunities.length) && (
							<Flex
								flexDirection="column"
								gap="8"
								mb="24"
								alignItems={["center", "center", "center", "center"]}
							>
								{earnOpportunities.map((stakeInfo: IEarnInfo, index) => (
									<StakeCard
										key={index}
										stakeInfo={stakeInfo as IStakeV2Info}
									/>
								))}
								{stakeV1Opportunities.map((stakeInfo: IEarnInfo, index) => (
									<StakeCard
										v1
										key={index}
										stakeInfo={stakeInfo as IStakeInfo}
									/>
								))}
							</Flex>
						)}
				</Collapse>
			</Flex>
		</Flex>
	);
};
