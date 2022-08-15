import {
	Button,
	ButtonProps,
	Flex,
	Icon,
	Img,
	Input,
	Text,
} from "@chakra-ui/react";
import {
	useModal,
	usePicasso,
	useTokens,
	useWallet,
	UseDerivedSwapInfo,
	useApproveCallbackFromTrade,
	UseSwapCallback,
	useToasty,
} from "hooks";
import React, { FunctionComponent, useEffect, useState, useMemo } from "react";
import { MdWifiProtectedSetup, MdHelpOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { ChainId, JSBI, Token, Trade } from "@pollum-io/pegasys-sdk";
import {
	ISwapTokenInputValue,
	IWalletHookInfos,
	WrappedTokenInfo,
	IInputValues,
	IChartComponentData,
	IReturnedTradeValues,
	IChartComponentPeriod,
} from "types";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { Signer } from "ethers";
import {
	computeTradePriceBreakdown,
	truncateNumberDecimalsPlaces,
} from "utils";
import { getTokensGraphCandle } from "services/index";

import { FIFTEEN_MINUTES_IN_SECONDS } from "helpers/consts";
import { OtherWallet } from "./OtherWallet";
import { SwapExpertMode } from "./SwapExpertMode";
import { TradeRouteComponent } from "./TradeRouteComponent";
import { FilterButton } from "./FilterButton";

const ChartComponent = dynamic(() => import("./ChartComponent"), {
	ssr: false,
});

export const Swap: FunctionComponent<ButtonProps> = () => {
	const theme = usePicasso();

	const { t: translation } = useTranslation();
	const { userTokensBalance } = useTokens();
	const { isOpenWallet, onCloseWallet, onOpenCoin, isOpenCoin, onCloseCoin } =
		useModal();

	const {
		isConnected,
		currentNetworkChainId,
		provider,
		signer,
		walletAddress,
		userSlippageTolerance,
		setTransactions,
		transactions,
		setApprovalState,
	} = useWallet();

	const [tokensGraphCandleData, setTokensGraphCandleData] = useState<
		IChartComponentData[]
	>([]);
	const [tokensGraphCandlePeriod, setTokensGraphCandlePeriod] =
		useState<IChartComponentPeriod>({
			id: 2,
			period: FIFTEEN_MINUTES_IN_SECONDS,
		});
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [buttonId, setButtonId] = useState<number>(0);
	const [tokenInputValue, setTokenInputValue] = useState<ISwapTokenInputValue>({
		inputFrom: {
			value: "",
		},
		inputTo: {
			value: "",
		},
		typedValue: "",
		currentInputTyped: "",
		lastInputTyped: undefined,
	});
	const [returnedTradeValue, setReturnedTradeValue] = useState<
		IReturnedTradeValues | undefined
	>(undefined);
	const { toast } = useToasty();

	const walletInfos: IWalletHookInfos = {
		chainId: currentNetworkChainId === 5700 ? ChainId.TANENBAUM : ChainId.NEVM,
		walletAddress,
		provider,
	};

	const swapCall =
		returnedTradeValue?.v2Trade &&
		signer &&
		UseSwapCallback(
			returnedTradeValue?.v2Trade,
			userSlippageTolerance,
			walletInfos,
			signer,
			setTransactions,
			setApprovalState,
			toast,
			transactions
		);

	const userHasSpecifiedInputOutput = Boolean(
		selectedToken[0] &&
			selectedToken[1] &&
			returnedTradeValue?.parsedAmount?.greaterThan(JSBI.BigInt(0))
	);

	const verifyIfHaveInsufficientLiquidity = Boolean(
		!returnedTradeValue?.v2TradeRoute && userHasSpecifiedInputOutput
	);

	const swapButtonValidation = !isConnected ? "Connect Wallet" : "Swap";

	const { priceImpactWithoutFee, priceImpactSeverity } =
		computeTradePriceBreakdown(returnedTradeValue?.v2Trade as Trade);

	const handleOnChangeTokenInputs = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (!isConnected) return;

		const regexPreventLetters = /^(?!,$)[\d,.]+$/;

		const inputValue = event?.currentTarget?.value;

		const typedInput = event?.currentTarget.name;

		if (inputValue === "" || regexPreventLetters.test(inputValue)) {
			const inputFrom: IInputValues = {
				value: typedInput === "inputFrom" ? inputValue : "",
			};

			const inputTo: IInputValues = {
				value: typedInput === "inputTo" ? inputValue : "",
			};

			setTokenInputValue({
				inputFrom,
				inputTo,
				typedValue: inputValue,
				currentInputTyped: typedInput,
				lastInputTyped: typedInput === "inputFrom" ? 0 : 1,
			});
		}
	};

	const switchTokensPosition = () =>
		setSelectedToken(prevState => [...prevState]?.reverse());

	const handleSwapInfo = async () => {
		const { v2Trade, bestSwapMethods, inputErrors, parsedAmount } =
			await UseDerivedSwapInfo(
				selectedToken,
				tokenInputValue,
				walletInfos,
				translation,
				userSlippageTolerance,
				signer as Signer
			);

		setReturnedTradeValue({
			parsedAmount,
			v2Trade,
			bestSwapMethods,
			inputErrors,
			v2TradeRoute: v2Trade?.route?.path,
		});
	};

	useMemo(() => {
		if (!isConnected || !returnedTradeValue?.v2Trade) return;

		const {
			inputTo: { value: inputToValue },
			inputFrom: { value: inputFromValue },
			currentInputTyped,
		} = tokenInputValue;

		const {
			v2Trade: { outputAmount, inputAmount },
		} = returnedTradeValue;

		if (currentInputTyped === "inputFrom") {
			tokenInputValue.inputTo.value = inputFromValue
				? outputAmount?.toSignificant(6)
				: "";
		}

		if (currentInputTyped === "inputTo") {
			tokenInputValue.inputFrom.value = inputToValue
				? inputAmount?.toSignificant(6)
				: "";
		}
	}, [isConnected, returnedTradeValue?.v2Trade]);

	useEffect(() => {
		if (!isConnected) return;

		handleSwapInfo();
	}, [
		isConnected,
		tokenInputValue,
		selectedToken[0]?.address,
		selectedToken[1]?.address,
	]);

	useEffect(() => {
		if (!userTokensBalance) return;

		const getTokensBySymbol = userTokensBalance?.filter(
			token =>
				token?.symbol === "WSYS" ||
				token?.symbol === "SYS" ||
				token?.symbol === "PSYS"
		);

		const setIdToTokens = getTokensBySymbol.map((token, index: number) => ({
			...token,
			id: index,
		})) as WrappedTokenInfo[];

		setSelectedToken(setIdToTokens);
	}, [userTokensBalance]);

	useEffect(() => {
		const defaultTokenValues = userTokensBalance.filter(
			tokens =>
				tokens.symbol === "WSYS" ||
				tokens.symbol === "SYS" ||
				tokens.symbol === "PSYS"
		);

		setSelectedToken([defaultTokenValues[2], defaultTokenValues[1]]);
	}, [userTokensBalance]);

	const approve = useApproveCallbackFromTrade(
		returnedTradeValue?.v2Trade as Trade,
		{
			chainId:
				currentNetworkChainId === 5700 ? ChainId.TANENBAUM : ChainId.NEVM,
			provider,
			walletAddress,
		},
		signer as Signer,
		tokenInputValue,
		setTransactions,
		transactions,
		setApprovalState,
		userSlippageTolerance
	);

	const getTokensGraph = async () => {
		const [tokenA, tokenB]: Token[] = [
			selectedToken[0],
			selectedToken[1],
		] as Token[];

		const [token0, token1] = tokenA?.sortsBefore(tokenB)
			? [tokenA, tokenB]
			: [tokenB, tokenA];

		const requestTokensCandle = await getTokensGraphCandle(
			token0,
			token1,
			tokensGraphCandlePeriod.period
		);

		setTokensGraphCandleData(requestTokensCandle);

		return requestTokensCandle;
	};

	useEffect(() => {
		if (
			!selectedToken[0]?.address ||
			!selectedToken[1]?.address ||
			!tokensGraphCandlePeriod.period
		)
			return;

		getTokensGraph();
	}, [
		selectedToken[0]?.address,
		selectedToken[1]?.address,
		tokensGraphCandlePeriod.period,
	]);

	const submitValidation = [
		isConnected && tokenInputValue.lastInputTyped === 0
			? parseFloat(selectedToken[0]?.tokenInfo?.balance) >=
			  parseFloat(tokenInputValue?.inputFrom?.value)
			: parseFloat(selectedToken[1]?.tokenInfo?.balance) >=
			  parseFloat(tokenInputValue?.inputTo?.value),
	];
	const canSubmit = submitValidation.every(validation => validation === true);

	const { expert } = useWallet();
	const { otherWallet } = useWallet();
	const isOtherWallet = useMemo(() => {
		if (otherWallet) {
			return <OtherWallet />;
		}
		return null;
	}, [otherWallet]);

	const isExpert = useMemo(() => {
		if (expert && isConnected) {
			return <SwapExpertMode />;
		}
		return null;
	}, [expert]);

	return (
		<Flex
			pt={["6", "6", "20", "24"]}
			justifyContent="center"
			fontFamily="inter"
			fontStyle="normal"
			alignItems={{
				base: "center",
				sm: "center",
				md: "center",
				lg: "flex-start",
			}}
			flexDirection={{ base: "column", sm: "column", md: "column", lg: "row" }}
			mb={["6rem", "0"]}
			px={["4", "0", "0", "0"]}
		>
			<SelectWallets isOpen={isOpenWallet} onClose={onCloseWallet} />
			<SelectCoinModal
				isOpen={isOpenCoin}
				onClose={onCloseCoin}
				selectedToken={selectedToken}
				buttonId={buttonId}
				setSelectedToken={setSelectedToken}
			/>
			<Flex alignItems="center" flexDirection="column">
				<Flex
					h="max-content"
					width={[
						"100%", // 0-30em
						"md", // 30em-48em
						"md", // 48em-62em
						"md", // 62em+
					]}
					p="1.5rem"
					flexDirection="column"
					zIndex="1"
					borderRadius={30}
					border="1px solid transparent;"
					boxShadow=" 0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4);"
					background={`linear-gradient(${theme.bg.whiteGray}, ${theme.bg.whiteGray}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
				>
					<Flex flexDirection="row" justifyContent="space-between" pb="1.5rem">
						<Text fontWeight="semibold" fontSize={["xl", "2xl", "2xl", "2xl"]}>
							Swap
						</Text>
					</Flex>
					<Flex
						borderRadius="2xl"
						bgColor={theme.bg.blueNavy}
						flexDirection="column"
						py="1rem"
						px="1.25rem"
						border="1px solid"
						borderColor={
							(tokenInputValue.inputFrom.value > selectedToken[0]?.balance &&
								tokenInputValue.currentInputTyped !== "inputTo") ||
							(isConnected && verifyIfHaveInsufficientLiquidity)
								? theme.text.red400
								: "#ff000000"
						}
						transition="0.7s"
					>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text fontSize="md" fontWeight="500" color={theme.text.mono}>
								From
							</Text>
							<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
								Balance: {selectedToken[0]?.balance}
							</Text>
						</Flex>
						<Flex alignItems="center" justifyContent="space-between">
							<Flex
								alignItems="center"
								id="0"
								borderRadius={12}
								cursor="pointer"
								_hover={{}}
								onClick={(event: React.MouseEvent<HTMLInputElement>) => {
									setButtonId(Number(event.currentTarget.id));
									onOpenCoin();
								}}
							>
								<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
								<Text fontSize="xl" fontWeight="500" px="3">
									{selectedToken[0]?.symbol}
								</Text>
								<Icon as={IoIosArrowDown} />
							</Flex>
							<Input
								fontSize="2xl"
								border="none"
								placeholder="0.00"
								textAlign="right"
								mt="2"
								px={["0.1rem", "1.5", "1.5", "1.5"]}
								ml={["10", "50", "50", "50"]}
								type="text"
								onChange={handleOnChangeTokenInputs}
								name="inputFrom"
								value={tokenInputValue?.inputFrom?.value}
							/>
						</Flex>
					</Flex>
					{tokenInputValue.inputFrom.value > selectedToken[0]?.balance &&
						tokenInputValue.currentInputTyped !== "inputTo" && (
							<Flex flexDirection="row" gap="1" justifyContent="center">
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
									fontWeight="semibold"
								>
									Insufficient {selectedToken[0]?.symbol} balance.
								</Text>
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
								>
									Please insert a valid amount.
								</Text>
							</Flex>
						)}
					{isConnected && verifyIfHaveInsufficientLiquidity && (
						<Flex flexDirection="row" gap="1" justifyContent="center">
							<Text
								fontSize="sm"
								pt="2"
								textAlign="center"
								color={theme.text.red400}
								fontWeight="semibold"
							>
								Insufficient liquidity for this trade.
							</Text>
						</Flex>
					)}
					<Flex
						margin="0 auto"
						py="4"
						onClick={switchTokensPosition}
						_hover={{ cursor: "pointer" }}
					>
						<MdWifiProtectedSetup size={25} color="cyan" />
					</Flex>
					<Flex
						borderRadius="2xl"
						bgColor={theme.bg.blueNavy}
						flexDirection="column"
						py="1rem"
						px="1.25rem"
						border="1px solid"
						borderColor={
							(tokenInputValue.inputTo.value > selectedToken[1]?.balance &&
								tokenInputValue.currentInputTyped !== "inputFrom") ||
							(isConnected && verifyIfHaveInsufficientLiquidity)
								? theme.text.red400
								: "#ff000000"
						}
						transition="0.7s"
					>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text fontSize="md" fontWeight="500" color={theme.text.mono}>
								To
							</Text>
							<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
								Balance: {selectedToken[1]?.balance}
							</Text>
						</Flex>

						<Flex alignItems="center" justifyContent="space-between">
							<Flex
								alignItems="center"
								id="1"
								borderRadius={12}
								cursor="pointer"
								_hover={{}}
								onClick={(event: React.MouseEvent<HTMLInputElement>) => {
									setButtonId(Number(event.currentTarget.id));
									onOpenCoin();
								}}
							>
								<Img src={selectedToken[1]?.logoURI} w="6" h="6" />
								<Text fontSize="xl" fontWeight="500" px="3">
									{selectedToken[1]?.symbol}
								</Text>
								<Icon as={IoIosArrowDown} />
							</Flex>
							<Input
								fontSize="2xl"
								border="none"
								placeholder="0.00"
								textAlign="right"
								mt="2"
								px={["0.1rem", "1.5", "1.5", "1.5"]}
								ml={["50", "50", "50", "50"]}
								type="text"
								onChange={handleOnChangeTokenInputs}
								name="inputTo"
								value={tokenInputValue?.inputTo?.value}
							/>
						</Flex>
					</Flex>
					{tokenInputValue.inputTo.value > selectedToken[1]?.balance &&
						tokenInputValue.currentInputTyped !== "inputFrom" && (
							<Flex flexDirection="row" gap="1" justifyContent="center">
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
									fontWeight="semibold"
								>
									Insufficient {selectedToken[1]?.symbol} balance.
								</Text>
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
								>
									Please insert a valid amount.
								</Text>
							</Flex>
						)}
					{isConnected && verifyIfHaveInsufficientLiquidity && (
						<Flex flexDirection="row" gap="1" justifyContent="center">
							<Text
								fontSize="sm"
								pt="2"
								textAlign="center"
								color={theme.text.red400}
								fontWeight="semibold"
							>
								Insufficient liquidity for this trade.
							</Text>
						</Flex>
					)}
					{tokenInputValue.inputTo.value && tokenInputValue.inputFrom.value && (
						<Flex
							flexDirection="column"
							borderRadius="2xl"
							bgColor="transparent"
							borderWidth="1px"
							borderColor={theme.text.cyan}
							mt="1.5rem"
						>
							<Text fontSize="md" fontWeight="medium" px="1.375rem" py="1rem">
								Price
							</Text>
							<Flex
								flexDirection="row"
								justifyContent="space-around"
								py="1rem"
								px="1rem"
								borderRadius="2xl"
								borderWidth="1px"
								borderColor={theme.text.cyan}
								bgColor={theme.bg.blueNavy}
							>
								<Flex fontSize="sm" flexDirection="column" textAlign="center">
									<Text fontWeight="semibold">
										{returnedTradeValue?.v2Trade
											? returnedTradeValue?.v2Trade?.executionPrice?.toSignificant(
													6
											  )
											: "-"}
									</Text>
									<Text fontWeight="normal">
										{selectedToken[0]?.symbol} per {selectedToken[1]?.symbol}
									</Text>
								</Flex>
								<Flex fontSize="sm" flexDirection="column" textAlign="center">
									<Text fontWeight="semibold">
										{returnedTradeValue?.v2Trade
											? returnedTradeValue?.v2Trade?.executionPrice
													?.invert()
													.toSignificant(6)
											: "-"}
									</Text>
									<Text fontWeight="normal">
										{selectedToken[1]?.symbol} per {selectedToken[0]?.symbol}
									</Text>
								</Flex>
							</Flex>
						</Flex>
					)}
					{isExpert}
					{isExpert && isOtherWallet}
					<Flex>
						{selectedToken[0]?.symbol !== "WSYS" &&
							selectedToken[0]?.symbol !== "SYS" &&
							selectedToken[0]?.symbol !== "PSYS" &&
							isConnected && (
								<Button
									w="50%"
									mt="2rem"
									py="6"
									px="6"
									borderRadius="67px"
									onClick={() => approve()}
									bgColor={theme.bg.button.connectWalletSwap}
									color={theme.text.cyan}
									fontSize="lg"
									fontWeight="semibold"
									disabled={!canSubmit}
								>
									Approve
								</Button>
							)}
						<Button
							w={
								selectedToken[0]?.symbol === "WSYS" ||
								selectedToken[0]?.symbol === "SYS" ||
								selectedToken[0]?.symbol === "PSYS"
									? "100%"
									: "50%"
							}
							mt="2rem"
							py="6"
							px="6"
							borderRadius="67px"
							onClick={() => swapCall?.callback && swapCall.callback()}
							bgColor={theme.bg.button.connectWalletSwap}
							color={theme.text.cyan}
							fontSize="lg"
							fontWeight="semibold"
							disabled={!canSubmit}
						>
							{swapButtonValidation}
						</Button>
					</Flex>
				</Flex>
				{tokenInputValue.inputTo.value && tokenInputValue.inputFrom.value && (
					<Flex
						flexDirection="column"
						p="1.5rem"
						background={theme.bg.blueNavy}
						w="90%"
						borderRadius="xl"
						mt="7"
						mb={["2", "2", "2", "10rem"]}
						zIndex="1"
					>
						<Flex flexDirection="column">
							<Flex flexDirection="row" justifyContent="space-between">
								<Text fontWeight="normal">
									Minmum Received <Icon as={MdHelpOutline} />
								</Text>
								<Text fontWeight="medium">
									{returnedTradeValue?.v2Trade
										? `${returnedTradeValue?.v2Trade?.outputAmount.toSignificant(
												4
										  )} ${
												returnedTradeValue?.v2Trade?.outputAmount?.currency
													.symbol
										  }`
										: "-"}
								</Text>
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Text fontWeight="normal">
									Price Impact <Icon as={MdHelpOutline} />
								</Text>
								<Text fontWeight="medium">
									{returnedTradeValue?.v2Trade
										? `${returnedTradeValue?.v2Trade?.priceImpact?.toSignificant(
												4
										  )}%`
										: "-"}
								</Text>
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Text fontWeight="normal">
									Liquidity Provider Fee <Icon as={MdHelpOutline} />
								</Text>
								<Text fontWeight="medium">-</Text>
							</Flex>
							{tokenInputValue.inputFrom.value &&
								tokenInputValue.inputTo.value &&
								returnedTradeValue?.v2TradeRoute && (
									<Flex flexDirection="column">
										<Flex
											flexDirection="row"
											justifyContent="space-between"
											pt="2rem"
										>
											<Text fontWeight="normal">
												Route <Icon as={MdHelpOutline} />
											</Text>
										</Flex>
										<Flex
											border="1px solid rgba(160, 174, 192, 1)"
											py="2.5"
											px="4"
											borderRadius="xl"
											alignItems="center"
											flexWrap="wrap"
											mt="2"
										>
											<TradeRouteComponent
												transactionRoute={returnedTradeValue?.v2TradeRoute}
											/>
										</Flex>
									</Flex>
								)}
						</Flex>
					</Flex>
				)}
			</Flex>
			<Flex
				h="max-content"
				w={["18rem", "sm", "100%", "xl"]}
				p="1.5rem"
				ml={["0", "0", "0", "10"]}
				mt={["8", "8", "8", "0"]}
				mb={["24", "24", "24", "0"]}
				flexDirection="column"
				zIndex="1"
				borderRadius={30}
				border="1px solid transparent;"
			>
				<Flex
					gap="2"
					justifyContent="center"
					mb="8"
					flexDirection={["column", "row", "row", "row"]}
					alignItems="center"
				>
					<Flex>
						<Img src={selectedToken[0]?.logoURI} w="7" h="7" />
						<Img src={selectedToken[1]?.logoURI} w="7" h="7" />
						<Text fontWeight="bold" fontSize="xl" ml="2.5">
							{selectedToken[0]?.symbol} / {selectedToken[1]?.symbol}
						</Text>
					</Flex>
					<Text pl="2" fontSize="lg">
						${" "}
						{`${
							truncateNumberDecimalsPlaces(
								parseFloat(tokensGraphCandleData[0]?.close)
							) || "0.00"
						}`}
					</Text>
				</Flex>
				<FilterButton
					periodStateValue={tokensGraphCandlePeriod}
					setPeriod={setTokensGraphCandlePeriod}
				/>
				{tokensGraphCandleData.length === 0 ? (
					<Text>
						Candle data not found to this token pair, please try again with
						another tokens.
					</Text>
				) : (
					<ChartComponent data={tokensGraphCandleData} />
				)}
			</Flex>
		</Flex>
	);
};
