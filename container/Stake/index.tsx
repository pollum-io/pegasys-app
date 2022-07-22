import { Button, Flex, Img, Text } from "@chakra-ui/react";
import { DefaultTemplate } from "container";
import { usePicasso } from "hooks";
import { NextPage } from "next";
import { MdOutlineCallMade } from "react-icons/md";

export const StakeContainer: NextPage = () => {
	const theme = usePicasso();

	return (
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
						src="images/backgrounds/BannerStake.png"
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
					>
						<Text fontWeight="bold" color="white" fontSize="md">
							Pegasys PSYS Staking
						</Text>
						<Text
							fontWeight="semibold"
							fontSize="sm"
							lineHeight="shorter"
							w="50%"
						>
							Deposit and stake your PSYS tokens to earn more tokens.
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
							ReaD more about PSYS
						</Text>
						<MdOutlineCallMade size={20} />
					</Flex>
				</Flex>
				<Flex
					alignItems="center"
					my="8"
					justifyContent="flex-start"
					w="100%"
					flexDirection="row"
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
							Current Opportunities
						</Text>
						<Flex gap="1">
							<Button
								color={theme.bg.blue900}
								bgColor={theme.bg.blue100}
								borderRadius="full"
								w="max-content"
								h="max-content"
								py="2"
								px="6"
								fontWeight="semibold"
							>
								PSYS
							</Button>
							<Button
								color={theme.text.gray600}
								bgColor="transparent"
								borderRadius="full"
								w="max-content"
								h="max-content"
								py="2"
								px="6"
								fontWeight="semibold"
							>
								PSYS
							</Button>
						</Flex>
					</Flex>
				</Flex>
				<Flex>
					<Flex
						zIndex="1"
						flexDirection="column"
						w="2xl"
						h="max-content"
						gap="8"
						borderRadius="2xl"
						border="1px solid transparent;"
						background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
					>
						<Flex
							id="header"
							bg="rgba(255, 255, 255, 0.04)"
							justifyContent="center"
							flexDirection="row"
							pt="3"
							pb="2"
							px="6"
							alignItems="center"
							borderBottomRadius="2xl"
							w="max-content"
							margin="0 auto"
							gap="2"
						>
							<Img src="icons/pegasys.png" w="6" h="6" />
							<Text>Earn PSYS</Text>
							<Button
								border="1px solid"
								borderColor={theme.text.cyan}
								borderRadius="full"
								w="max-content"
								h="max-content"
								bgColor="transparent"
								py="1"
								fontSize="xs"
								ml="1"
							>
								Claim
							</Button>
						</Flex>
						<Flex flexDirection="row" flexWrap="wrap" gap="4">
							<Flex flexDirection="column" mr="40" ml="7">
								<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
									APR
								</Text>
								<Text fontWeight="medium" fontSize="md">
									191%
								</Text>
							</Flex>
							<Flex flexDirection="column" mr="24">
								<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
									Total staked (PSYS)
								</Text>
								<Text fontWeight="medium" fontSize="md">
									3,142,00
								</Text>
							</Flex>
							<Flex flexDirection="column">
								<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
									Your rate (PSYS/Week)
								</Text>
								<Text fontWeight="medium" fontSize="md">
									0.0003659
								</Text>
							</Flex>
							<Flex flexDirection="column" ml="7" mr="7.4rem">
								<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
									Deposit Fee
								</Text>
								<Text fontWeight="medium" fontSize="md">
									1%
								</Text>
							</Flex>
							<Flex flexDirection="column" mr="6.7rem">
								<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
									Your Staked PSYS
								</Text>
								<Text fontWeight="medium" fontSize="md">
									0,3
								</Text>
							</Flex>
							<Flex flexDirection="column">
								<Text fontWeight="medium" fontSize="sm" color={theme.text.cyan}>
									Your unclaimed PSYS
								</Text>
								<Text fontWeight="medium" fontSize="md">
									0,1
								</Text>
							</Flex>
						</Flex>
						<Flex justifyContent="center" gap="6" mb="6">
							<Button
								width="11.5rem"
								height="2rem"
								bgColor="transparent"
								border="1px solid"
								borderColor={theme.text.cyan}
								borderRadius="full"
								py="2"
								px="0.75rem"
								fontSize="sm"
								fontWeight="semibold"
							>
								Unstake
							</Button>
							<Button
								width="11.5rem"
								height="2rem"
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								borderRadius="full"
								py="2"
								px="0.75rem"
								fontSize="sm"
								fontWeight="semibold"
							>
								Stake
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
