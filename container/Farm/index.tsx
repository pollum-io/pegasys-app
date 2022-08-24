import {
	Button,
	Flex,
	Img,
	Text,
	Input,
	InputGroup,
	Menu,
	MenuItem,
	MenuList,
	MenuButton,
	Icon,
	Box,
} from "@chakra-ui/react";
import { FarmCards } from "components/Farm/FarmCards";
import { usePicasso } from "hooks";
import { NextPage } from "next";
import { MdOutlineCallMade, MdSearch, MdExpandMore } from "react-icons/md";

export const FarmContainer: NextPage = () => {
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
					backgroundColor={theme.bg.whiteGray}
				>
					<Img
						borderRadius="xl"
						src={theme.bg.farmBanner}
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
						bgColor={theme.text.topHeaderButton}
						borderBottomRadius="xl"
						py="0.531rem"
						gap="2.5"
						color="white"
					>
						<Text fontWeight="medium" fontSize="xs">
							View Your Staked Liquidity
						</Text>
						<MdOutlineCallMade size={20} />
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
					<Flex
						flexDirection={["column-reverse", "column-reverse", "row", "row"]}
						alignItems="flex-end"
						gap="4"
						id="c"
						w="max-content"
						position={["absolute", "absolute", "relative", "relative"]}
					>
						<InputGroup right="0rem">
							<Input
								placeholder="Search by token name"
								_placeholder={{ opacity: 1, color: theme.text.input }}
								borderColor={theme.bg.blueNavyLightness}
								borderRadius="full"
								w={["20rem", "28rem", "20rem", "20rem"]}
								h="2.2rem"
								py={["0.1rem", "0.1rem", "1", "1"]}
								pl="10"
								_focus={{ outline: "none" }}
							/>
							<Flex
								pt="1rem"
								position="absolute"
								pl="0.9rem"
								bottom={["0.3rem", "0.3rem", "0.5rem", "0.5rem"]}
							>
								<MdSearch color={theme.icon.searchIcon} size={20} />
							</Flex>
						</InputGroup>
						<Flex
							id="d"
							flexDirection={["initial", "initial", "column", "column"]}
							alignItems={["baseline", "baseline", "flex-start", "flex-start"]}
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
									py="1.5"
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
									<Flex alignItems="center" color="white">
										APR
										<Icon as={MdExpandMore} w="5" h="5" ml="8" />
									</Flex>
								</MenuButton>
								<MenuList
									bgColor={theme.bg.blueNavy}
									color={theme.text.mono}
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
						</Flex>
					</Flex>
				</Flex>
				<Box
					w="100%"
					maxW="900px"
					zIndex="1"
					justifyContent="space-between"
					mt={["10", "10", "0", "0"]}
					mb="10rem"
					sx={{ columnCount: [1, 1, 2, 2], columnGap: "35px" }}
				>
					<FarmCards />
				</Box>
			</Flex>
		</Flex>
	);
};
