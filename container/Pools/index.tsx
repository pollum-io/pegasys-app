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
} from "@chakra-ui/react";
import { ChainId, Pair, Token } from "@pollum-io/pegasys-sdk";
import { PAIRS_CURRENT, PAIR_DATA, pegasysClient } from "apollo";
import {
	AddLiquidityModal,
	ImportPoolModal,
	LoadingTransition,
	RemoveLiquidity,
} from "components";
import { PoolCards } from "components/Pools/PoolCards";
import { usePicasso, useModal, useWallet, useTokens, usePairs } from "hooks";
import { NextPage } from "next";
import { ChangeEvent, useMemo, useState } from "react";
import { MdExpandMore, MdOutlineCallMade, MdSearch } from "react-icons/md";
import {
	WrappedTokenInfo,
	IDeposited,
	ICommonPairs,
	IPoolsApr,
	IPoolsWithLiquidity,
	IPoolsLiquidity,
	IPoolsVolume,
} from "types";
import {
	getTokenPairs,
	toV2LiquidityToken,
	unwrappedToken,
	getBlocksFromTimestamps,
} from "utils";

export const PoolsContainer: NextPage = () => {
	const theme = usePicasso();
	const {
		isOpenImportPool,
		onCloseImportPool,
		isOpenRemoveLiquidity,
		onCloseRemoveLiquidity,
		onOpenAddLiquidity,
		isOpenAddLiquidity,
		onCloseAddLiquidity,
		isOpenTransaction,
		onOpenTransaction,
		onCloseTransaction,
	} = useModal();

	const { colorMode } = useColorMode();

	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const [isCreate, setIsCreate] = useState(false);
	const [haveValue] = useState(false);
	const { isConnected, currentNetworkChainId, walletAddress, provider } =
		useWallet();
	const { userTokensBalance } = useTokens();
	const [userHavePool] = useState(true);
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [lpPairs, setLpPairs] = useState<Pair[]>([]);
	const [currPair, setCurrPair] = useState<Pair>();
	const [sliderValue, setSliderValue] = useState<number>(0);
	const [depositedTokens, setDepositedTokens] = useState<IDeposited>();
	const [poolPercentShare, setPoolPercentShare] = useState<string>("");
	const [userPoolBalance, setUserPoolBalance] = useState<string>("");
	const [sortType, setSortType] = useState<string>("");
	const [searchTokens, setSearchTokens] = useState<Pair[]>([]);
	const [poolsApr, setPoolsApr] = useState<IPoolsApr>();
	const [poolsWithLiquidity, setPoolsWithLiquidity] =
		useState<IPoolsWithLiquidity>();
	const [poolsLiquidity, setPoolsLiquidity] = useState<IPoolsLiquidity>();
	const [poolsVolume, setPoolsVolume] = useState<IPoolsVolume>();
	const [pairInfo, setPairInfo] = useState<ICommonPairs>();
	const [notFound, setNotFound] = useState<boolean>(false);

	const chainId =
		currentNetworkChainId === 57 ? ChainId.NEVM : ChainId.TANENBAUM;

	const sortTypeName =
		sortType === "liquidity"
			? "Liquidity"
			: sortType === "apr"
			? "APR"
			: sortType === "your-pools"
			? "Your Pools"
			: "Volume";

	useMemo(async () => {
		const allTokens = getTokenPairs(currentNetworkChainId, userTokensBalance);

		const walletInfos = {
			chainId,
			provider,
			walletAddress,
		};

		const [{ number: oneDay }, { number: twoDays }] =
			await getBlocksFromTimestamps();

		const tokensWithLiquidity = allTokens.map(tokens => ({
			liquidityToken: toV2LiquidityToken(
				tokens as [WrappedTokenInfo, Token],
				chainId
			),
			tokens: tokens as [WrappedTokenInfo, Token],
		}));

		const fetchPairs = await pegasysClient.query({
			query: PAIRS_CURRENT,
			fetchPolicy: "cache-first",
		});

		const fetchPairsAddresses = await Promise.all([fetchPairs]);

		const pairAddresses = fetchPairsAddresses[0]?.data?.pairs;

		const oneDayPairInfos = await Promise.all(
			pairAddresses.map(async (token: { id: string }) => {
				const volume = await pegasysClient.query({
					query: PAIR_DATA(token.id, Number(oneDay)),
					fetchPolicy: "network-only",
				});

				return volume.data.pairs[0];
			})
		);

		const formattedOneDayPairsInfo = oneDayPairInfos.reduce(
			(acc, curr) => ({
				...acc,
				[`${curr.token0.symbol}-${curr.token1.symbol}`]: curr,
			}),
			{}
		);

		const twoDaysPairInfos = await Promise.all(
			pairAddresses.map(async (token: { id: string }) => {
				const volume = await pegasysClient.query({
					query: PAIR_DATA(token.id, twoDays),
					fetchPolicy: "network-only",
				});

				return volume.data.pairs[0];
			})
		);

		const formattedTwoDaysPairsInfo = twoDaysPairInfos.reduce(
			(acc, curr) => ({
				...acc,
				[`${curr.token0.symbol}-${curr.token1.symbol}`]: curr,
			}),
			{}
		);

		const generalPairInfos = await Promise.all(
			pairAddresses.map(async (token: { id: string }) => {
				const volume = await pegasysClient.query({
					query: PAIR_DATA(token.id),
					fetchPolicy: "network-only",
				});

				return volume.data.pairs[0];
			})
		);

		const formattedGeneralPairsInfo = generalPairInfos.reduce(
			(acc, curr) => ({
				...acc,
				[`${curr.token0.symbol}-${curr.token1.symbol}`]: curr,
			}),
			{}
		);

		const oneDayCommonPairs = allTokens
			.map(
				currency =>
					formattedOneDayPairsInfo[
						`${
							currency[0].symbol === "WETH"
								? "ETH"
								: currency[0].symbol === "SYS"
								? "WSYS"
								: currency[0].symbol
						}-${currency[1].symbol === "WETH" ? "ETH" : currency[1].symbol}`
					]
			)
			.filter(item => item !== undefined);

		const twoDaysCommonPairs = allTokens
			.map(
				currency =>
					formattedTwoDaysPairsInfo[
						`${
							currency[0].symbol === "WETH"
								? "ETH"
								: currency[0].symbol === "SYS"
								? "WSYS"
								: currency[0].symbol
						}-${currency[1].symbol === "WETH" ? "ETH" : currency[1].symbol}`
					]
			)
			.filter(item => item !== undefined);

		const generalDaysCommonPairs = allTokens
			.map(
				currency =>
					formattedGeneralPairsInfo[
						`${
							currency[0].symbol === "WETH"
								? "ETH"
								: currency[0].symbol === "SYS"
								? "WSYS"
								: currency[0].symbol
						}-${currency[1].symbol === "WETH" ? "ETH" : currency[1].symbol}`
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
	}, [userTokensBalance]);

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

	useMemo(() => {
		if (
			searchTokens.length !== 0 &&
			poolsWithLiquidity &&
			poolsApr &&
			poolsLiquidity &&
			poolsVolume
		) {
			setTimeout(() => {
				setSortType("your-pools");
			}, 2300);
		}
	}, [searchTokens, poolsWithLiquidity, poolsApr, poolsLiquidity, poolsVolume]);

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
				setIsCreate={setIsCreate}
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
			<ImportPoolModal
				isModalOpen={isOpenImportPool}
				onModalClose={onCloseImportPool}
			/>
			<LoadingTransition
				isOpen={isOpenTransaction}
				onClose={onCloseTransaction}
			/>
			<Flex alignItems="flex-start" justifyContent="center" mb="6.2rem">
				<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
					<Flex
						flexDirection="column"
						zIndex="docked"
						position="relative"
						borderRadius="xl"
						backgroundColor={
							walletAddress ? theme.bg.alphaPurple : "transparent"
						}
					>
						<Img
							borderRadius="xl"
							src={isMobile ? theme.bg.poolsBannerMobile : theme.bg.poolsBanner}
							position="absolute"
							zIndex="base"
							w="100%"
							h="85%"
						/>
						<Flex
							zIndex="docked"
							flexDirection="column"
							px="1.625rem"
							py={["0.8rem", "1.375rem", "1.375rem", "1.375rem"]}
							gap="3"
							h={["9rem", "10rem", "10rem", "10rem"]}
							color="white"
						>
							<Text fontWeight="bold" fontSize="md">
								Liquidity Provider Rewards
							</Text>
							<Text
								color="white"
								fontWeight="medium"
								fontSize="sm"
								lineHeight="shorter"
								w={["100%", "70%", "60%", "60%"]}
							>
								Liquidity providers earn a 0.25% fee on all trades proportional
								to their share of the pool. Fees are added to the pool, accrue
								in real time and can be claimed by withdrawing your liquidity.
							</Text>
						</Flex>
						{walletAddress && (
							<Flex
								alignItems="center"
								justifyContent="center"
								flexDirection="row"
								bgColor={theme.bg.alphaPurple}
								zIndex="0"
								position="relative"
								top="2"
								borderBottomRadius="xl"
								py="0.531rem"
								gap="2.5"
								cursor="pointer"
								onClick={() =>
									window.open(
										`https://info.pegasys.finance/account/${walletAddress}`
									)
								}
							>
								<Text fontWeight="medium" fontSize="xs" color="white">
									View Your Staked Liquidity
								</Text>
								<MdOutlineCallMade size={18} color="white" />
							</Flex>
						)}
					</Flex>
					<Flex
						id="a"
						alignItems={["flex-start", "flex-start", "baseline", "baseline"]}
						my={["1", "4", "8", "8"]}
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
								Pools Overview
							</Text>
						</Flex>
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
									: ["space-between", "space-between", "flex-end", "flex-end"]
							}
							flexDirection={["column-reverse", "column-reverse", "row", "row"]}
							zIndex="docked"
							w="100%"
							mt={["4", "6", "2", "2"]}
							gap={["7", "none", "none", "none"]}
							alignItems={["flex-start", "flex-start", "flex-end", "flex-end"]}
						>
							<Flex display={userHavePool && isConnected ? "flex" : "none"}>
								<InputGroup alignItems="center">
									<InputLeftElement
										pl="0.625rem"
										pointerEvents="none"
										pb="0.3rem"
										// eslint-disable-next-line react/no-children-prop
										children={
											<MdSearch color={theme.icon.inputSearchIcon} size={20} />
										}
									/>
									<Input
										borderColor={theme.bg.blueNavyLightness}
										placeholder="Search by token name"
										_placeholder={{
											opacity: 1,
											color: theme.text.inputBluePurple,
										}}
										onChange={handleInput}
										borderRadius="full"
										w={["18.5rem", "27rem", "20rem", "20rem"]}
										h="2.2rem"
										py={["0.2rem", "0.2rem", "1", "1"]}
										pl="10"
										_focus={{ outline: "none" }}
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
											<Text fontSize="sm" pb="2">
												Sort by
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
												{!sortType ? "Your Pools" : sortTypeName}
											</MenuButton>
											<MenuList
												bgColor={theme.bg.blueNavy}
												color="white"
												borderColor="transparent"
												p="4"
												fontSize="sm"
											>
												<MenuItem
													color={theme.text.mono}
													_hover={{ bgColor: theme.bg.neutralGray }}
													onClick={() => setSortType("liquidity")}
												>
													Liquidity
												</MenuItem>
												<MenuItem
													color={theme.text.mono}
													_hover={{ bgColor: theme.bg.neutralGray }}
													onClick={() => setSortType("volume")}
												>
													Volume
												</MenuItem>
												<MenuItem
													color={theme.text.mono}
													_hover={{ bgColor: theme.bg.neutralGray }}
													onClick={() => setSortType("apr")}
												>
													APR
												</MenuItem>
												<MenuItem
													color={theme.text.mono}
													_hover={{ bgColor: theme.bg.neutralGray }}
													onClick={() => setSortType("your-pools")}
												>
													Your Pools
												</MenuItem>
											</MenuList>
										</Menu>
									)}
								</Flex>
							</Flex>
						</Flex>
					</Flex>
					{!isConnected ? (
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
								Please connect your wallet in the button bellow to be able to
								view your liquidity.
							</Text>
						</Flex>
					) : (
						<Flex
							flexWrap="wrap"
							gap="7"
							zIndex="1"
							mt="10"
							justifyContent={["center", "center", "unset", "unset"]}
						>
							{searchTokens?.length !== 0 && !notFound ? (
								searchTokens?.map(pair => (
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
										setPoolsApr={setPoolsApr}
										setPoolsWithLiquidity={setPoolsWithLiquidity}
										setPoolsLiquidity={setPoolsLiquidity}
										setPoolsVolume={setPoolsVolume}
										pairInfo={pairInfo}
									/>
								))
							) : notFound ? (
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
										Unavailable liquidity tokens.
									</Text>
								</Flex>
							) : (
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
										width="60px !important"
										height="60px !important"
										id={
											colorMode === "dark"
												? "pendingTransactionsDark"
												: "pendingTransactionsLight"
										}
									/>
								</Flex>
							)}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
