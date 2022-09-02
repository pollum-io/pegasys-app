import { Button, Flex, Img, Text, useMediaQuery } from "@chakra-ui/react";
import { StakeCards } from "components/Stake/StakeCard";
import { usePicasso } from "hooks";
import { NextPage } from "next";
import { useState } from "react";
import { MdOutlineCallMade } from "react-icons/md";

export const StakeContainer: NextPage = () => {
	const theme = usePicasso();
	const [buttonId, setButtonId] = useState<string>("");
	const [isMobile] = useMediaQuery("(max-width: 480px)");

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
					backgroundColor={theme.bg.whiteGray}
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
							Pegasys PSYS Staking
						</Text>
						<Text
							fontWeight="medium"
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
						zIndex="0"
						position="relative"
						top="2"
						borderBottomRadius="xl"
						py="0.531rem"
						gap="2.5"
						color="white"
					>
						<Text fontWeight="medium" fontSize="xs">
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
								onClick={() => setButtonId("psys")}
								color={
									buttonId === "psys"
										? theme.text.farmActionsHover
										: theme.border.borderSettings
								}
								bgColor={
									buttonId === "psys"
										? theme.bg.farmActionsHover
										: "transparent"
								}
								borderRadius="full"
								w="5.688rem"
								h="max-content"
								py="2"
								px="6"
								fontWeight="semibold"
								_hover={{
									bgColor: theme.bg.farmActionsHover,
									color: theme.text.farmActionsHover,
								}}
							>
								PSYS
							</Button>
							<Button
								onClick={() => setButtonId("usd")}
								color={
									buttonId === "usd"
										? theme.text.farmActionsHover
										: theme.border.borderSettings
								}
								bgColor={
									buttonId === "usd" ? theme.bg.farmActionsHover : "transparent"
								}
								borderRadius="full"
								w="5.688rem"
								h="max-content"
								py="2"
								px="6"
								fontWeight="semibold"
								_hover={{
									bgColor: theme.bg.farmActionsHover,
									color: theme.text.farmActionsHover,
								}}
							>
								USD
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
				</Flex>
			</Flex>
		</Flex>
	);
};
