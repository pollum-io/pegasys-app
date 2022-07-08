import { Button, Flex, Img, Link, Text, useDisclosure } from "@chakra-ui/react";
import { AddLiquidityModal, RemoveLiquidity } from "components";
import { ImportPoolModal } from "components/Modals/ImportPool";
import { DefaultTemplate } from "container";
import { usePicasso, useWallet } from "hooks";
import { NextPage } from "next";
import { useState } from "react";
import { MdOutlineCallMade } from "react-icons/md";

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
	const [isCreate, setIsCreate] = useState(false);
	const [haveValue, setHaveValue] = useState(false);
	const { isConnected } = useWallet();

	return (
		<DefaultTemplate>
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

			<Flex
				w="100%"
				h="100%"
				alignItems="flex-start"
				justifyContent="center"
				pt="20"
			>
				<Flex flexDirection="column" w="2xl">
					<Flex
						flexDirection="column"
						zIndex="docked"
						position="relative"
						borderRadius="xl"
						backgroundColor="blue.700"
					>
						<Img
							borderRadius="xl"
							src="images/backgrounds/1.png"
							position="absolute"
							zIndex="base"
							w="100%"
							h="100%"
							objectFit="none"
							opacity="0.4"
							objectPosition="25% 20%"
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
							<Text fontWeight="semibold" fontSize="xs">
								View Your Staked Liquidity
							</Text>
							<MdOutlineCallMade size={20} />
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
							<Text fontSize="2xl" fontWeight="semibold">
								Pools Overview
							</Text>
							<Flex gap="4">
								<Button
									fontSize="sm"
									fontWeight="semibold"
									py="0.625rem"
									px="1.5rem"
									h="max-content"
									bgColor={theme.bg.blueNavyLightness}
									color={theme.text.cyan}
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
								<Button
									fontSize="sm"
									fontWeight="semibold"
									py="0.562rem"
									px="1.5rem"
									h="max-content"
									bgColor="transparent"
									borderWidth="1px"
									borderColor={theme.text.cyan}
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
							</Flex>
						</Flex>
					</Flex>
					{isConnected && (
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
									color={theme.text.mono}
									fontSize="md"
									fontWeight="normal"
									w="max-content"
								>
									Don&apos;t see a pool you joined?{" "}
								</Text>
								<Text
									fontWeight="semibold"
									onClick={onOpenRemoveLiquidity}
									color={theme.text.cyan}
									textDecoration="underline"
									_hover={{ cursor: "pointer" }}
								>
									Import it.
								</Text>
							</Flex>
						</Flex>
					)}
					<Flex flexWrap="wrap" gap="7" zIndex="1">
						<Flex
							flexDirection="column"
							bgColor={theme.bg.blueNavy}
							p="6"
							w="xs"
							borderRadius="xl"
							border="1px solid transparent;"
							background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
						>
							<Flex gap="2">
								<Flex>
									<Img src="icons/syscoin-logo.png" w="6" h="6" />
									<Img src="icons/pegasys.png" w="6" h="6" />
								</Flex>
								<Text fontSize="lg" fontWeight="bold">
									USDT/SYS
								</Text>
							</Flex>
							<Flex flexDirection="column" pt="6">
								<Flex justifyContent="space-between" pb="3" fontSize="sm">
									<Text fontWeight="semibold">Liquidity</Text>
									<Text>$253,345.09</Text>
								</Flex>
								<Flex justifyContent="space-between" pb="3" fontSize="sm">
									<Text fontWeight="semibold">Volume</Text>
									<Text>$253,345.09</Text>
								</Flex>
								<Flex justifyContent="space-between" pb="3" fontSize="sm">
									<Text fontWeight="semibold">APR</Text>
									<Text>33.48%</Text>
								</Flex>
								<Flex justifyContent="space-between" pb="3" fontSize="sm">
									<Text fontWeight="semibold">Your pool share</Text>
									<Text>-</Text>
								</Flex>
							</Flex>
							<Button
								w="100%"
								mt="1.5rem"
								py="2"
								px="6"
								borderRadius="67px"
								bgColor={theme.bg.button.connectWalletSwap}
								color={theme.text.cyan}
								fontSize="sm"
								fontWeight="semibold"
							>
								Add Liquidity
							</Button>
						</Flex>
						<Flex
							flexDirection="column"
							bgColor={theme.bg.blueNavy}
							p="6"
							w="xs"
							borderRadius="xl"
							border="1px solid transparent;"
							background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
						>
							<Flex gap="2">
								<Flex>
									<Img src="icons/syscoin-logo.png" w="6" h="6" />
									<Img src="icons/pegasys.png" w="6" h="6" />
								</Flex>
								<Text fontSize="lg" fontWeight="bold">
									USDT/SYS
								</Text>
							</Flex>
							<Flex flexDirection="column" pt="6">
								<Flex justifyContent="space-between" pb="3" fontSize="sm">
									<Text fontWeight="semibold">Liquidity</Text>
									<Text>$253,345.09</Text>
								</Flex>
								<Flex justifyContent="space-between" pb="3" fontSize="sm">
									<Text fontWeight="semibold">Volume</Text>
									<Text>$253,345.09</Text>
								</Flex>
								<Flex justifyContent="space-between" pb="3" fontSize="sm">
									<Text fontWeight="semibold">APR</Text>
									<Text>33.48%</Text>
								</Flex>
								<Flex justifyContent="space-between" pb="3" fontSize="sm">
									<Text fontWeight="semibold">Your pool share</Text>
									<Text>-</Text>
								</Flex>
							</Flex>
							<Button
								w="100%"
								mt="1.5rem"
								py="2"
								px="6"
								borderRadius="67px"
								bgColor={theme.bg.button.connectWalletSwap}
								color={theme.text.cyan}
								fontSize="sm"
								fontWeight="semibold"
							>
								Add Liquidity
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</DefaultTemplate>
	);
};
