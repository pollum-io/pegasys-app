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
	Box,
	useMediaQuery,
	useColorMode,
	Link,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { MdOutlineCallMade, MdExpandMore } from "react-icons/md";

import { FarmCard, LoadingTransition, SearchInput } from "components";
import { usePicasso, useModal } from "hooks";

import {
	IFarmInfo,
	useFarm,
	useWallet as psUseWallet,
	useEarn,
} from "pegasys-services";
import { FarmActions } from "components/Modals/FarmActions";

const sortData = {
	yours: "Your farms",
	apr: "APR",
	liquidity: "Liquidity",
};

export const FarmContainer: NextPage = () => {
	const { setSearch, sort, setSort, sortedPairs } = useFarm();
	const { loading, signatureLoading } = useEarn();
	const { isConnected, address } = psUseWallet();
	const theme = usePicasso();
	const { colorMode } = useColorMode();
	const { isOpenFarmActions, onCloseFarmActions } = useModal();
	const [isMobile] = useMediaQuery("(max-width: 480px)");

	return (
		<Flex w="100%" h="100%" alignItems="flex-start" justifyContent="center">
			<LoadingTransition isOpen={loading || signatureLoading} />
			<FarmActions isOpen={isOpenFarmActions} onClose={onCloseFarmActions} />
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
						src={isMobile ? theme.bg.farmBannerMobile : theme.bg.farmBanner}
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
						h={["9rem", "10rem", "10rem", "10rem"]}
						color="white"
					>
						<Text fontWeight="bold" fontSize="md">
							Pegasys Liquidity Mining
						</Text>
						<Text
							fontWeight="medium"
							fontSize="sm"
							lineHeight="shorter"
							w={["100%", "70%", "50%", "50%"]}
						>
							Deposit your Pegasys Liquidity Provider PLP tokens to receive
							PSYS, the Pegasys protocol governance token.
						</Text>
					</Flex>
					<Flex
						zIndex="0"
						position="relative"
						top="2"
						alignItems="center"
						justifyContent="center"
						flexDirection="row"
						bgColor={theme.bg.alphaPurple}
						borderBottomRadius="xl"
						py="0.531rem"
						color="white"
					>
						<Link
							href="info.pegasys.finance/account/wallet"
							target="_blank"
							rel="noreferrer"
							_hover={{ cursor: "pointer", opacity: "0.9" }}
							flexDirection="row"
						>
							<Flex gap="2.5">
								<Text fontWeight="medium" fontSize="xs">
									View Your Staked Liquidity
								</Text>

								<MdOutlineCallMade size={20} />
							</Flex>
						</Link>
					</Flex>
				</Flex>
				<Flex
					id="a"
					alignItems={["flex-start", "flex-start", "baseline", "baseline"]}
					my="8"
					justifyContent="flex-start"
					w="100%"
					flexDirection={["initial", "initial", "row", "row"]}
					zIndex="docked"
				>
					<Flex
						id="b"
						mt={["0", "0", "2", "2"]}
						alignItems={["flex-start", "center", "flex-end", "flex-end"]}
						justifyContent="space-between"
						w="100%"
						zIndex="docked"
						flexDirection={["column-reverse", "unset"]}
					>
						<Text fontSize="2xl" fontWeight="semibold">
							Farms
						</Text>
					</Flex>
					{address && (
						<Flex
							flexDirection={["column-reverse", "column-reverse", "row", "row"]}
							alignItems="flex-end"
							gap="4"
							id="c"
							w="max-content"
							position={["absolute", "absolute", "relative", "relative"]}
						>
							<SearchInput
								setSearch={setSearch}
								iconColor={theme.icon.inputSearchIcon}
								borderColor={theme.bg.blueNavyLightness}
								placeholder={{
									value: "Search by token name",
									color: theme.text.inputBluePurple,
								}}
							/>
							<Flex
								id="d"
								flexDirection={["initial", "initial", "column", "column"]}
								alignItems={[
									"baseline",
									"baseline",
									"flex-start",
									"flex-start",
								]}
								justifyContent="flex-start"
							>
								<Menu>
									<Text fontSize="sm" pb="2" pr={["2", "2", "0", "0"]}>
										Sort by
									</Text>
									<MenuButton
										as={Button}
										fontSize="sm"
										fontWeight="semibold"
										alignItems="center"
										justifyContent="justify-content"
										py={["0.2rem", "0.2rem", "1", "1"]}
										pl="4"
										pr="4"
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
										<Flex alignItems="center" color="white" gap="3rem">
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
									>
										{Object.keys(sortData).map((key, i) => (
											<MenuItem
												onClick={() => setSort(key as keyof typeof sortData)}
												key={i}
											>
												{sortData[key as keyof typeof sortData]}
											</MenuItem>
										))}
									</MenuList>
								</Menu>
							</Flex>
						</Flex>
					)}
				</Flex>
				{!isConnected && (
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
							Please connect your wallet in the button bellow to be able to view
							your farms.
						</Text>
					</Flex>
				)}
				{sortedPairs.length === 0 && isConnected && (
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
				<Box
					w="100%"
					maxW="900px"
					zIndex="1"
					justifyContent="space-between"
					mt={["10", "10", "0", "0"]}
					mb="10rem"
					sx={{ columnCount: [1, 1, 2, 2], columnGap: "35px" }}
				>
					{sortedPairs.map((pair, index) => (
						<FarmCard key={index} stakeInfo={pair as IFarmInfo} />
					))}
				</Box>
			</Flex>
		</Flex>
	);
};
