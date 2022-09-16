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
} from "@chakra-ui/react";
import { ChainId, Pair, Token } from "@pollum-io/pegasys-sdk";
import { PAIRS_CURRENT, PAIR_DATA, pegasysClient } from "apollo";
import {
	AddLiquidityModal,
	ImportPoolModal,
	RemoveLiquidity,
} from "components";
import { PoolCards } from "components/Pools/PoolCards";
import { usePicasso, useModal, useWallet, useTokens, usePairs } from "hooks";
import { NextPage } from "next";
import { ChangeEvent, useMemo, useState } from "react";
import { MdExpandMore, MdOutlineCallMade, MdSearch } from "react-icons/md";
import {
	WrappedTokenInfo,
	ILiquidityTokens,
	IDeposited,
	IVolumeTokens,
	ICommonPairs,
} from "types";
import {
	getTokenPairs,
	toV2LiquidityToken,
	getBalanceOfSingleCall,
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
	} = useModal();

	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const [isCreate, setIsCreate] = useState(false);
	const [haveValue] = useState(false);
	const {
		isConnected,
		currentNetworkChainId,
		walletAddress,
		signer,
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
	const [sortType, setSortType] = useState<string>("pool-weight");
	const [searchTokens, setSearchTokens] = useState<Pair[]>([]);
	const chainId =
		currentNetworkChainId === 57 ? ChainId.NEVM : ChainId.TANENBAUM;
	const sortTypeName = sortType === "pool-weight" ? "Pool Weight" : "Volume";
	const [pairInfo, setPairInfo] = useState<ICommonPairs>();

	useMemo(async () => {
		const allTokens = getTokenPairs(currentNetworkChainId, userTokensBalance);

		const walletInfos = {
			chainId,
			provider,
			walletAddress,
		};

		const [{ number: b1 }] = await getBlocksFromTimestamps();

		const tokensWithLiquidity = allTokens.map(tokens => ({
			liquidityToken: toV2LiquidityToken(
				tokens as [WrappedTokenInfo, Token],
				chainId
			),
			tokens: tokens as [WrappedTokenInfo, Token],
		}));

		const liquidityTokens = tokensWithLiquidity.map(
			token => token.liquidityToken
		);

		const liquidityTokensDecimals = tokensWithLiquidity.map(
			token => token.liquidityToken?.decimals
		);

		const liquidityBalances = await Promise.all(
			liquidityTokens.map(async (token, index) => {
				const result = await getBalanceOfSingleCall(
					token?.address as string,
					walletAddress,
					signer,
					liquidityTokensDecimals[index] as number
				);
				return { address: token?.address, balance: +result };
			})
		);

		const fetchVolumes = await Promise.all(
			tokensWithLiquidity.map(async token => {
				const volume = await pegasysClient.query({
					query: PAIR_DATA(
						`${Pair.getAddress(token.tokens[0], token.tokens[1], chainId)}`
					),
					fetchPolicy: "cache-first",
				});

				return {
					address: token.liquidityToken?.address,
					volume: volume?.data?.pairs[0]?.volumeUSD || "0",
				};
			})
		);

		const pairsVolume: IVolumeTokens = fetchVolumes.reduce(
			(acc, curr) => ({ ...acc, [`${curr.address}`]: curr }),
			{}
		);

		const fetchPairs = await pegasysClient.query({
			query: PAIRS_CURRENT,
			fetchPolicy: "cache-first",
		});

		const fetchPairsAddresses = await Promise.all([fetchPairs]);

		const pairAdd = fetchPairsAddresses[0]?.data?.pairs;

		const oneDayPairInfos = await Promise.all(
			pairAdd.map(async (token: { id: string }) => {
				const volume = await pegasysClient.query({
					query: PAIR_DATA(token.id, b1),
					fetchPolicy: "cache-first",
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

		const generalPairInfos = await Promise.all(
			pairAdd.map(async (token: { id: string }) => {
				const volume = await pegasysClient.query({
					query: PAIR_DATA(token.id),
					fetchPolicy: "cache-first",
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

		const commonPairs = allTokens
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

		const formattedCommonPairs = commonPairs.reduce(
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

		const formattedLiquidityBalances: ILiquidityTokens = liquidityBalances
			.sort((a, b) => b.balance - a.balance)
			.reduce((acc, curr) => ({ ...acc, [`${curr.address}`]: curr }), {});

		const LPTokensWithBalance = tokensWithLiquidity.sort((a, b) => {
			if (sortType === "pool-weight") {
				return (
					formattedLiquidityBalances[`${b?.liquidityToken?.address}`].balance -
					formattedLiquidityBalances[`${a?.liquidityToken?.address}`].balance
				);
			}
			return (
				pairsVolume[`${b?.liquidityToken?.address}`].volume -
				pairsVolume[`${a?.liquidityToken?.address}`].volume
			);
		});

		// eslint-disable-next-line
		const v2Tokens = await usePairs(
			LPTokensWithBalance.map(({ tokens }) => tokens),
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
			oneDay: formattedCommonPairs,
			general: formattedGeneralPairsInfo,
		});
	}, [userTokensBalance, sortType]);

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
		} else {
			setSearchTokens(lpPairs);
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
			/>
			<ImportPoolModal
				isModalOpen={isOpenImportPool}
				onModalClose={onCloseImportPool}
			/>
			<Flex alignItems="flex-start" justifyContent="center" mb="6.2rem">
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
						>
							<Text fontWeight="medium" fontSize="xs" color="white">
								View Your Staked Liquidity
							</Text>
							<MdOutlineCallMade size={18} color="white" />
						</Flex>
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
											<MdSearch color={theme.icon.searchIcon} size={20} />
										}
									/>
									<Input
										borderColor={theme.bg.blueNavyLightness}
										placeholder="Search by token name"
										_placeholder={{
											opacity: 1,
											color: theme.text.input,
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
									{userHavePool && !isConnected ? (
										<Button
											fontSize="sm"
											fontWeight="semibold"
											py={["0.2rem", "0.2rem", "1", "1"]}
											px={["1.7rem", "1.5rem", "1.5rem", "1.5rem"]}
											size="sm"
											h="2.2rem"
											bgColor={theme.bg.blueNavyLightness}
											color={theme.text.cyan}
											_hover={{
												bgColor: theme.bg.bluePurple,
											}}
											_active={{}}
											onClick={() => {
												setIsCreate(false);
												onOpenAddLiquidity();
											}}
											borderRadius="full"
										>
											Add Liquidity
										</Button>
									) : (
										<Menu>
											<Text fontSize="sm" pb="2">
												Sort by
											</Text>
											<MenuButton
												as={Button}
												fontSize="sm"
												fontWeight="semibold"
												py={["0.2rem", "0.2rem", "1", "1"]}
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
												{sortTypeName}
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
													_hover={{ bgColor: theme.bg.iconBg }}
													onClick={() => setSortType("pool-weight")}
												>
													Pool Weight
												</MenuItem>
												<MenuItem
													color={theme.text.mono}
													_hover={{ bgColor: theme.bg.iconBg }}
													onClick={() => setSortType("volume")}
												>
													Volume
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
							{searchTokens?.length !== 0 ? (
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
										pairInfo={pairInfo}
									/>
								))
							) : (
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
							)}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
