import { NextPage } from "next";
import { usePicasso } from "hooks";
import {
	Button,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";
import { useRef, useState } from "react";
import { WalletStatsCards } from "components/Portfolio/WalletStatsCards";
import { LiquidityCards } from "components/Portfolio/LiquidityCards";
import { TransactionCards } from "components/Portfolio/TransactionCards";
import { useWallet } from "pegasys-services";
import { useTranslation } from "react-i18next";
import {
	liquidityCardsMockedData,
	transactionCardsMockedData,
	walletStatsCardsMockedData,
} from "helpers/mockedData";

export const PortfolioContainer: NextPage = () => {
	const theme = usePicasso();
	const toWallet = useRef(null);
	const toLiquidity = useRef(null);
	const toTransactions = useRef(null);
	const [buttonId, setButtonId] = useState<string>("all");
	const { colorMode } = useColorMode();
	const { isConnected } = useWallet();
	const { t: translation } = useTranslation();

	const scrollToSection = (elementRef: any) => {
		window.scrollTo({
			top: elementRef.current.offsetTop,
			behavior: "smooth",
		});
	};

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
						<Text
							_hover={{ color: theme.text.whiteGrayHover, cursor: "pointer" }}
							onClick={() => scrollToSection(toWallet)}
						>
							{translation("portfolioPage.wallet")}
						</Text>
						<Text
							_hover={{ color: theme.text.whiteGrayHover, cursor: "pointer" }}
							onClick={() => scrollToSection(toLiquidity)}
						>
							{translation("portfolioPage.liquidity")}
						</Text>
						<Text
							_hover={{ color: theme.text.whiteGrayHover, cursor: "pointer" }}
							onClick={() => scrollToSection(toTransactions)}
						>
							{translation("portfolioPage.transactions")}
						</Text>
					</Flex>
				</Flex>
				<Flex
					w={["94%", "30rem", "47rem", "61rem"]}
					justifyContent="flex-start"
					zIndex="docked"
					mt="16"
				>
					<Flex
						color={theme.text.mono}
						w="100%"
						h="max-content"
						py={["3", "3", "6", "6"]}
						pl={["6", "2rem", "4rem", "9.5rem"]}
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
						ref={toWallet}
					>
						<Flex
							alignItems={["flex-start", "flex-start", "center", "center"]}
							justifyContent="space-between"
							flexDirection={["column", "column", "row", "row"]}
							w="96%"
							gap={["4", "4", "0", "0"]}
						>
							<Flex w={["", "25rem", "10rem", "12rem"]}>
								<Text
									fontWeight="semibold"
									fontSize={["1.25rem", "1.375rem", "1.5rem", "1.5rem"]}
									color={theme.text.whitePurple}
								>
									{translation("portfolioPage.walletStats")}
								</Text>
							</Flex>
							<Flex
								justifyContent="space-between"
								w={["100%", "95%", "72%", "69%"]}
								flexDirection={["column", "column", "row", "row"]}
								gap={["2", "2", "4", "0"]}
							>
								<Flex
									flexDirection={["row", "row", "column", "column"]}
									alignItems={[
										"center",
										"flex-center",
										"flex-start",
										"flex-start",
									]}
									w={["100%", "100%", "11rem", "11rem"]}
									gap={["2.05rem", "0", "0", "0"]}
									justifyContent={[
										"space-between",
										"space-between",
										"normal",
										"normal",
									]}
									pr={["1rem", "1rem", "0", "0"]}
								>
									<Text
										fontWeight="semibold"
										fontSize={["1.25rem", "1.25rem", "1.375rem", "1.5rem"]}
										order={[1, 1, 0, 0]}
										w="11rem"
									>
										{isConnected ? "$1.21" : "-"}
									</Text>
									<Text
										fontSize={["0.75rem", "0.875rem", "0.875rem", "0.875rem"]}
										w={["40%", "max-content", "9rem", "11rem"]}
									>
										{translation("portfolioPage.totalValueSwapped")}
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
									w={["100%", "100%", "11rem", "11rem"]}
									gap={["2.05rem", "0", "0", "0"]}
									justifyContent={[
										"space-between",
										"space-between",
										"normal",
										"normal",
									]}
									pr={["1rem", "1rem", "0", "0"]}
								>
									<Text
										fontWeight="semibold"
										fontSize={["1.25rem", "1.25rem", "1.375rem", "1.5rem"]}
										order={[1, 1, 0, 0]}
										w={["11rem", "11rem", "9rem", "11rem"]}
									>
										{isConnected ? "$1450,00" : "-"}
									</Text>
									<Text
										fontSize={["0.75rem", "0.875rem", "0.875rem", "0.875rem"]}
										w={["40%", "max-content", "9rem", "8rem"]}
									>
										{translation("portfolioPage.totalFeesPaid")}
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
									w={["100%", "100%", "8rem", "8rem"]}
									gap={["2.05rem", "0", "0", "0"]}
									justifyContent={[
										"space-between",
										"space-between",
										"normal",
										"normal",
									]}
									pr={["1rem", "1rem", "0", "0"]}
								>
									<Text
										fontWeight="semibold"
										fontSize={["1.25rem", "1.25rem", "1.375rem", "1.5rem"]}
										order={[1, 1, 0, 0]}
										w={["11rem", "11rem", "8rem", "8rem"]}
									>
										{isConnected ? "12" : "-"}
									</Text>
									<Text
										fontSize={["0.75rem", "0.875rem", "0.875rem", "0.875rem"]}
										w={["40%", "max-content", "8rem", "8rem"]}
									>
										{translation("portfolioPage.totalTransactions")}
									</Text>
								</Flex>
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
							pl={["6", "2rem", "4rem", "9.5rem"]}
						>
							<Text
								color={theme.text.whitePurple}
								fontWeight="600"
								fontSize="1.25rem"
							>
								{translation("portfolioPage.walletBalance")}
							</Text>
						</Flex>
						<Flex
							w="100%"
							justifyContent="center"
							px={["1.5rem", "2rem", "2.5rem", "8rem"]}
							color={theme.text.mono}
							mt="3rem"
							display={
								walletStatsCardsMockedData.length === 0
									? "none"
									: ["none", "none", "flex", "flex"]
							}
							fontSize="0.875rem"
						>
							<Flex alignItems="center" w="100%" pl={["4", "4", "6", "6"]}>
								<Flex alignItems="center" w={["55%", "40%", "24.1%", "24%"]}>
									<Flex>
										<Text>{translation("portfolioPage.asset")}</Text>
									</Flex>
								</Flex>
								<Flex
									flexDirection={["column", "row", "row", "row"]}
									alignItems={["flex-start", "center", "center", "center"]}
									justifyContent="space-between"
									w={["45%", "56%", "71.9%", "72%"]}
								>
									<Flex w="10rem">
										<Text display={["none", "flex", "flex", "flex"]}>
											{translation("swapPage.price")}
										</Text>
									</Flex>
									<Flex
										w="6rem"
										display={["none", "flex", "flex", "flex"]}
										mr="1.9rem"
									>
										<Text>{translation("portfolioPage.balance")}</Text>
									</Flex>
									<Flex w="6rem">
										<Text>{translation("portfolioPage.value")}</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
						<Flex flexDirection="column" mt="1rem">
							{walletStatsCardsMockedData.length === 0 ? (
								<Flex
									w="100%"
									my={["3rem", "3rem", "8rem", "8rem"]}
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
										{translation("portfolioPage.noPositions")}
									</Text>
								</Flex>
							) : (
								<WalletStatsCards />
							)}
						</Flex>

						<Flex
							w={["94%", "27rem", "43.75rem", "54.75rem"]}
							justifyContent="flex-start"
							zIndex="docked"
							mt="6rem"
							mb="6"
						>
							<Flex
								w="100%"
								h="max-content"
								py={["3", "3", "4", "4"]}
								pl={["6", "2.2rem", "4rem", "9.5rem"]}
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
								ref={toLiquidity}
							>
								<Flex
									alignItems={["flex-start", "flex-start", "center", "center"]}
									justifyContent="space-between"
									flexDirection={["column", "column", "row", "row"]}
									w="95%"
									gap={["4", "4", "0", "0"]}
								>
									<Flex
										w={["max-content", "max-content", "8.6rem", "8.6rem"]}
										h="max-content"
									>
										<Text
											fontWeight="semibold"
											fontSize={["1.25rem", "1.25rem", "1.5rem", "1.5rem"]}
											color={theme.text.whitePurple}
										>
											{translation("portfolioPage.liquidityPositions")}
										</Text>
									</Flex>
									<Flex
										justifyContent="space-between"
										w={["100%", "100%", "68%", "65%"]}
										h="100%"
										pt={["0", "0", "1.5", "1.5"]}
										flexDirection={["column", "column", "row", "row"]}
										gap={["2", "2", "4", "4"]}
									>
										<Flex
											flexDirection={["row", "row", "column", "column"]}
											alignItems={[
												"center",
												"flex-center",
												"flex-start",
												"flex-start",
											]}
											gap={["1.5rem", "2rem", "0", "0"]}
											justifyContent={[
												"space-between",
												"space-between",
												"center",
												"center",
											]}
											h="max-content"
											w={["", "100%", "15rem", "15rem"]}
										>
											<Text
												fontWeight="semibold"
												fontSize={["1.25rem", "1.25rem", "1.375rem", "1.5rem"]}
												order={[1, 1, 0, 0]}
												w="11rem"
											>
												{isConnected ? "$0.03" : "-"}
											</Text>
											<Text
												fontSize={[
													"0.75rem",
													"0.875rem",
													"0.875rem",
													"0.875rem",
												]}
												w={["50%", "50%", "12rem", "12rem"]}
											>
												{translation("portfolioPage.liquidity")}{" "}
												{translation("portfolioPage.includingFees")}
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
											gap={["1.3rem", "1.75rem", "0", "0"]}
											h="max-content"
											w={["", "100%", "13rem", "13rem"]}
										>
											<Text
												fontWeight="semibold"
												fontSize={["1.25rem", "1.25rem", "1.375rem", "1.5rem"]}
												order={[1, 1, 0, 0]}
												color="#38A169"
												w="10.7rem"
											>
												{isConnected ? "$0.0036" : "-"}
											</Text>

											<Text
												fontSize={[
													"0.75rem",
													"0.875rem",
													"0.875rem",
													"0.875rem",
												]}
												color="#38A169"
												w={["50%", "50%", "12rem", "13rem"]}
											>
												{translation("portfolioPage.feesEarned")}{" "}
												{translation("portfolioPage.cumulative")}
											</Text>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
						<Flex
							w="100%"
							justifyContent="center"
							px={["1rem", "2rem", "2.5rem", "8rem"]}
							color={theme.text.mono}
							display={
								liquidityCardsMockedData.length === 0
									? "none"
									: ["none", "none", "flex", "flex"]
							}
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
									w={["0", "0", "87%", "88%"]}
									fontSize="0.875rem"
								>
									<Flex
										flexDirection="row"
										alignItems="center"
										justifyContent="flex-start"
										w={["45%", "45%", "30.2%", "29.2%"]}
									>
										<Text>{translation("portfolioPage.assets")}</Text>
									</Flex>
									<Flex
										flexDirection="row"
										alignItems="center"
										justifyContent="space-between"
										w={["45%", "45%", "68%", "73.2%"]}
										pr={["0", "0", "0", "0.1rem"]}
									>
										<Text>Pool Tokens</Text>
										<Text pl={["", "", "2.7rem", "3rem"]}>
											{translation("portfolioPage.value")}
										</Text>
										<Text pl={["", "", "3rem", "2.9rem"]}>APR</Text>
										<Text pr={["", "", "1.5rem", "2.65rem"]}>Pool Share</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
						<Flex flexDirection="column" mt="1rem" gap={["0", "2", "2", "2"]}>
							{liquidityCardsMockedData.length === 0 ? (
								<Flex
									w="100%"
									my={["3rem", "3rem", "8rem", "8rem"]}
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
										{translation("portfolioPage.noLiquidity")}
									</Text>
								</Flex>
							) : (
								<LiquidityCards />
							)}
						</Flex>

						<Flex
							background={`linear-gradient(${theme.bg.blueGray}, ${theme.bg.blueGray}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
							borderTopRadius="3xl"
							w="100%"
							border="none"
							borderTop="1px solid transparent"
							mt={["4rem", "4rem", "7rem", "7rem"]}
							flexDirection="column"
							h="100%"
							ref={toTransactions}
						>
							<Flex
								flexDirection="column"
								w="100%"
								px={["1.5rem", "2rem", "2.5rem", "8rem"]}
								pt="2rem"
							>
								<Flex mb="6">
									<Text
										fontSize={["1.25rem", "1.25rem", "1.5rem", "1.5rem"]}
										fontWeight="semibold"
										color={theme.text.whitePurple}
									>
										{translation("portfolioPage.transactions")}
									</Text>
								</Flex>
								<Flex
									w="100%"
									justifyContent="space-between"
									alignItems="center"
									flexDirection={["column", "column", "row", "row"]}
									gap={["4", "4", "0", "0"]}
								>
									<Flex w={["100%", "100%", "100%", "50%"]} pr="4">
										<Flex
											w="100%"
											justifyContent={[
												"space-between",
												"normal",
												"normal",
												"normal",
											]}
											gap="1"
										>
											<Button
												onClick={() => setButtonId("all")}
												px="6"
												py="2"
												borderRadius="full"
												fontWeight="semibold"
												color={
													buttonId === "all"
														? theme.text.darkBluePurple
														: theme.text.lightGray
												}
												bgColor={
													buttonId === "all" ? theme.bg.blue600 : "transparent"
												}
												_hover={{
													opacity: "0.9",
												}}
											>
												{translation("portfolioPage.all")}
											</Button>
											<Button
												onClick={() => setButtonId("swaps")}
												borderRadius="full"
												color={
													buttonId === "swaps"
														? theme.text.darkBluePurple
														: theme.text.lightGray
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
														? theme.text.darkBluePurple
														: theme.text.lightGray
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
														? theme.text.darkBluePurple
														: theme.text.lightGray
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
										w={["100%", "100%", "30rem", "25rem"]}
									>
										<InputLeftElement
											pl="0.625rem"
											pointerEvents="none"
											pb="0.3rem"
											// eslint-disable-next-line react/no-children-prop
											children={
												<MdSearch
													color={theme.icon.inputSearchIcon}
													size={20}
												/>
											}
										/>
										<Input
											fontSize={[
												"0.875rem",
												"0.875rem",
												"0.8125rem",
												"0.875rem",
											]}
											borderColor={theme.bg.blueNavyLightness}
											placeholder={translation("currencyInputPanel.searchBy")}
											_placeholder={{
												opacity: 1,
												color: theme.text.inputBluePurple,
											}}
											borderRadius="full"
											h="2.2rem"
											py={["0.2rem", "0.2rem", "1", "1"]}
											pl="10"
											_focus={{
												outline: "none",
												borderColor: theme.border.focusBluePurple,
											}}
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
								display={
									transactionCardsMockedData.length === 0
										? "none"
										: ["none", "none", "flex", "flex"]
								}
							>
								<Flex
									alignItems="center"
									w="100%"
									justifyContent="space-between"
								>
									<Flex
										flexDirection="row"
										justifyContent="space-between"
										w="100%"
										pl="6"
									>
										<Flex
											flexDirection="row"
											alignItems="center"
											justifyContent="flex-start"
											w={["45%", "45%", "27.5%", "33.6%"]}
										/>

										<Flex
											flexDirection="row"
											alignItems="center"
											justifyContent="space-between"
											w={["45%", "42%", "72.6%", "100%"]}
											fontSize="0.875rem"
										>
											<Flex w="5rem">
												<Text>{translation("portfolioPage.totalValue")}</Text>
											</Flex>
											<Flex w="8rem" mr={["0.5rem", "0", "0", "0"]}>
												<Text>{translation("portfolioPage.tokenAmount")}</Text>
											</Flex>
											<Flex w="8rem">
												<Text>{translation("portfolioPage.tokenAmount")}</Text>
											</Flex>
											<Flex w="6rem" mr={["0", "0.2rem", "1.1rem", "1.35rem"]}>
												<Text>{translation("portfolioPage.time")}</Text>
											</Flex>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
							<Flex
								flexDirection="column"
								mt={["2rem", "2rem", "1rem", "1rem"]}
								mb="20rem"
							>
								{transactionCardsMockedData.length === 0 ? (
									<Flex
										w="100%"
										my={["3rem", "3rem", "8rem", "8rem"]}
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
											{translation("portfolioPage.noTransactions")}
										</Text>
									</Flex>
								) : (
									<TransactionCards buttonOption={buttonId} />
								)}
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
							{translation("portfolioPage.pleaseConnect")}
						</Text>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};
