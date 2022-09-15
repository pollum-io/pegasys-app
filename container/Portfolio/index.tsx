import { NextPage } from "next";
import { usePicasso, useWallet } from "hooks";
import {
	Button,
	Flex,
	HStack,
	Icon,
	Image,
	Img,
	Input,
	InputGroup,
	InputLeftElement,
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
	useColorMode,
} from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";
import { useState } from "react";
import { WalletStatsCards } from "components/Portfolio/WalletStatsCards";
import { LiquidityCards } from "components/Portfolio/LiquidityCards";
import { TransactionCards } from "components/Portfolio/TransactionCards";

export const PortfolioContainer: NextPage = () => {
	const theme = usePicasso();
	const [buttonId, setButtonId] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(2);
	const { colorMode } = useColorMode();
	const { isConnected } = useWallet();
	const lastPostIndex = currentPage * postsPerPage;
	const firstPostIndex = lastPostIndex - postsPerPage;

	return (
		<Flex justifyContent="center" alignItems="center" w="100%">
			<Flex
				flexDirection="column"
				zIndex="docked"
				justifyContent="center"
				w="100%"
				h="100%"
				pt={["5", "5", "10", "10"]}
			>
				<Flex
					flexDirection="row"
					w="100%"
					px={["1rem", "4rem", "2.5rem", "8rem"]}
					justifyContent="flex-end"
					display={isConnected ? ["none", "none", "flex", "flex"] : "none"}
				>
					<Flex w="max-content" gap="6" fontSize="18px">
						<Text _hover={{ color: "white", cursor: "pointer" }}>Wallet</Text>
						<Text _hover={{ color: "white", cursor: "pointer" }}>
							Liquidity
						</Text>
						<Text _hover={{ color: "white", cursor: "pointer" }}>
							Transactions
						</Text>
					</Flex>
				</Flex>
				<Flex
					w={["96.2%", "80%", "80%", "70%"]}
					justifyContent="flex-start"
					zIndex="docked"
					mt="16"
				>
					<Flex
						w="100%"
						h="max-content"
						py={["2", "2", "6", "6"]}
						pl={["6", "2rem", "20", "9.5rem"]}
						position="relative"
						border="1px solid transparent"
						borderRightRadius="xl"
						borderLeft="none"
						boxShadow={
							colorMode === "dark"
								? "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4)"
								: "none"
						}
						background={`linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
					>
						<Flex
							alignItems={["flex-start", "flex-start", "center", "center"]}
							justifyContent="space-between"
							gap={["4", "4", "7", "7"]}
							flexDirection={["column", "column", "row", "row"]}
							w="96%"
						>
							<Flex>
								<Text
									fontWeight="semibold"
									fontSize={["20px", "22px", "24px", "24px"]}
									color={theme.text.whitePurple}
								>
									Wallet Stats
								</Text>
							</Flex>
							<Flex
								flexDirection={["row", "row", "column", "column"]}
								alignItems={[
									"center",
									"flex-center",
									"flex-start",
									"flex-start",
								]}
								w={["100%", "100%", "max-content", "max-content"]}
								gap={["2rem", "2.5rem", "0", "0"]}
								justifyContent={isConnected ? "normal" : "space-between"}
							>
								<Text
									fontWeight="semibold"
									fontSize={["20px", "20px", "24px", "24px"]}
									order={[1, 1, 0, 0]}
								>
									{isConnected ? "$1.21" : "-"}
								</Text>
								<Text fontSize={["12px", "14px", "14px", "14px"]}>
									Total Value Swapped
								</Text>
							</Flex>
							<Flex
								flexDirection={["row", "row", "column", "column"]}
								alignItems={[
									"center",
									"flex-center",
									"flex-start",
									"flex-start",
								]}
								w={["100%", "100%", "max-content", "max-content"]}
								gap={["4.1rem", "4.9rem", "0", "0"]}
								justifyContent={isConnected ? "normal" : "space-between"}
							>
								<Text
									fontWeight="semibold"
									fontSize={["20px", "20px", "24px", "24px"]}
									order={[1, 1, 0, 0]}
								>
									{isConnected ? "$0.0036" : "-"}
								</Text>
								<Text fontSize={["12px", "14px", "14px", "14px"]}>
									Total Fees Paid
								</Text>
							</Flex>
							<Flex
								flexDirection={["row", "row", "column", "column"]}
								alignItems={[
									"center",
									"flex-center",
									"flex-start",
									"flex-start",
								]}
								w={["100%", "100%", "max-content", "max-content"]}
								gap={["3.05rem", "3.7rem", "0", "0"]}
								justifyContent={isConnected ? "normal" : "space-between"}
							>
								<Text
									fontWeight="semibold"
									fontSize={["20px", "20px", "24px", "24px"]}
									order={[1, 1, 0, 0]}
								>
									{isConnected ? "12" : "-"}
								</Text>
								<Text fontSize={["12px", "14px", "14px", "14px"]}>
									Total Transactions
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				{isConnected ? (
					<Flex flexDirection="column">
						<Flex
							w="100%"
							justifyContent="flex-start"
							mt="4rem"
							mb="0.5rem"
							px={["1rem", "2rem", "5rem", "8rem"]}
						>
							<Text
								pl="6"
								color={theme.text.whitePurple}
								fontWeight="600"
								fontSize="20px"
							>
								Wallet Balance
							</Text>
						</Flex>
						<Flex
							w="100%"
							justifyContent="center"
							px={["1rem", "2rem", "5rem", "8rem"]}
							color={theme.text.mono}
						>
							<Flex
								alignItems="center"
								w="100%"
								pl="6"
								justifyContent="space-between"
							>
								<Flex
									flexDirection="row"
									alignItems="center"
									justifyContent="space-between"
									w="90%"
								>
									<Flex
										flexDirection="row"
										alignItems="center"
										justifyContent="space-between"
										w={["45%", "45%", "41%", "34.2%"]}
										pr="1.95rem"
										fontSize="14px"
									>
										<Text>Assets</Text>
										<Text display={["none", "flex", "flex", "flex"]}>
											Price
										</Text>
									</Flex>
									<Flex
										flexDirection="row"
										alignItems="center"
										justifyContent="space-between"
										w={["45%", "42%", "45%", "43.2%"]}
										fontSize="14px"
									>
										<Text display={["none", "flex", "flex", "flex"]}>
											Balance
										</Text>
										<Text pr={["0", "0.2rem", "0.2rem", "0.2rem"]}>Value</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
						<Flex flexDirection="column" mt="1rem">
							<WalletStatsCards />
							<WalletStatsCards />
						</Flex>

						<Flex
							w={["96.2%", "75%", "70%", "60%"]}
							justifyContent="flex-start"
							zIndex="docked"
							mt="6rem"
							mb="6"
						>
							<Flex
								w="100%"
								h="max-content"
								py={["2", "2", "6", "6"]}
								pl={["6", "10", "20", "9.5rem"]}
								position="relative"
								border="1px solid transparent"
								borderRightRadius="xl"
								borderLeft="none"
								boxShadow={
									colorMode === "dark"
										? "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4)"
										: "none"
								}
								background={`linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
							>
								<Flex
									alignItems={["flex-start", "flex-start", "center", "center"]}
									justifyContent="space-between"
									gap={["4", "4", "7", "7"]}
									flexDirection={["column", "column", "row", "row"]}
									w="96%"
								>
									<Flex>
										<Text
											fontWeight="semibold"
											fontSize={["20px", "20px", "24px", "24px"]}
											color={theme.text.whitePurple}
										>
											Liquidity Positions
										</Text>
									</Flex>
									<Flex
										flexDirection={["row", "row", "column", "column"]}
										alignItems={[
											"center",
											"flex-center",
											"flex-start",
											"flex-start",
										]}
										gap={["2rem", "2rem", "0", "0"]}
									>
										<Text
											fontWeight="semibold"
											fontSize={["20px", "20px", "24px", "24px"]}
											order={[1, 1, 0, 0]}
										>
											{isConnected ? "$0.03" : "-"}
										</Text>
										<Text fontSize={["12px", "14px", "14px", "14px"]}>
											Liquidity (Incluiding fees)
										</Text>
									</Flex>
									<Flex
										flexDirection={["row", "row", "column", "column"]}
										alignItems={[
											"center",
											"flex-center",
											"flex-start",
											"flex-start",
										]}
										gap={["1.8rem", "1.75rem", "0", "0"]}
									>
										<Text
											fontWeight="semibold"
											fontSize={["20px", "20px", "24px", "24px"]}
											order={[1, 1, 0, 0]}
											color="#38A169"
										>
											{isConnected ? "$0.0036" : "-"}
										</Text>
										<Text
											fontSize={["12px", "14px", "14px", "14px"]}
											color="#38A169"
										>
											Fees Earned (Cumulative)
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
						<Flex
							w="100%"
							justifyContent="center"
							px={["1rem", "2rem", "2.5rem", "8rem"]}
							color={theme.text.mono}
							display={["none", "none", "flex", "flex"]}
							mt="2.7rem"
						>
							<Flex
								alignItems="center"
								w="100%"
								pl="6"
								justifyContent="space-between"
							>
								<Flex
									flexDirection="row"
									alignItems="center"
									justifyContent="space-between"
									w={["0", "0", "87%", "90%"]}
									fontSize="14px"
								>
									<Flex
										flexDirection="row"
										alignItems="center"
										justifyContent="flex-start"
										w={["45%", "45%", "30.2%", "29.2%"]}
									>
										<Text>Assets</Text>
									</Flex>
									<Flex
										flexDirection="row"
										alignItems="center"
										justifyContent="space-between"
										w={["45%", "45%", "68%", "73.2%"]}
										pr={["0", "0", "0", "0.1rem"]}
									>
										<Text>Pool Tokens</Text>
										<Text pl={["", "", "2.7rem", "2.6rem"]}>Value</Text>
										<Text pl={["", "", "2.4rem", "2.4rem"]}>APR</Text>
										<Text pr={["", "", "1.3rem", "2.7rem"]}>Pool Share</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
						<Flex flexDirection="column" mt="1rem" gap="2">
							<LiquidityCards />
						</Flex>

						<Flex
							background={`linear-gradient(${theme.bg.blueGray}, ${theme.bg.blueGray}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
							borderTopRadius="3xl"
							w="100%"
							border="1px solid transparent"
							mt="8rem"
							flexDirection="column"
							h="100%"
						>
							<Flex
								flexDirection="column"
								w="100%"
								px={["1.5rem", "2rem", "2.5rem", "8rem"]}
								pt="2rem"
							>
								<Flex mb="6">
									<Text
										fontSize={["20px", "20px", "24px", "24px"]}
										fontWeight="semibold"
										color={theme.text.whitePurple}
									>
										Transactions
									</Text>
								</Flex>
								<Flex
									w="100%"
									justifyContent="space-between"
									alignItems="center"
									flexDirection={["column", "column", "row", "row"]}
									gap={["4", "4", "0", "0"]}
								>
									<Flex w={["100%", "100%", "100%", "50%"]}>
										<Flex>
											<Button
												onClick={() => setButtonId("all")}
												px="6"
												py="2"
												borderRadius="full"
												fontWeight="semibold"
												color={
													buttonId === "all"
														? theme.text.whiteDarkPurple
														: theme.border.borderSettings
												}
												bgColor={
													buttonId === "all" ? theme.bg.blue600 : "transparent"
												}
												_hover={{
													opacity: "0.9",
												}}
											>
												All
											</Button>
											<Button
												onClick={() => setButtonId("swaps")}
												borderRadius="full"
												color={
													buttonId === "swaps"
														? theme.text.whiteDarkPurple
														: theme.border.borderSettings
												}
												bgColor={
													buttonId === "swaps"
														? theme.bg.blue600
														: "transparent"
												}
												px="6"
												py="2"
												fontWeight="semibold"
												_hover={{
													opacity: "0.9",
												}}
											>
												Swaps
											</Button>
											<Button
												onClick={() => setButtonId("adds")}
												borderRadius="full"
												color={
													buttonId === "adds"
														? theme.text.whiteDarkPurple
														: theme.border.borderSettings
												}
												bgColor={
													buttonId === "adds" ? theme.bg.blue600 : "transparent"
												}
												px="6"
												py="2"
												fontWeight="semibold"
												_hover={{
													opacity: "0.9",
												}}
											>
												Adds
											</Button>
											<Button
												borderRadius="full"
												onClick={() => setButtonId("removes")}
												color={
													buttonId === "removes"
														? theme.text.whiteDarkPurple
														: theme.border.borderSettings
												}
												bgColor={
													buttonId === "removes"
														? theme.bg.blue600
														: "transparent"
												}
												px="6"
												py="2"
												fontWeight="semibold"
												_hover={{
													opacity: "0.9",
												}}
											>
												Removes
											</Button>
										</Flex>
									</Flex>

									<InputGroup
										alignItems="center"
										w={["100%", "100%", "30rem", "20rem"]}
									>
										<InputLeftElement
											pl="0.625rem"
											pointerEvents="none"
											pb="0.3rem"
											// eslint-disable-next-line react/no-children-prop
											children={
												<MdSearch color={theme.icon.searchIcon} size={20} />
											}
										/>
										<Input
											fontSize={["14px", "14px", "13px", "14px"]}
											borderColor={theme.bg.blueNavyLightness}
											placeholder="Search by token name"
											_placeholder={{
												opacity: 1,
												color: theme.text.input,
											}}
											borderRadius="full"
											h="2.2rem"
											py={["0.2rem", "0.2rem", "1", "1"]}
											pl="10"
											_focus={{ outline: "none" }}
											_hover={{}}
										/>
									</InputGroup>
								</Flex>
							</Flex>
							<Flex
								w="100%"
								justifyContent="center"
								px={["1.5rem", "2rem", "2.5rem", "8rem"]}
								color={theme.text.mono}
								mt="3rem"
								display={["none", "none", "flex", "flex"]}
							>
								<Flex
									alignItems="center"
									w="100%"
									justifyContent="space-between"
									pl="6"
								>
									<Flex
										flexDirection="row"
										justifyContent="space-between"
										w="96%"
									>
										<Flex
											flexDirection="row"
											alignItems="center"
											justifyContent="flex-start"
											w={["45%", "45%", "30.2%", "34.2%"]}
										/>

										<Flex
											flexDirection="row"
											alignItems="center"
											justifyContent="space-between"
											w={["45%", "42%", "68%", "100%"]}
											fontSize="14px"
										>
											<Text display={["none", "flex", "flex", "flex"]}>
												Total Value
											</Text>
											<Text
												display={["none", "flex", "flex", "flex"]}
												pr="1.8rem"
											>
												Total Amount
											</Text>
											<Text
												display={["none", "flex", "flex", "flex"]}
												pr="0.9rem"
											>
												Token Amount
											</Text>
											<Text pr={["0", "0.2rem", "2.55rem", "2.55rem"]}>
												Time
											</Text>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
							<Flex
								flexDirection="column"
								mt={["2rem", "2rem", "1rem", "1rem"]}
								mb="20rem"
							>
								<TransactionCards />
								<TransactionCards />
							</Flex>
						</Flex>
					</Flex>
				) : (
					<Flex
						w="100%"
						mt={["3rem", "3rem", "4rem", "6rem"]}
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						px={["1rem", "4rem", "5rem", "8rem"]}
						textAlign="center"
					>
						<Text
							fontSize={["sm", "sm", "md", "md"]}
							fontWeight="normal"
							textAlign="center"
						>
							Please connect your wallet in the button below to view your
							portfolio.
						</Text>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};
