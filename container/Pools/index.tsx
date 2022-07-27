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
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { AddLiquidityModal, RemoveLiquidity } from "components";
import { ImportPoolModal } from "components/Modals/ImportPool";
import { TokenImported } from "components/Modals/TokenImported";
import { TurnExportMode } from "components/Modals/TurnExportMode";
import { PoolCards } from "components/Pools/PoolCards";
import { usePicasso, useWallet } from "hooks";
import { NextPage } from "next";
import { useState } from "react";
import { MdExpandMore, MdOutlineCallMade, MdSearch } from "react-icons/md";

export const PoolsContainer: NextPage = () => {
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
	const {
		onOpen: onOpenPool,
		isOpen: isOpenPool,
		onClose: onClosePool,
	} = useDisclosure();
	const {
		onOpen: onOpenRemoveLiquidity,
		isOpen: isOpenRemoveLiquidity,
		onClose: onCloseRemoveLiquidity,
	} = useDisclosure();
	const {
		onOpen: onOpenTokenImported,
		isOpen: isOpenTokenImported,
		onClose: onCloseTokenImported,
	} = useDisclosure();
	const [isCreate, setIsCreate] = useState(false);
	const [haveValue, setHaveValue] = useState(false);
	const { isConnected } = useWallet();
	const [userHavePool, setUserHavePool] = useState(true);

	return (
		<Flex justifyContent="center" alignItems="center">
			<AddLiquidityModal
				isModalOpen={isOpen}
				onModalClose={onClose}
				isCreate={isCreate}
				haveValue={haveValue}
			/>
			<ImportPoolModal isModalOpen={isOpenPool} onModalClose={onClosePool} />
			<RemoveLiquidity
				isModalOpen={isOpenRemoveLiquidity}
				onModalClose={onCloseRemoveLiquidity}
				isCreate={isCreate}
				haveValue={haveValue}
			/>
			<Flex alignItems="flex-start" justifyContent="center" pt="20" mb="6.2rem">
				<Flex flexDirection="column" w="2xl">
					<Flex
						flexDirection="column"
						zIndex="docked"
						position="relative"
						borderRadius="xl"
						backgroundColor="blue.700"
					>
						<Img
							src="images/backgrounds/PsysAirdrop2.png"
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
								Liquidity Provider Rewards
							</Text>
							<Text
								color="white"
								fontWeight="semibold"
								fontSize="sm"
								lineHeight="shorter"
								w="60%"
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
						my="8"
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
							flexDirection="row"
							zIndex="docked"
							w="100%"
							mt="2"
							alignItems="flex-end"
						>
							<Flex visibility={userHavePool ? "visible" : "hidden"}>
								<InputGroup>
									<InputLeftElement
										pointerEvents="none"
										// eslint-disable-next-line react/no-children-prop
										children={<MdSearch color={theme.text.cyanPurple} />}
									/>
									<Input
										borderColor={theme.bg.blueNavyLightness}
										placeholder="Search by token name"
										_placeholder={{ opacity: 1, color: theme.text.cyanPurple }}
										borderRadius="full"
										w="20rem"
									/>
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
										onOpen();
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
												onOpen();
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
							mt="4rem"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							gap="16"
						>
							<Text w="max-content" fontSize="md" fontWeight="normal">
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
									onClick={onOpenRemoveLiquidity}
									color={theme.text.cyanWhite}
									textDecoration="underline"
									_hover={{ cursor: "pointer" }}
								>
									Import it.
								</Text>
							</Flex>
						</Flex>
					) : (
						<Flex flexWrap="wrap" gap="7" zIndex="1">
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
