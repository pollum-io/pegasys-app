import {
	Button,
	Flex,
	Img,
	Text,
	Input,
	InputGroup,
	InputLeftElement,
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
		<Flex h="100%" alignItems="flex-start" justifyContent="center" pt="20">
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
						color="white"
					>
						<Text fontWeight="bold" color="white" fontSize="md">
							Pegasys Liquidity Mining
						</Text>
						<Text
							fontWeight="semibold"
							fontSize="sm"
							lineHeight="shorter"
							w="50%"
						>
							Deposit your Pegasys Liquidity Provider PLP tokens to receive
							PSYS, the Pegasys protocol governance token.
						</Text>
					</Flex>
					<Flex
						alignItems="center"
						justifyContent="center"
						flexDirection="row"
						bgColor={theme.text.topHeaderButton}
						zIndex="docked"
						borderBottomRadius="xl"
						py="0.531rem"
						gap="2.5"
						color="white"
					>
						<Text fontWeight="semibold" fontSize="xs">
							View Your Staked Liquidity
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
							Farms
						</Text>
					</Flex>
					<Flex flexDirection="row" alignItems="flex-end" gap="4">
						<InputGroup>
							<InputLeftElement
								pointerEvents="none"
								// eslint-disable-next-line react/no-children-prop
								children={<MdSearch size={20} color={theme.icon.searchIcon} />}
							/>
							<Input
								placeholder="Search by token name"
								_placeholder={{ opacity: 1, color: theme.text.input }}
								borderColor={theme.bg.blueNavyLightness}
								borderRadius="full"
								w="15rem"
								_hover={{
									borderColor: theme.bg.blueNavyLightness,
								}}
								_focus={{
									borderColor: theme.bg.blueNavyLightness,
								}}
							/>
						</InputGroup>
						<Flex
							flexDirection="column"
							alignItems="flex-start"
							justifyContent="flex-start"
						>
							<Menu>
								<Text fontSize="sm" pb="2" color={theme.text.mono}>
									Sort by
								</Text>
								<MenuButton
									as={Button}
									fontSize="sm"
									fontWeight="semibold"
									alignItems="center"
									justifyContent="justify-content"
									py="2"
									pl="5"
									pr="5"
									w="max-content"
									h="max-content"
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
										<Icon as={MdExpandMore} w="5" h="5" ml="10" />
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
					mr="1"
					ml="1"
					mb="10rem"
					sx={{ columnCount: [1, 2], columnGap: "18px" }}
				>
					<FarmCards />
				</Box>
			</Flex>
		</Flex>
	);
};
