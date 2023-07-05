import {
	Button,
	Flex,
	Img,
	Input,
	InputGroup,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	InputLeftElement,
	useMediaQuery,
	useColorMode,
	Collapse,
	SlideFade,
	Link,
} from "@chakra-ui/react";
import { ChainId, Pair, Token } from "@pollum-io/pegasys-sdk";
import { PAIRS_CURRENT, PAIR_DATAS, pegasysClient } from "apollo";
import {
	AddLiquidityModal,
	LoadingTransition,
	RemoveLiquidity,
} from "components";
import { PoolCards } from "components/Pools/PoolCards";
import { usePicasso, useModal, useTokens, usePairs, usePools } from "hooks";
import { NextPage } from "next";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { MdExpandMore, MdOutlineCallMade, MdSearch } from "react-icons/md";
import { WrappedTokenInfo, IDeposited } from "types";
import { useTranslation } from "react-i18next";
import { useWallet, SUPPORTED_NETWORK_CHAINS } from "pegasys-services";
import {
	getTokenPairs,
	toV2LiquidityToken,
	unwrappedToken,
	getBlocksFromTimestamps,
} from "utils";

export const PoolsContainer: NextPage = () => {
	const theme = usePicasso();
	const {
		isOpenRemoveLiquidity,
		onCloseRemoveLiquidity,
		isOpenAddLiquidity,
		onCloseAddLiquidity,
		isOpenTransaction,
		onOpenTransaction,
		onCloseTransaction,
	} = useModal();

	const {
		setPairs,
		pairInfo,
		setPairInfo,
		poolsWithLiquidity,
		poolsApr,
		poolsVolume,
		poolsLiquidity,
		isLoading,
		sortType,
		setSortType,
		setIsLoading,
	} = usePools();

	const { colorMode } = useColorMode();

	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const [isCreate, setIsCreate] = useState(false);
	const [haveValue] = useState(false);
	const {
		isConnected,
		address,
		chainId: currentNetworkChainId,
		provider,
	} = useWallet();
	const { userTokensBalance } = useTokens();
	const [userHavePool] = useState(true);
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [lpPairs, setLpPairs] = useState<Pair[]>([]);
	const [currPair, setCurrPair] = useState<Pair>();
	const [sliderValue, setSliderValue] = useState<number>(0);
	const [depositedTokens, setDepositedTokens] = useState<IDeposited>();
	const [poolPercentShare, setPoolPercentShare] = useState<string>("");
	const [userPoolBalance, setUserPoolBalance] = useState<string>("");
	const [searchTokens, setSearchTokens] = useState<Pair[]>([]);
	const [notFound, setNotFound] = useState<boolean>(false);
	const [allTokens, setAllTokens] = useState<[Token, Token][]>([]);
	const { t: translation, i18n } = useTranslation();

	let currentChainId: ChainId;

	const validatedCurrentChain = SUPPORTED_NETWORK_CHAINS.includes(
		currentNetworkChainId as number
	);

	switch (currentNetworkChainId) {
		case 57:
			currentChainId = ChainId.NEVM;
			break;
		case 5700:
			currentChainId = ChainId.TANENBAUM;
			break;
		case 2814:
			currentChainId = ChainId.ROLLUX;
			break;
		default:
			currentChainId = ChainId.NEVM;
	}

	const sortTypeName =
		sortType === "liquidity"
			? translation("pool.liquidity")
			: sortType === "apr"
			? "APR"
			: sortType === "your-pools"
			? translation("pool.yourPools")
			: translation("positionCard.volume");

	const isValid = userTokensBalance.every(
		token => token.chainId === currentChainId
	);
	useEffect(() => {
		const pairsInfo = async () => {
			setSearchTokens([]);
			setPairs([]);
			setIsLoading(true);
			if (userTokensBalance.length === 0 || !isValid) return;

			const tokens = getTokenPairs(
				validatedCurrentChain ? currentChainId : ChainId.NEVM,
				userTokensBalance
			);

			if (
				tokens.every(
					token =>
						token[0]?.chainId === currentChainId &&
						token[1]?.chainId === currentChainId
				) &&
				currentNetworkChainId === currentChainId
			) {
				setAllTokens(tokens);
			}

			const walletInfos = {
				chainId: validatedCurrentChain ? currentChainId : ChainId.NEVM,
				provider,
				walletAddress: address,
			};

			const [{ number: oneDay }, { number: twoDays }] =
				await getBlocksFromTimestamps();

			const tokensWithLiquidity = allTokens.map(tokens => ({
				liquidityToken: toV2LiquidityToken(
					tokens as [WrappedTokenInfo, Token],
					currentChainId
				),
				tokens: tokens as [WrappedTokenInfo, Token],
			}));

			const fetchPairs = await pegasysClient.query({
				query: PAIRS_CURRENT,
				fetchPolicy: "cache-first",
			});

			const fetchPairsAddresses = await Promise.all([fetchPairs]);

			const pairAddresses = fetchPairsAddresses[0]?.data?.pairs;

			const oneDayPairInfos = await pegasysClient.query({
				query: PAIR_DATAS(
					pairAddresses.map(token => token.id),
					Number(oneDay)
				),
				fetchPolicy: "network-only",
			});

			const twoDaysPairInfos = await pegasysClient.query({
				query: PAIR_DATAS(
					pairAddresses.map(token => token.id),
					twoDays
				),
				fetchPolicy: "network-only",
			});

			const generalPairInfos = await pegasysClient.query({
				query: PAIR_DATAS(pairAddresses.map(token => token.id)),
				fetchPolicy: "network-only",
			});

			const formattedOneDayPairsInfo = oneDayPairInfos.data.pairs.reduce(
				(acc, pair) => ({
					...acc,
					[`${pair.token0.symbol}-${pair.token1.symbol}`]: pair,
				}),
				{}
			);

			const formattedTwoDaysPairsInfo = twoDaysPairInfos.data.pairs.reduce(
				(acc, pair) => ({
					...acc,
					[`${pair.token0.symbol}-${pair.token1.symbol}`]: pair,
				}),
				{}
			);

			const formattedGeneralPairsInfo = generalPairInfos.data.pairs.reduce(
				(acc, pair) => ({
					...acc,
					[`${pair.token0.symbol}-${pair.token1.symbol}`]: pair,
				}),
				{}
			);

			const oneDayCommonPairs = allTokens
				.map(
					currency =>
						formattedOneDayPairsInfo[
							`${
								currency[0]?.symbol === "WETH"
									? "ETH"
									: currency[0]?.symbol === "SYS"
									? "WSYS"
									: currency[0]?.symbol
							}-${currency[1]?.symbol === "WETH" ? "ETH" : currency[1]?.symbol}`
						]
				)
				.filter(item => item !== undefined);

			const twoDaysCommonPairs = allTokens
				.map(
					currency =>
						formattedTwoDaysPairsInfo[
							`${
								currency[0]?.symbol === "WETH"
									? "ETH"
									: currency[0]?.symbol === "SYS"
									? "WSYS"
									: currency[0]?.symbol
							}-${currency[1]?.symbol === "WETH" ? "ETH" : currency[1]?.symbol}`
						]
				)
				.filter(item => item !== undefined);

			const generalDaysCommonPairs = allTokens
				.map(
					currency =>
						formattedGeneralPairsInfo[
							`${
								currency[0]?.symbol === "WETH"
									? "ETH"
									: currency[0]?.symbol === "SYS"
									? "WSYS"
									: currency[0]?.symbol
							}-${currency[1]?.symbol === "WETH" ? "ETH" : currency[1]?.symbol}`
						]
				)
				.filter(item => item !== undefined);

			const formattedOneDayCommonPairs = oneDayCommonPairs.reduce(
				(acc, curr) => ({
					...acc,
					[`${
						curr?.token0?.symbol === "WSYS"
							? "SYS"
							: curr?.token0?.symbol === "ETH"
							? "WETH"
							: curr?.token0?.symbol
					}-${
						curr?.token1?.symbol === "WSYS"
							? "SYS"
							: curr?.token1?.symbol === "ETH"
							? "WETH"
							: curr?.token1?.symbol
					}`]: curr,
				}),
				{}
			);

			const formattedTwoDaysCommonPairs = twoDaysCommonPairs.reduce(
				(acc, curr) => ({
					...acc,
					[`${
						curr?.token0?.symbol === "WSYS"
							? "SYS"
							: curr?.token0?.symbol === "ETH"
							? "WETH"
							: curr?.token0?.symbol
					}-${
						curr?.token1?.symbol === "WSYS"
							? "SYS"
							: curr?.token1?.symbol === "ETH"
							? "WETH"
							: curr?.token1?.symbol
					}`]: curr,
				}),
				{}
			);

			const formattedGeneralCommonPairs = generalDaysCommonPairs.reduce(
				(acc, curr) => ({
					...acc,
					[`${
						curr?.token0?.symbol === "WSYS"
							? "SYS"
							: curr?.token0?.symbol === "ETH"
							? "WETH"
							: curr?.token0?.symbol
					}-${
						curr?.token1?.symbol === "WSYS"
							? "SYS"
							: curr?.token1?.symbol === "ETH"
							? "WETH"
							: curr?.token1?.symbol
					}`]: curr,
				}),
				{}
			);

			// eslint-disable-next-line
			const v2Tokens = await usePairs(
				tokensWithLiquidity.map(({ tokens }) => tokens),
				walletInfos
			);

			const allV2PairsWithLiquidity = v2Tokens
				.map(([, pair]) => pair)
				.filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

			const allUniqueV2PairsWithLiquidity = allV2PairsWithLiquidity
				.map(pair => pair)
				.filter(
					(item, index) =>
						allV2PairsWithLiquidity
							.map(pair => pair.liquidityToken.address)
							.indexOf(item.liquidityToken.address) === index
				);

			setLpPairs(allUniqueV2PairsWithLiquidity);
			setSearchTokens(allUniqueV2PairsWithLiquidity);
			setPairInfo({
				oneDay: formattedOneDayCommonPairs,
				twoDays: formattedTwoDaysCommonPairs,
				general: formattedGeneralCommonPairs,
			});
			setPairs(allUniqueV2PairsWithLiquidity);
		};

		pairsInfo();
	}, [userTokensBalance, isValid, currentNetworkChainId, address]);

	useMemo(() => {
		if (searchTokens.length !== 0) {
			setSearchTokens(prevState =>
				prevState.sort((a, b) => {
					const currencyAa = unwrappedToken(a?.token0 as Token);
					const currencyBa = unwrappedToken(a?.token1 as Token);

					const currencyAb = unwrappedToken(b?.token0 as Token);
					const currencyBb = unwrappedToken(b?.token1 as Token);
					if (sortType === "liquidity") {
						return (
							Number(
								poolsLiquidity?.[`${currencyAb.symbol}-${currencyBb.symbol}`]
							) -
							Number(
								poolsLiquidity?.[`${currencyAa.symbol}-${currencyBa.symbol}`]
							)
						);
					}
					if (sortType === "volume") {
						return (
							Number(
								poolsVolume?.[`${currencyAb.symbol}-${currencyBb.symbol}`]
							) -
							Number(poolsVolume?.[`${currencyAa.symbol}-${currencyBa.symbol}`])
						);
					}
					if (sortType === "apr") {
						return (
							Number(poolsApr?.[`${currencyAb.symbol}-${currencyBb.symbol}`]) -
							Number(poolsApr?.[`${currencyAa.symbol}-${currencyBa.symbol}`])
						);
					}
					if (sortType === "your-pools") {
						return (
							Number(
								poolsWithLiquidity?.[
									`${currencyAb.symbol}-${currencyBb.symbol}`
								]
							) -
							Number(
								poolsWithLiquidity?.[
									`${currencyAa.symbol}-${currencyBa.symbol}`
								]
							)
						);
					}
					return (
						Number(
							poolsLiquidity?.[`${currencyAb.symbol}-${currencyBb.symbol}`]
						) -
						Number(
							poolsLiquidity?.[`${currencyAa.symbol}-${currencyBa.symbol}`]
						)
					);
				})
			);
		}
	}, [
		searchTokens,
		userTokensBalance,
		sortType,
		poolsWithLiquidity,
		poolsApr,
		poolsVolume,
		poolsLiquidity,
	]);

	const { language } = i18n;

	const languages = ["de", "tr", "fr", "pt-br", "vn", "es"];

	const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		if (inputValue !== "") {
			const results = lpPairs.filter(
				token =>
					unwrappedToken(token?.token0)
						.symbol?.toLowerCase()
						.startsWith(inputValue.toLowerCase()) ||
					unwrappedToken(token?.token1)
						.symbol?.toLowerCase()
						.startsWith(inputValue.toLowerCase())
			);
			setSearchTokens(results);
			setNotFound(results.length === 0);
		} else {
			setSearchTokens(lpPairs);
			setNotFound(false);
		}
	};

	return (
		<Flex justifyContent="center" alignItems="center">
			<AddLiquidityModal
				isModalOpen={isOpenAddLiquidity}
				onModalClose={onCloseAddLiquidity}
				isCreate={isCreate}
				haveValue={haveValue}
				setSelectedToken={setSelectedToken}
				selectedToken={selectedToken}
				depositedTokens={depositedTokens}
				poolPercentShare={poolPercentShare}
				userPoolBalance={userPoolBalance}
				currPair={currPair}
				openPendingTx={onOpenTransaction}
				closePendingTx={onCloseTransaction}
			/>
			<RemoveLiquidity
				isModalOpen={isOpenRemoveLiquidity}
				onModalClose={onCloseRemoveLiquidity}
				isCreate={isCreate}
				setSelectedToken={setSelectedToken}
				selectedToken={selectedToken}
				currPair={currPair}
				setSliderValue={setSliderValue}
				sliderValue={sliderValue}
				depositedTokens={depositedTokens}
				poolPercentShare={poolPercentShare}
				userPoolBalance={userPoolBalance}
				allTokens={userTokensBalance}
				openPendingTx={onOpenTransaction}
				closePendingTx={onCloseTransaction}
			/>

			<LoadingTransition
				isOpen={isOpenTransaction}
				onClose={onCloseTransaction}
			/>
			<Flex
				alignItems="flex-start"
				justifyContent="center"
				mb={isLoading ? "6.2rem" : "10rem"}
			>
				<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
					<SlideFade in={Boolean(isMobile || !isMobile)} offsetY="-30px">
						<Flex
							flexDirection="column"
							zIndex="docked"
							position="relative"
							borderRadius="xl"
							h={
								!address
									? ["max-content", "max-content", "unset", "unset"]
									: languages.includes(language)
									? ["max-content", "max-content", "unset", "unset"]
									: "unset"
							}
							backgroundColor={theme.bg.alphaPurple}
						>
							<Img
								borderRadius="xl"
								src={
									isMobile ? theme.bg.poolsBannerMobile : theme.bg.poolsBanner
								}
								position="absolute"
								zIndex="base"
								w="100%"
								h={address ? ["90%", "85%", "85%", "85%"] : "100%"}
							/>
							<Flex
								zIndex="docked"
								flexDirection="column"
								px={["1rem", "1.3rem", "1.625rem", "1.625rem"]}
								py={["0.8rem", "1.1rem", "1.375rem", "1.375rem"]}
								gap="3"
								h={
									languages.includes(language)
										? ["13rem", "11rem", "11rem", "11rem"]
										: ["12rem", "10rem", "10rem", "10rem"]
								}
								color="white"
							>
								<Text fontWeight="bold" fontSize="md">
									{translation("pool.liquidityProviderRewards")}
								</Text>
								<Text
									color="white"
									fontWeight="medium"
									fontSize="sm"
									lineHeight="shorter"
									w={["100%", "80%", "60%", "60%"]}
								>
									{translation("pool.liquidityProvidersEarn")}
								</Text>
							</Flex>
							{address && (
								<Flex
									alignItems="center"
									justifyContent="center"
									flexDirection="row"
									bgColor={theme.bg.alphaPurple}
									zIndex="0"
									position="relative"
									top={["0.6rem", "0.2rem", "0.2rem", "0.2rem"]}
									borderBottomRadius="xl"
									py="0.531rem"
									pt={["0.3rem", "unset", "unset", "unset"]}
									gap="2.5"
								>
									<Link
										href={`https://info.pegasys.finance/account/${address}`}
										target="_blank"
										rel="noreferrer"
										_hover={{ cursor: "pointer" }}
										flexDirection="row"
									>
										<Flex gap="2.5" alignItems="center">
											<Text
												fontWeight="medium"
												fontSize={
													language === "vn" && isMobile ? "0.6875rem" : "xs"
												}
												color="white"
											>
												{translation("pool.viewStakedLiquidity")}
											</Text>
											<MdOutlineCallMade size={18} color="white" />
										</Flex>
									</Link>
								</Flex>
							)}
						</Flex>
					</SlideFade>
					<SlideFade in={Boolean(isMobile || !isMobile)} offsetY="-50px">
						<Flex
							id="a"
							alignItems={["flex-start", "flex-start", "baseline", "baseline"]}
							my={["8", "4", "8", "8"]}
							justifyContent="space-between"
							w="100%"
							flexDirection={
								isConnected
									? ["column", "column", "column", "column"]
									: ["column", "column", "row", "row"]
							}
							zIndex="docked"
						>
							<Flex
								mt={["2rem", "2rem", "4", "4"]}
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
									{translation("pool.poolsOverview")}
								</Text>
							</Flex>
							<Collapse in={!isLoading}>
								{!isLoading && (
									<Flex
										id="b"
										justifyContent={
											isConnected
												? [
														"space-between",
														"space-between",
														"space-between",
														"space-between",
												  ]
												: [
														"space-between",
														"space-between",
														"flex-end",
														"flex-end",
												  ]
										}
										flexDirection={[
											"column-reverse",
											"column-reverse",
											"row",
											"row",
										]}
										zIndex="docked"
										w="max-content"
										mt={["4", "6", "2", "2"]}
										gap={["7", "none", "none", "none"]}
										alignItems={[
											"flex-start",
											"flex-start",
											"flex-end",
											"flex-end",
										]}
									>
										<Flex
											display={userHavePool && isConnected ? "flex" : "none"}
											w={["xs", "100%", "100%", "100%"]}
										>
											<InputGroup alignItems="center">
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
													borderColor={theme.bg.blueNavyLightness}
													placeholder={translation("pool.searchPair")}
													_placeholder={{
														color: theme.text.inputBluePurple,
													}}
													onChange={handleInput}
													borderRadius="full"
													w={["100%", "20rem", "20rem", "20rem"]}
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
										<Flex gap="4" alignItems="flex-end">
											<Flex
												flexDirection="column"
												alignItems={[
													"flex-end",
													"flex-end",
													"flex-start",
													"flex-start",
												]}
											>
												{isConnected && (
													<Menu>
														<Text fontSize="sm" pb="2" w="100%">
															{translation("pool.sort")}
														</Text>
														<MenuButton
															as={Button}
															fontSize="sm"
															fontWeight="semibold"
															px="1rem"
															size="sm"
															h="2.2rem"
															bgColor={theme.bg.blueNavyLightness}
															color="white"
															_hover={{
																bgColor: theme.bg.bluePurple,
															}}
															_active={{}}
															borderRadius="full"
															rightIcon={<MdExpandMore size={20} />}
														>
															{!sortType
																? translation("pool.yourPools")
																: sortTypeName}
														</MenuButton>
														<MenuList
															bgColor={theme.bg.blueNavy}
															color="white"
															borderColor="transparent"
															p="4"
															fontSize="sm"
															zIndex="9999"
														>
															<MenuItem
																color={theme.text.mono}
																_hover={{ bgColor: theme.bg.neutralGray }}
																onClick={() => setSortType("liquidity")}
																borderRadius="md"
																_active={{}}
																bgColor={
																	sortType === "liquidity"
																		? theme.bg.menuLinksGray
																		: "transparent !important"
																}
															>
																{translation("pool.liquidity")}
															</MenuItem>
															<MenuItem
																color={theme.text.mono}
																_hover={{ bgColor: theme.bg.neutralGray }}
																onClick={() => setSortType("volume")}
																borderRadius="md"
																_active={{}}
																bgColor={
																	sortType === "volume"
																		? theme.bg.menuLinksGray
																		: "transparent !important"
																}
															>
																{translation("positionCard.volume")}
															</MenuItem>
															<MenuItem
																color={theme.text.mono}
																_hover={{ bgColor: theme.bg.neutralGray }}
																onClick={() => setSortType("apr")}
																borderRadius="md"
																_active={{}}
																bgColor={
																	sortType === "apr"
																		? theme.bg.menuLinksGray
																		: "transparent !important"
																}
															>
																APR
															</MenuItem>
															<MenuItem
																color={theme.text.mono}
																_hover={{ bgColor: theme.bg.neutralGray }}
																onClick={() => setSortType("your-pools")}
																borderRadius="md"
																_active={{}}
																bgColor={
																	sortType === "your-pools"
																		? theme.bg.menuLinksGray
																		: "transparent !important"
																}
															>
																{translation("pool.yourPools")}
															</MenuItem>
														</MenuList>
													</Menu>
												)}
											</Flex>
										</Flex>
									</Flex>
								)}
							</Collapse>
						</Flex>
					</SlideFade>
					<Collapse in={!isConnected}>
						{!isConnected && (
							<Flex
								w="100%"
								mt={["3rem", "3rem", "4rem", "4rem"]}
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
								mb={["3rem", "3rem", "4rem", "4rem"]}
							>
								<Text
									fontSize={["sm", "sm", "md", "md"]}
									fontWeight="normal"
									textAlign="center"
								>
									{translation("pool.connectWalletToView")}
								</Text>
							</Flex>
						)}
					</Collapse>
					<Collapse
						in={
							isConnected &&
							!isLoading &&
							searchTokens?.length !== 0 &&
							!notFound
						}
					>
						{isConnected &&
							!isLoading &&
							searchTokens?.length !== 0 &&
							!notFound && (
								<Flex
									flexWrap="wrap"
									gap="7"
									zIndex="1"
									mt="10"
									justifyContent={["center", "center", "unset", "unset"]}
								>
									{searchTokens?.map(pair => (
										<PoolCards
											key={pair.liquidityToken.address}
											setIsCreate={setIsCreate}
											pair={pair}
											userTokens={userTokensBalance}
											setSelectedToken={setSelectedToken}
											setCurrPair={setCurrPair}
											setSliderValue={setSliderValue}
											setDepositedTokens={setDepositedTokens}
											setPoolPercentShare={setPoolPercentShare}
											setUserPoolBalance={setUserPoolBalance}
											pairInfo={pairInfo}
										/>
									))}
								</Flex>
							)}
					</Collapse>
					<Collapse in={isConnected && notFound && !isLoading}>
						{isConnected && notFound && !isLoading && (
							<Flex
								flexWrap="wrap"
								gap="7"
								zIndex="1"
								mt="10"
								justifyContent={["center", "center", "unset", "unset"]}
							>
								<Flex
									w="100%"
									mt={["3rem", "3rem", "4rem", "4rem"]}
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
									gap="16"
								>
									<Text
										fontSize={["sm", "sm", "md", "md"]}
										fontWeight="normal"
										textAlign="center"
									>
										{translation("pool.unavailable")}
									</Text>
								</Flex>
							</Flex>
						)}
					</Collapse>

					<Collapse in={isConnected && !notFound && isLoading}>
						{isConnected && !notFound && isLoading && (
							<Flex
								flexWrap="wrap"
								gap="7"
								zIndex="1"
								mt="10"
								justifyContent={["center", "center", "unset", "unset"]}
							>
								<Flex
									w="100%"
									mt={["3rem", "3rem", "4rem", "-1rem"]}
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
									gap="16"
								>
									<Flex
										className="circleLoading"
										width="3.75rem !important"
										height="3.75rem !important"
										id={
											colorMode === "dark"
												? "pendingTransactionsDark"
												: "pendingTransactionsLight"
										}
									/>
								</Flex>
							</Flex>
						)}
					</Collapse>
				</Flex>
			</Flex>
		</Flex>
	);
};
