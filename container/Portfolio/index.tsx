import { NextPage } from "next";
import { usePicasso } from "hooks";
import {
	Button,
	Flex,
	HStack,
	Icon,
	Image,
	Img,
	Input,
	InputGroup,
	Table,
	TableCaption,
	TableContainer,
	Tbody,
	Td,
	Text,
	Tfoot,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";

export const PortfolioContainer: NextPage = () => {
	const theme = usePicasso();

	return (
		<Flex
			flexDirection="column"
			zIndex="docked"
			justifyContent="center"
			w="100%"
		>
			<Flex
				flexDirection="row"
				bgColor="blue"
				mx="156px"
				justifyContent="flex-end"
				display={["none", "none", "flex", "flex"]}
				alignItems="center"
			>
				<Flex w="max-content" gap="4" mt="10" left="65rem" bgColor="red">
					<Text _hover={{ color: "white", cursor: "pointer" }} fontSize="18px">
						Wallet
					</Text>
					<Text _hover={{ color: "white", cursor: "pointer" }} fontSize="18px">
						Liquidity
					</Text>
					<Text _hover={{ color: "white", cursor: "pointer" }} fontSize="18px">
						Transactions
					</Text>
				</Flex>
			</Flex>
			<Flex
				w="max-content"
				mt="16"
				flexDirection="row"
				justifyContent="flex-start"
				zIndex="1"
				bgColor={theme.bg.blueNavy}
				border="1px solid transparent"
				borderRightRadius="xl"
				boxShadow=" 0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4);"
				background={`linear-gradient(${theme.bg.whiteGray}, ${theme.bg.whiteGray}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<Flex position="relative" align="center" gap="14" py="7">
					<Flex pl="44">
						<Text fontWeight="semibold" fontSize="2xl">
							Wallet Stats
						</Text>
					</Flex>
					<Flex flexDirection="column">
						<Text fontWeight="semibold" fontSize="2xl">
							$1.21
						</Text>
						<Text fontSize="sm">Total Value Swapped</Text>
					</Flex>
					<Flex flexDirection="column">
						<Text fontWeight="semibold" fontSize="2xl">
							$0.0036
						</Text>
						<Text fontSize="sm">Total Fees Paid</Text>
					</Flex>
					<Flex flexDirection="column" pr="14">
						<Text fontWeight="semibold" fontSize="2xl">
							12
						</Text>
						<Text fontSize="sm">Total Transactions</Text>
					</Flex>
				</Flex>
			</Flex>
			<Flex mb="6" mt="12" ml="11rem">
				<Text>Wallet Balance</Text>
			</Flex>
			<TableContainer mx="9.8rem">
				<Table
					variant="unstyled"
					maxWidth="100%"
					style={{ borderCollapse: "separate", borderSpacing: "0 10px" }}
				>
					<Thead>
						<Tr>
							<Th color={theme.text.mono} pl="5">
								Asset
							</Th>
							<Th color={theme.text.mono}>Price</Th>
							<Th color={theme.text.mono}>Balance</Th>
							<Th color={theme.text.mono}>Value</Th>
						</Tr>
					</Thead>
					<Tbody bgColor={theme.bg.blueNavy}>
						<Tr>
							<Td
								borderLeftRadius="0.75rem"
								fontSize="sm"
								fontWeight="bold"
								pl="4"
							>
								<Flex flexDirection="row" alignItems="center" gap="2">
									<Image src="icons/syscoin-logo.png" w="8" h="8" alt="Asset" />
									<Text>SYS</Text>
								</Flex>
							</Td>
							<Td fontSize="sm">$1,043.27</Td>
							<Td fontSize="sm">0.0000554448</Td>
							<Td fontSize="sm" borderRightRadius="0.75rem">
								$0.06
							</Td>
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>
			<Flex
				w="max-content"
				h="20%"
				mt="52"
				flexDirection="row"
				justifyContent="flex-start"
				zIndex="1"
				bgColor={theme.bg.blueNavy}
				border="1px solid transparent"
				borderRightRadius="xl"
				boxShadow=" 0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4);"
				background={`linear-gradient(${theme.bg.whiteGray}, ${theme.bg.whiteGray}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<Flex position="relative" align="center" gap="14" py="5" h="100%">
					<Flex pl="44">
						<Text fontWeight="semibold" fontSize="2xl" w="60%">
							Liquidity Positions
						</Text>
					</Flex>
					<Flex flexDirection="column">
						<Text fontWeight="semibold" fontSize="2xl">
							$0.03
						</Text>
						<Text fontSize="sm">Liquidity (Incluiding fees)</Text>
					</Flex>
					<Flex flexDirection="column" pr="16">
						<Text fontWeight="semibold" fontSize="2xl">
							$0.0036
						</Text>
						<Text fontSize="sm">Fees Earned (Cumulative)</Text>
					</Flex>
				</Flex>
			</Flex>
			<TableContainer mx="9.8rem" mt="10" mb="10rem">
				<Table
					variant="unstyled"
					maxWidth="100%"
					style={{ borderCollapse: "separate", borderSpacing: "0 10px" }}
				>
					<Thead>
						<Tr>
							<Th color={theme.text.mono} pl="5">
								Asset
							</Th>
							<Th color={theme.text.mono}>Pooled Tokens</Th>
							<Th color={theme.text.mono}>Value</Th>
							<Th color={theme.text.mono}>APR</Th>
							<Th color={theme.text.mono}>Pool Share</Th>
						</Tr>
					</Thead>
					<Tbody bgColor={theme.bg.blueNavy}>
						<Tr>
							<Td
								borderLeftRadius="0.75rem"
								fontSize="sm"
								fontWeight="bold"
								pl="4"
							>
								<Flex flexDirection="row" alignItems="center" gap="1">
									<Flex>
										<Image
											src="icons/syscoin-logo.png"
											w="8"
											h="8"
											alt="Asset"
										/>
										<Image
											src="icons/pegasys.png"
											w="8"
											h="8"
											alt="Asset"
											right="2"
											position="relative"
										/>
									</Flex>
									<Text>SYS/PSYS</Text>
								</Flex>
							</Td>
							<Td fontSize="sm">
								<Flex flexDirection="column" gap="1">
									<Text>$SYS: 0.03256</Text>
									<Text>$PSYS: 0.03256</Text>
								</Flex>
							</Td>
							<Td fontSize="sm">$0.14</Td>
							<Td fontSize="sm">1%</Td>
							<Td fontSize="sm" whiteSpace="normal" w="10%">
								0.01%
							</Td>
							<Td fontSize="sm" borderRightRadius="0.75rem" pl="0">
								<Flex gap="2" flexDirection="column" alignItems="center">
									<Button
										w="50%"
										h="max-content"
										py="1"
										px="5"
										border="1px solid"
										borderColor={theme.text.cyanPurple}
										borderRadius="67px"
										bgColor="transparent"
										color={theme.text.whitePurple}
										fontSize="xs"
										fontWeight="semibold"
									>
										Remove
									</Button>
									<Button
										w="50%"
										h="max-content"
										py="1"
										px="5"
										borderRadius="67px"
										bgColor={theme.bg.button.connectWalletSwap}
										color={theme.text.cyan}
										fontSize="xs"
										fontWeight="semibold"
									>
										Add
									</Button>
								</Flex>
							</Td>
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>
			<Flex bgColor={theme.bg.blueGray} flexDirection="column">
				<Flex mb="6" mt="12" ml="11rem">
					<Text fontSize="2xl" fontWeight="semibold">
						Transactions
					</Text>
				</Flex>
				<Flex ml="11rem" gap="30rem">
					<Flex gap="1" alignItems="center">
						<Text
							bgColor={theme.bg.blueNavyLightness}
							px="6"
							py="2"
							borderRadius="full"
							fontWeight="semibold"
							color={theme.text.mono}
						>
							All
						</Text>
						<Text
							color={theme.text.gray600}
							px="6"
							py="2"
							fontWeight="semibold"
						>
							Swaps
						</Text>
						<Text
							color={theme.text.gray600}
							px="6"
							py="2"
							fontWeight="semibold"
						>
							Adds
						</Text>
						<Text
							color={theme.text.gray600}
							px="6"
							py="2"
							fontWeight="semibold"
						>
							Removes
						</Text>
					</Flex>
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
							py={["0.1rem", "0.1rem", "0.1rem", "0.1rem"]}
							pl="6"
						/>
						<Flex
							position="absolute"
							left="0.5rem"
							bottom={["0.3rem", "0.3rem", "1rem", "1rem"]}
						>
							<MdSearch color={theme.text.cyanPurple} />
						</Flex>
					</InputGroup>
				</Flex>
				<TableContainer mx="10.5rem" mt="8" mb="10rem">
					<Table
						variant="unstyled"
						maxWidth="100%"
						style={{ borderCollapse: "separate", borderSpacing: "0 10px" }}
					>
						<Thead>
							<Tr>
								<Th color={theme.text.mono} pl="5" />
								<Th color={theme.text.mono}>Total Value</Th>
								<Th color={theme.text.mono}>Total Amount</Th>
								<Th color={theme.text.mono}>Token Amount</Th>
								<Th color={theme.text.mono}>Time</Th>
							</Tr>
						</Thead>
						<Tbody bgColor={theme.bg.blueNavy}>
							<Tr>
								<Td borderLeftRadius="0.75rem" fontSize="sm" pl="4">
									<Text color={theme.text.cyan} fontWeight="bold" pl="2">
										Add USDT and BUSD
									</Text>
								</Td>
								<Td fontSize="sm">$0.0978</Td>
								<Td fontSize="sm">0.04585 USDT</Td>
								<Td fontSize="sm" whiteSpace="normal">
									0.0003 BUSD
								</Td>
								<Td fontSize="sm" borderRightRadius="0.75rem">
									4 days go
								</Td>
							</Tr>
						</Tbody>
					</Table>
				</TableContainer>
			</Flex>
		</Flex>
	);
};
