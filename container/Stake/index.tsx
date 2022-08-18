import { Button, Flex, Img, Text } from "@chakra-ui/react";
import { StakeCards } from "components/Stake/StakeCard";
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
			pt={["10", "10", "20", "20"]}
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
						h={["7.5rem", "8rem", "10rem", "10rem"]}
					>
						<Text fontWeight="bold" color="white" fontSize="md">
							Pegasys PSYS Staking
						</Text>
						<Text
							fontWeight="semibold"
							fontSize="sm"
							lineHeight="shorter"
							w={["70%", "50%", "50%", "50%"]}
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
							Read more about PSYS
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
						mt={["4"]}
						flexDirection={["column", "column", "row", "row"]}
						justifyContent="space-between"
						w="100%"
						zIndex="docked"
					>
						<Text fontSize="2xl" fontWeight="semibold">
							Current Opportunities
						</Text>
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
								USDT
							</Button>
						</Flex>
					</Flex>
				</Flex>
				<Flex
					flexDirection="column"
					gap="8"
					mb="24"
					alignItems={["center", "center", "center", "center"]}
				>
					<StakeCards />
					<StakeCards />
				</Flex>
			</Flex>
		</Flex>
	);
};
