import { Flex, useColorMode, Text, Image, Button } from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { usePicasso, useModal, useTokens } from "hooks";
import { usePaginator } from "chakra-paginator";
import { useTranslation } from "react-i18next";
import {
	AddLiquidityModal,
	LoadingTransition,
	RemoveLiquidity,
} from "components/Modals";
import { usePortfolio } from "hooks/usePortfolio";
import { Pair } from "@pollum-io/pegasys-sdk";
import { formattedPercent } from "utils";
import { IDeposited, WrappedTokenInfo } from "types";
import { PaginationComponent } from "./Pagination";
import { handlePaginate } from "./HandlePaginate";

export const LiquidityCards: React.FunctionComponent = () => {
	const theme = usePicasso();
	const { colorMode } = useColorMode();
	const [isCreate, setIsCreate] = useState(false);
	const [haveValue] = useState(false);
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [currPair, setCurrPair] = useState<Pair>();
	const [sliderValue, setSliderValue] = useState<number>(0);
	const [depositedTokens, setDepositedTokens] = useState<IDeposited>();
	const [poolPercentShare, setPoolPercentShare] = useState<string>("");
	const [userPoolBalance, setUserPoolBalance] = useState<string>("");
	const [currentLpAddress, setCurrentLpAddress] = useState<string>("");
	const { userTokensBalance } = useTokens();
	const {
		onOpenAddLiquidity,
		onOpenRemoveLiquidity,
		isOpenAddLiquidity,
		onCloseAddLiquidity,
		isOpenRemoveLiquidity,
		onCloseRemoveLiquidity,
		onOpenTransaction,
		onCloseTransaction,
		isOpenTransaction,
	} = useModal();
	const {
		liquidityPosition,
		pairs,
		getPoolPercentShare,
		getDepositedTokens,
		pairsData,
	} = usePortfolio();
	const quantityPerPage = 2;
	const { t: translation } = useTranslation();

	const quantityOfPages = Math.ceil(
		liquidityPosition.positions.length / quantityPerPage
	);

	const [cardsSliced, setCardsSliced] = useState<any[]>([]);

	const { currentPage, setCurrentPage } = usePaginator({
		initialState: { currentPage: 1 },
	});

	const poolShareVerify = (value: any) => {
		if (value < 0.01) {
			return "< 0.01%";
		}
		return `${value}%`;
	};

	useMemo(() => {
		handlePaginate(
			liquidityPosition.positions,
			quantityPerPage,
			currentPage,
			setCardsSliced as React.Dispatch<React.SetStateAction<any>>
		);
	}, [currentPage, liquidityPosition.positions]);

	useEffect(() => {
		const getInfos = async () => {
			if (currPair) {
				const poolShare = await getPoolPercentShare(currPair);
				const [token0Deposited, token1Deposited] = await getDepositedTokens(
					currPair
				);

				setPoolPercentShare(poolShare);
				setDepositedTokens({
					token0: token0Deposited,
					token1: token1Deposited,
				});
				setCurrentLpAddress(currPair.liquidityToken.address);
			}
		};
		getInfos();
	}, [currPair]);

	return (
		// eslint-disable-next-line
		<>
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
				lpAddress={`${currentLpAddress}`}
			/>
			<LoadingTransition
				isOpen={isOpenTransaction}
				onClose={onCloseTransaction}
			/>
			{cardsSliced?.map(cardsValue => {
				const symbol0 =
					cardsValue.symbol0 === "WSYS"
						? "SYS"
						: cardsValue.symbol0 === "ETH"
						? "WETH"
						: cardsValue.symbol0;
				const symbol1 =
					cardsValue.symbol1 === "WSYS"
						? "SYS"
						: cardsValue.symbol1 === "ETH"
						? "WETH"
						: cardsValue.symbol1;

				const currentDayVolume =
					parseFloat(
						`${pairsData?.allDays?.[`${symbol0}-${symbol1}`]?.volumeUSD}`
					) -
					parseFloat(
						`${pairsData?.oneDay?.[`${symbol0}-${symbol1}`]?.volumeUSD}`
					);

				const apr =
					pairsData?.oneDay?.[`${symbol0}-${symbol1}`] &&
					pairsData?.allDays?.[`${symbol0}-${symbol1}`] &&
					formattedPercent(
						`${currentDayVolume}`,
						`${
							Number(
								pairsData.allDays?.[`${symbol0}-${symbol1}`]?.trackedReserveSYS
							) * pairsData.sysPrice
						}`
					);
				return (
					<Flex
						key={cardsValue.id}
						flexDirection={["column", "column", "row", "row"]}
						justifyContent="center"
						w="100%"
						px={["1.5rem", "2rem", "2.5rem", "8rem"]}
						h="max-content"
					>
						<Flex
							display={["flex", "none", "none", "none"]}
							bgColor={theme.bg.poolShare}
							borderTopRadius="12px"
							w="max-content"
							h="2rem"
							pt="0.15rem"
							px="2"
							fontSize="0.75rem"
							fontWeight="normal"
							position="relative"
							bottom="-0.65rem"
						>
							Pool Share {poolShareVerify(cardsValue.poolShare)}
						</Flex>

						<Flex
							zIndex="0"
							gap={["2", "2", "0", "0"]}
							flexDirection={["column", "column", "row", "row"]}
							w="100%"
							background={
								colorMode === "light"
									? `linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(350.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 100%) border-box`
									: theme.bg.blackAlpha
							}
							pl={["4", "6", "6", "6"]}
							pr={["1", "5", "0", "0"]}
							py={["2", "3", "3", "3"]}
							border="1px solid transparent"
							borderRadius="0.75rem"
							position="relative"
						>
							<Flex
								flexDirection="row"
								alignItems={["flex-start", "flex-start", "center", "center"]}
								justifyContent="space-between"
								color={theme.text.mono}
								w={["100%", "100%", "", "90%"]}
							>
								<Flex
									gap={["1", "2", "0", "0"]}
									alignItems={["flex-start", "flex-start", "center", "center"]}
									w={["85%", "58%", "32%", "29.2%"]}
									h="100%"
									flexDirection={["column", "column", "row", "row"]}
								>
									<Flex
										flexDirection="row"
										alignItems={["center", "center", "center", "center"]}
										gap={["3", "3", "9", "9"]}
									>
										<Flex position="relative">
											<Image
												alt={`https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/logos/${cardsValue.addressToken0}/logo.png`}
												src={`https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/logos/${cardsValue.addressToken0}/logo.png`}
												h="9"
												w="9"
											/>
											<Image
												alt={`https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/logos/${cardsValue.addressToken1}/logo.png`}
												src={`https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/logos/${cardsValue.addressToken1}/logo.png`}
												h="9"
												w="9"
												position="absolute"
												left="1.8rem"
											/>
										</Flex>
										<Flex
											flexDirection={["column", "column", "row", "row"]}
											ml={["1.7rem", "1.7rem", "0", "0"]}
										>
											<Text
												fontWeight="bold"
												fontSize={[
													"0.875rem",
													"0.875rem",
													"0.875rem",
													"0.875rem",
												]}
											>
												{cardsValue.symbol0}/{cardsValue.symbol1}
											</Text>

											<Text
												fontSize={["0.875rem", "0.875rem", "0", "0"]}
												display={["flex", "flex", "none", "none"]}
											>
												{translation("portfolioPage.value")} {cardsValue.value}
											</Text>
										</Flex>
									</Flex>
									<Flex
										flexDirection="column"
										fontSize={["0.75rem", "0.75rem", "0.875rem", "0.875rem"]}
										display={["flex", "flex", "none", "none"]}
										pt="2"
									>
										<Flex
											flexDirection={["column", "column", "column", "column"]}
											w="max-content"
										>
											<Text
												fontWeight="500"
												fontSize={[
													"0.75rem",
													"0.875rem",
													"0.875rem",
													"0.875rem",
												]}
											>
												Pooled Tokens
											</Text>
											<Flex flexDirection="row" gap="2">
												<Text
													fontSize={[
														"0.75rem",
														"0.875rem",
														"0.875rem",
														"0.875rem",
													]}
												>
													{cardsValue.symbol0}: {cardsValue.reserve0.toFixed(4)}
												</Text>
												<Text
													fontSize={[
														"0.75rem",
														"0.875rem",
														"0.875rem",
														"0.875rem",
													]}
												>
													{cardsValue.symbol1}: {cardsValue.reserve1.toFixed(4)}
												</Text>
											</Flex>
										</Flex>
									</Flex>
								</Flex>
								<Flex
									flexDirection={["column", "row", "row", "row"]}
									alignContent={["flex-end", "flex-start", "normal", "normal"]}
									alignItems={["flex-end", "center", "center", "center"]}
									w={["20%", "45%", "68%", "73.2%"]}
									justifyContent={[
										"flex-start",
										"space-between",
										"space-between",
										"space-between",
									]}
									h={["2.4rem", "2.3rem", "max-content", "max-content"]}
									pr={["0", "0", "0.7rem", "2.2rem"]}
								>
									<Flex
										flexDirection="column"
										fontSize={["0.75rem", "0.75rem", "0.875rem", "0.875rem"]}
										display={["none", "none", "flex", "flex"]}
									>
										<Flex
											flexDirection={["column", "row", "column", "column"]}
											gap={["2", "3", "0", "0"]}
											w={["", "18rem", "9rem", "9rem"]}
										>
											<Text
												fontSize={[
													"0.75rem",
													"0.75rem",
													"0.875rem",
													"0.875rem",
												]}
											>
												{cardsValue.symbol0}: {cardsValue.reserve0.toFixed(4)}
											</Text>
											<Text
												fontSize={[
													"0.75rem",
													"0.75rem",
													"0.875rem",
													"0.875rem",
												]}
											>
												{cardsValue.symbol1}: {cardsValue.reserve1.toFixed(4)}
											</Text>
										</Flex>
									</Flex>
									<Flex
										justifyContent="flex-start"
										w="6rem"
										display={["none", "none", "flex", "flex"]}
									>
										<Text fontSize="0.875rem">
											${cardsValue.valueUSD.toFixed(2)}
										</Text>
									</Flex>

									<Flex
										order={[0, 1, 0, 0]}
										justifyContent={[
											"",
											"space-between",
											"space-between",
											"space-between",
										]}
										flexDirection={["column", "column", "row", "row"]}
										w="3rem"
										alignItems={[
											"flex-start",
											"flex-start",
											"center",
											"center",
										]}
										h="100%"
										color={[
											theme.text.cyanPurple,
											theme.text.cyanPurple,
											theme.text.mono,
											theme.text.mono,
										]}
									>
										<Text fontSize="0.875rem">{apr}</Text>
										<Text
											display={["flex", "flex", "none", "none"]}
											fontSize="0.875rem"
										>
											APR
										</Text>
									</Flex>
									<Flex
										alignItems={[
											"flex-start",
											"flex-start",
											"normal",
											"normal",
										]}
										justifyContent="space-between"
										flexDirection="column"
										w="5rem"
										h="100%"
										color={theme.text.mono}
									>
										<Text
											order={[0, 1, 0, 0]}
											display={["none", "flex", "none", "none"]}
											fontSize="0.875rem"
										>
											Pool Share
										</Text>

										<Text
											fontSize={["0.75rem", "0.875rem", "0.875rem", "0.875rem"]}
											display={["none", "flex", "flex", "flex"]}
										>
											{poolShareVerify(cardsValue.poolShare)}
										</Text>
									</Flex>
								</Flex>
							</Flex>
							<Flex
								gap={["3", "3", "2", "2"]}
								mt={["0.5rem", "0.5rem", "0", "0"]}
								justifyContent={["center", "center", "flex-start", "normal"]}
								flexDirection={["row", "row", "column", "column"]}
								alignItems={["center", "center", "center", "flex-end"]}
								w={["100%", "100%", "15%", "12%"]}
								pl={["0", "6", "0", "0"]}
								pr={["3", "5", "3", "2%"]}
							>
								<Button
									justifyContent="center"
									w={["50%", "50%", "85%", "5.6rem"]}
									h="max-content"
									py={["1", "1.5", "1", "1"]}
									px="10%"
									border="1px solid"
									borderRadius="67px"
									bgColor="transparent"
									borderColor={theme.text.cyanPurple}
									color={theme.text.whitePurple}
									fontSize="0.75rem"
									fontWeight="semibold"
									_hover={{
										borderColor: theme.text.cyanLightPurple,
										color: theme.text.cyanLightPurple,
									}}
									onClick={() => {
										setSelectedToken([
											userTokensBalance.find(token => {
												if (cardsValue.symbol0 === "ETH") {
													return token?.symbol === "WETH";
												}
												return token?.symbol === cardsValue.symbol0;
											}) as WrappedTokenInfo,
											userTokensBalance.find(token => {
												if (cardsValue.symbol1 === "ETH") {
													return token?.symbol === "WETH";
												}
												return token?.symbol === cardsValue.symbol1;
											}) as WrappedTokenInfo,
										]);
										setCurrPair(
											pairs.find(
												pair =>
													pair.token0.symbol === cardsValue.symbol0 &&
													pair.token1.symbol === cardsValue.symbol1
											)
										);
										onOpenRemoveLiquidity();
									}}
								>
									{translation("removeLiquidity.remove")}
								</Button>
								<Button
									w={["50%", "50%", "85%", "5.6rem"]}
									h="max-content"
									py={["1", "1.5", "1", "1"]}
									px="20%"
									border="1px solid transparent"
									borderRadius="67px"
									bgColor={theme.bg.blueNavyLightness}
									color={theme.text.cyan}
									fontSize="0.75rem"
									fontWeight="semibold"
									_hover={{
										bgColor: theme.bg.bluePurple,
									}}
									onClick={() => {
										setIsCreate(false);
										setSelectedToken([
											userTokensBalance.find(token => {
												if (cardsValue.symbol0 === "ETH") {
													return token?.symbol === "WETH";
												}
												return token?.symbol === cardsValue.symbol0;
											}) as WrappedTokenInfo,
											userTokensBalance.find(token => {
												if (cardsValue.symbol1 === "ETH") {
													return token?.symbol === "WETH";
												}
												return token?.symbol === cardsValue.symbol1;
											}) as WrappedTokenInfo,
										]);
										setCurrPair(
											pairs.find(
												pair =>
													pair.token0.symbol === cardsValue.symbol0 &&
													pair.token1.symbol === cardsValue.symbol1
											)
										);
										onOpenAddLiquidity();
									}}
								>
									{translation("vote.add")}
								</Button>
							</Flex>
						</Flex>
					</Flex>
				);
			})}
			<PaginationComponent
				quantityOfPages={quantityOfPages}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</>
	);
};
