import {
	Button,
	Flex,
	Img,
	Input,
	InputGroup,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from "@chakra-ui/react";
import { AddLiquidityModal, RemoveLiquidity } from "components";
import { PoolCards } from "components/Pools/PoolCards";
import { usePicasso, useWallet, useToasty, useModal } from "hooks";
import { NextPage } from "next";
import { useState } from "react";
import { MdExpandMore, MdOutlineCallMade, MdSearch } from "react-icons/md";

export const PoolsContainer: NextPage = () => {
	const theme = usePicasso();
	const {
		onOpenPool,
		isOpenRemoveLiquidity,
		onCloseRemoveLiquidity,
		onOpenAddLiquidity,
		isOpenAddLiquidity,
		onCloseAddLiquidity,
	} = useModal();

	const [isCreate, setIsCreate] = useState(false);
	const [haveValue] = useState(false);
	const { isConnected } = useWallet();
	const [userHavePool, setUserHavePool] = useState(true);

	return (
		<Flex justifyContent="center" alignItems="center">
			<AddLiquidityModal
				isModalOpen={isOpenAddLiquidity}
				onModalClose={onCloseAddLiquidity}
				isCreate={isCreate}
				haveValue={haveValue}
			/>
			<RemoveLiquidity
				isModalOpen={isOpenRemoveLiquidity}
				onModalClose={onCloseRemoveLiquidity}
				isCreate={isCreate}
				haveValue={haveValue}
			/>
			<Flex
				alignItems="flex-start"
				justifyContent="center"
				pt={["10", "10", "20", "20"]}
				mb="6.2rem"
			>
				<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
					<Flex
						flexDirection="column"
						zIndex="docked"
						position="relative"
						borderRadius="xl"
						backgroundColor="blue.700"
					>
						<Img
							borderRadius="xl"
							src="images/backgrounds/BannerPools.png"
							position="absolute"
							zIndex="base"
							w="100%"
							h="85%"
						/>
						<Flex
							zIndex="docked"
							flexDirection="column"
							px="1.625rem"
							py={["0.8rem", "1.375rem", "1.375rem", "1.375rem"]}
							gap="3"
							h={["9rem", "10rem", "10rem", "10rem"]}
						>
							<Text fontWeight="bold" color="white" fontSize="md">
								Liquidity Provider Rewards
							</Text>
							<Text
								color="white"
								fontWeight="semibold"
								fontSize="sm"
								lineHeight="shorter"
								w={["100%", "70%", "60%", "60%"]}
							>
								Liquidity providers earn a 0.25% fee on all trades proportional
								to their share of the pool. Fees are added to the pool, accrue
								in real time and can be claimed by withdrawing your liquidity.
							</Text>
						</Flex>
						<Flex
							alignItems="center"
							justifyContent="center"
							flexDirection="row"
							bgColor={theme.bg.whiteGray}
							zIndex="docked"
							borderBottomRadius="xl"
							py="0.531rem"
							gap="2.5"
						>
							<Text fontWeight="semibold" fontSize="xs" color="white">
								View Your Staked Liquidity
							</Text>
							<MdOutlineCallMade size={20} color="white" />
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
							mt="4"
							flexDirection="row"
							justifyContent="space-between"
							w="100%"
							zIndex="docked"
						>
							<Text
								fontSize="2xl"
								fontWeight="semibold"
								color={theme.text.mono}
							>
								Pools Overview
							</Text>
						</Flex>
						<Flex
							justifyContent="space-between"
							flexDirection={["column-reverse", "column-reverse", "row", "row"]}
							zIndex="docked"
							w="100%"
							mt={["0", "0", "2", "2"]}
							alignItems={["center", "center", "flex-end", "flex-end"]}
							gap="5"
						>
							<Flex visibility={userHavePool ? "visible" : "hidden"}>
								<InputGroup>
									<Input
										borderColor={theme.bg.blueNavyLightness}
										placeholder="Search by token name"
										_placeholder={{
											fontSize: "14px",
											opacity: 1,
											color: theme.text.cyanPurple,
										}}
										borderRadius="full"
										w={["18rem", "18rem", "20rem", "20rem"]}
										h="max-content"
										py={["0.1rem", "0.1rem", "1", "1"]}
										pl="6"
									/>
									<Flex
										position="absolute"
										left="0.5rem"
										bottom={["0.3rem", "0.3rem", "0.5rem", "0.5rem"]}
									>
										<MdSearch color={theme.text.cyanPurple} />
									</Flex>
								</InputGroup>
							</Flex>
							<Flex gap="4" alignItems="flex-end">
								<Button
									fontSize="sm"
									fontWeight="semibold"
									py="0.562rem"
									px="1.5rem"
									h="max-content"
									bgColor="transparent"
									borderWidth="1px"
									borderColor={theme.text.cyanPurple}
									color={theme.text.whitePurple}
									borderRadius="full"
									_hover={{ opacity: "1" }}
									_active={{}}
									onClick={() => {
										setIsCreate(true);
										onOpenAddLiquidity();
									}}
								>
									Create a Pair
								</Button>
								<Flex flexDirection="column">
									{!userHavePool ? (
										<Button
											fontSize="sm"
											fontWeight="semibold"
											py="0.625rem"
											px="1.5rem"
											h="max-content"
											bgColor={theme.bg.blueNavyLightness}
											color={theme.text.cyanWhite}
											_hover={{ opacity: "1" }}
											_active={{}}
											onClick={() => {
												setIsCreate(false);
												onOpenAddLiquidity();
											}}
											borderRadius="full"
										>
											Add Liquidity
										</Button>
									) : (
										<Menu>
											<Text fontSize="sm" pb="2">
												Sort by
											</Text>
											<MenuButton
												as={Button}
												fontSize="sm"
												fontWeight="semibold"
												py="0.625rem"
												px="1.5rem"
												h="max-content"
												bgColor={theme.bg.blueNavyLightness}
												color="white"
												_hover={{ opacity: "1" }}
												_active={{}}
												borderRadius="full"
												rightIcon={<MdExpandMore size={20} />}
											>
												Pool Weight
											</MenuButton>
											<MenuList
												bgColor={theme.bg.blueNavy}
												color="white"
												borderColor="transparent"
												p="4"
												fontSize="sm"
											>
												<MenuItem>Pool Weight</MenuItem>
												<MenuItem>Name</MenuItem>
												<MenuItem>Claudio</MenuItem>
												<MenuItem>Thom</MenuItem>
												<MenuItem>Kaue</MenuItem>
											</MenuList>
										</Menu>
									)}
								</Flex>
							</Flex>
						</Flex>
					</Flex>
					{!isConnected ? (
						<Flex
							w="100%"
							mt={["1rem", "1rem", "4rem", "4rem"]}
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							gap="16"
						>
							<Text fontSize={["sm", "sm", "md", "md"]} fontWeight="normal">
								Please connect your wallet in the button bellow to be able to
								view your liquidity.
							</Text>
							<Flex flexDirection="row" gap="1">
								<Text
									color="white"
									fontSize="md"
									fontWeight="normal"
									w="max-content"
								>
									Don&apos;t see a pool you joined?{" "}
								</Text>
								<Text
									fontWeight="semibold"
									color={theme.text.cyanWhite}
									onClick={onOpenPool}
									textDecoration="underline"
									_hover={{ cursor: "pointer" }}
								>
									Import it.
								</Text>
							</Flex>
						</Flex>
					) : (
						<Flex
							flexWrap="wrap"
							gap="7"
							zIndex="1"
							mt="10"
							justifyContent={["center", "center", "unset", "unset"]}
						>
							<PoolCards />
							<PoolCards />
							<PoolCards />
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
