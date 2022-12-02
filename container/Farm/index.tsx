import {
	Button,
	Flex,
	Img,
	Text,
	Menu,
	MenuItem,
	MenuList,
	MenuButton,
	Icon,
	useMediaQuery,
	useColorMode,
	Link,
	SlideFade,
	Collapse,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { MdOutlineCallMade, MdExpandMore } from "react-icons/md";
import { LoadingTransition, SearchInput, FarmGrid } from "components";
import { usePicasso, useModal } from "hooks";
import { useTranslation } from "react-i18next";

import {
	useFarm,
	useWallet as psUseWallet,
	useEarn,
	RoutesFramework,
} from "pegasys-services";
import { FarmActions } from "components/Modals/FarmActions";

export const FarmContainer: NextPage = () => {
	const { setSearch, sort, setSort } = useFarm();
	const { loading, signatureLoading, dataLoading } = useEarn();
	const { isConnected, address, chainId } = psUseWallet();
	const theme = usePicasso();
	const { colorMode } = useColorMode();
	const { isOpenFarmActions, onCloseFarmActions } = useModal();
	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const { t: translation } = useTranslation();

	const sortData = {
		yours: translation("earnPages.yourFarms"),
		apr: "APR",
		liquidity: translation("earnPages.liquidity"),
	};

	return (
		<Flex w="100%" h="100%" alignItems="flex-start" justifyContent="center">
			<LoadingTransition isOpen={loading || signatureLoading} />
			<FarmActions isOpen={isOpenFarmActions} onClose={onCloseFarmActions} />
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
							src={isMobile ? theme.bg.farmBannerMobile : theme.bg.farmBanner}
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
							h={["9rem", "10rem", "10rem", "10rem"]}
							color="white"
						>
							<Text fontWeight="bold" fontSize="md">
								{translation("earnPages.farmingTitle")}
							</Text>
							<Text
								fontWeight="medium"
								fontSize="sm"
								lineHeight="shorter"
								w={["100%", "65%", "50%", "50%"]}
							>
								{translation("earnPages.farmingDescription")}
							</Text>
						</Flex>
						<Flex
							zIndex="0"
							position="relative"
							top={["1.5", "1", "1", "1"]}
							alignItems="center"
							justifyContent="center"
							flexDirection="row"
							bgColor={theme.bg.alphaPurple}
							borderBottomRadius="xl"
							py="0.531rem"
							pt="0.2rem"
							color="white"
						>
							<Link
								href={`https://info.pegasys.finance/account/${address}`}
								target="_blank"
								rel="noreferrer"
								_hover={{ cursor: "pointer" }}
								flexDirection="row"
							>
								<Flex gap="2.5" alignItems="center">
									<Text fontWeight="medium" fontSize="xs">
										{translation("earnPage.readMoreAboutPsys")}
									</Text>

									<MdOutlineCallMade size={18} />
								</Flex>
							</Link>
						</Flex>
					</Flex>
				</SlideFade>
				<Flex
					id="a"
					alignItems={["flex-start", "flex-start", "baseline", "baseline"]}
					my="8"
					justifyContent="space-between"
					w="100%"
					flexDirection={["column", "column", "row", "row"]}
					zIndex="docked"
				>
					<SlideFade in={Boolean(isMobile || !isMobile)} offsetY="-50px">
						<Flex
							id="b"
							mt={["0", "0", "2", "2"]}
							alignItems={["flex-start", "center", "flex-end", "flex-end"]}
							justifyContent="space-between"
							w="100%"
							zIndex="docked"
							flexDirection={["column-reverse", "unset"]}
						>
							<Text
								fontSize={["1.25rem", "1.25rem", "2xl", "2xl"]}
								fontWeight="semibold"
							>
								{translation("earnPages.farms")}
							</Text>
						</Flex>
					</SlideFade>
					<Collapse in={Boolean(!dataLoading && address)}>
						{address && !dataLoading && (
							<Flex
								flexDirection={[
									"column-reverse",
									"column-reverse",
									"row",
									"row",
								]}
								alignItems="flex-end"
								gap="4"
								id="c"
								w="max-content"
								mt={["7", "7", "0", "0"]}
							>
								<SearchInput
									setSearch={setSearch}
									iconColor={theme.icon.inputSearchIcon}
									borderColor={theme.bg.blueNavyLightness}
									placeholder={{
										value: translation("currencyInputPanel.searchBy"),
										color: theme.text.inputBluePurple,
									}}
								/>
								<Flex
									id="d"
									flexDirection="column"
									alignItems={[
										"baseline",
										"baseline",
										"flex-start",
										"flex-start",
									]}
									justifyContent="flex-start"
									w="100%"
									mb={["0.8rem", "0.8rem", "0", "0"]}
								>
									<Menu>
										<Text fontSize="sm" pb="2" pr={["2", "2", "0", "0"]}>
											{translation("earnPages.sortBy")}
										</Text>
										<MenuButton
											as={Button}
											fontSize="sm"
											fontWeight="semibold"
											alignItems="center"
											justifyContent="justify-content"
											py={["0.2rem", "0.2rem", "1", "1"]}
											pl="4"
											pr="3"
											w="max-content"
											h="2.2rem"
											bgColor={theme.bg.blueNavyLightness}
											color={theme.text.mono}
											_hover={{
												opacity: "1",
												bgColor: theme.bg.bluePurple,
											}}
											_active={{}}
											borderRadius="full"
										>
											<Flex alignItems="center" color="white" gap="2rem">
												{sortData[sort]}
												<Icon as={MdExpandMore} w="5" h="5" />
											</Flex>
										</MenuButton>
										<MenuList
											bgColor={theme.bg.blueNavy}
											color={theme.text.mono}
											borderColor="transparent"
											p="4"
											fontSize="sm"
											zIndex="9999"
										>
											{Object.keys(sortData).map((key, i) => (
												<MenuItem
													onClick={() => setSort(key as keyof typeof sortData)}
													key={i}
													borderRadius="md"
													_active={{}}
													bgColor={
														key === sort
															? theme.bg.menuLinksGray
															: "transparent !important"
													}
												>
													{sortData[key as keyof typeof sortData]}
												</MenuItem>
											))}
										</MenuList>
									</Menu>
								</Flex>
							</Flex>
						)}
					</Collapse>
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
						(!chainId || !RoutesFramework.getMinichefAddress(chainId))
					}
				>
					{!dataLoading &&
						isConnected &&
						(!chainId || !RoutesFramework.getMinichefAddress(chainId)) && (
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
					in={
						!dataLoading &&
						isConnected &&
						!(!chainId || !RoutesFramework.getMinichefAddress(chainId))
					}
				>
					{!dataLoading &&
						isConnected &&
						!(!chainId || !RoutesFramework.getMinichefAddress(chainId)) && (
							<FarmGrid />
						)}
				</Collapse>
			</Flex>
		</Flex>
	);
};
