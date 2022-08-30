import {
	Button,
	ButtonProps,
	Collapse,
	Flex,
	Icon,
	Img,
	Input,
	Text,
	Skeleton,
	SkeletonCircle,
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
	ApprovalState,
	UseWrapCallback,
	UseTokensPairSorted,
} from "hooks";
import React, {
	FunctionComponent,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react";
import { MdWifiProtectedSetup, MdHelpOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { ChainId, CurrencyAmount, JSBI, Trade } from "@pollum-io/pegasys-sdk";
import {
	ISwapTokenInputValue,
	IWalletHookInfos,
	WrappedTokenInfo,
	IInputValues,
	IReturnedTradeValues,
	IChartComponentPeriod,
	IChartComponentData,
} from "types";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { Signer } from "ethers";
import { computeTradePriceBreakdown, Field, maxAmountSpend } from "utils";
import { getTokensGraphCandle } from "services/index";

import { ONE_DAY_IN_SECONDS } from "helpers/consts";
import { ConfirmSwap } from "components/Modals/ConfirmSwap";
import { TooltipComponent } from "components/Tooltip/TooltipComponent";
import { OtherWallet } from "./OtherWallet";
import { SwapExpertMode } from "./SwapExpertMode";
import { TradeRouteComponent } from "./TradeRouteComponent";
import { FilterButton } from "./FilterButton";
import { FormattedPriceImpat } from "./FormattedPriceImpact";

const ChartComponent = dynamic(() => import("./ChartComponent"), {
	ssr: false,
});

export const Swap: FunctionComponent<ButtonProps> = () => {
	// HOOKS IMPORTED VALUES //

	const theme = usePicasso();

	const { toast } = useToasty();

	const { t: translation } = useTranslation();

	const { userTokensBalance } = useTokens();

	const {
		isOpenWallet,
		onCloseWallet,
		onOpenCoin,
		isOpenCoin,
		onCloseCoin,
		onOpenConfirmSwap,
		isOpenConfirmSwap,
		onCloseConfirmSwap,
	} = useModal();

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
		approvalState,
		setApprovalSubmitted,
		approvalSubmitted,
		setCurrentTxHash,
		setCurrentInputTokenName,
		expert,
		otherWallet,
	} = useWallet();

	// END HOOKS IMPORTED VALUES

	// SOME INITIAL VALUES FOR REACT STATES //

	const initialTokenInputValue = {
		inputFrom: {
			value: "",
		},
		inputTo: {
			value: "",
		},
		typedValue: "",
		currentInputTyped: "",
		lastInputTyped: undefined,
	};

	const walletInfos: IWalletHookInfos = {
		chainId: currentNetworkChainId === 5700 ? ChainId.TANENBAUM : ChainId.NEVM,
		walletAddress,
		provider,
	};

	// END SOME INITIAL VALUES FOR REACT STATES //

	// REACT STATES //

	const [isLoadingGraphCandles, setIsLoadingGraphCandles] =
		useState<boolean>(false);

	const [tokensGraphCandleData, setTokensGraphCandleData] = useState<
		IChartComponentData[]
	>([]);

	const [tokensGraphCandlePeriod, setTokensGraphCandlePeriod] =
		useState<IChartComponentPeriod>({
			id: 5,
			period: ONE_DAY_IN_SECONDS,
		});

	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);

	const [tokensPairPosition, setTokensPairPosition] = useState<
		WrappedTokenInfo[]
	>([]);

	const [buttonId, setButtonId] = useState<number>(0);

	const [tokenInputValue, setTokenInputValue] = useState<ISwapTokenInputValue>(
		initialTokenInputValue
	);

	const [txType, setTxType] = useState<string>("");

	const [returnedTradeValue, setReturnedTradeValue] = useState<
		IReturnedTradeValues | undefined
	>(undefined);

	const [isSSR, setIsSSR] = useState(true);

	// END REACT STATES //

	// VALIDATIONS AT ALL //

	const isERC20 =
		selectedToken[0]?.symbol !== "SYS" && selectedToken[0]?.symbol !== "PSYS";

	const approveValidation =
		(isERC20 && approvalState.status === ApprovalState.UNKNOWN) ||
		(isERC20 && approvalState.status === ApprovalState.PENDING);

	const isPending = approvalState.status === ApprovalState.PENDING;

	const wrapOrUnwrap = selectedToken[0]?.symbol === "SYS" ? "Wrap" : "Unwrap";

	const submitValidation = [
		isConnected && tokenInputValue.lastInputTyped === 0
			? parseFloat(selectedToken[0]?.tokenInfo?.balance) >=
			  parseFloat(tokenInputValue?.inputFrom?.value)
			: parseFloat(selectedToken[1]?.tokenInfo?.balance) >=
			  parseFloat(tokenInputValue?.inputTo?.value),
	];

	const canSubmit = submitValidation.every(validation => validation === true);

	const wrapValidation = [
		parseFloat(selectedToken[0]?.tokenInfo?.balance) >=
			parseFloat(tokenInputValue?.inputFrom?.value),
		parseFloat(selectedToken[0]?.tokenInfo?.balance) >=
			parseFloat(tokenInputValue?.inputTo?.value),
		parseFloat(selectedToken[1]?.tokenInfo?.balance) >=
			parseFloat(tokenInputValue?.inputTo?.value),
		parseFloat(selectedToken[1]?.tokenInfo?.balance) >=
			parseFloat(tokenInputValue?.inputFrom?.value),
	];

	const canWrap = wrapValidation.some(valid => valid === true);

	const isWrap =
		(selectedToken[0]?.symbol === "SYS" &&
			selectedToken[1]?.symbol === "WSYS") ||
		(selectedToken[0]?.symbol === "WSYS" && selectedToken[1]?.symbol === "SYS");

	const userHasSpecifiedInputOutput = Boolean(
		selectedToken[0] &&
			selectedToken[1] &&
			returnedTradeValue?.parsedAmount?.greaterThan(JSBI.BigInt(0))
	);

	const verifyIfHaveInsufficientLiquidity = Boolean(
		!returnedTradeValue?.v2TradeRoute && userHasSpecifiedInputOutput
	);

	const swapButtonValidation = !isConnected
		? translation("swapPage.connectWallet")
		: translation("swapPage.swap");

	const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
		returnedTradeValue?.currencyBalances[Field.INPUT]
	);
	const preventShowMaxButton = Boolean(
		maxAmountInput && returnedTradeValue?.parsedAmount?.equalTo(maxAmountInput)
	);

	const minimumReceived =
		returnedTradeValue?.isExactIn && returnedTradeValue?.slippageAdjustedAmounts
			? returnedTradeValue?.slippageAdjustedAmounts[
					Field.OUTPUT
			  ]?.toSignificant(4)
			: returnedTradeValue?.slippageAdjustedAmounts &&
			  returnedTradeValue?.slippageAdjustedAmounts[Field.INPUT]?.toSignificant(
					4
			  );
	// END VALIDATIONS AT ALL //

	// HANDLE FUNCTIONALITIES AND HOOKS //

	const handleMaxInput = useCallback(() => {
		setTokenInputValue(prevState => ({
			...prevState,
			inputFrom: {
				value: maxAmountInput?.toExact() as string,
			},
			lastInputTyped: 0,
			currentInputTyped: "inputFrom",
			typedValue: maxAmountInput?.toExact() as string,
		}));
	}, [maxAmountInput]);

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
			setCurrentTxHash,
			setCurrentInputTokenName,
			txType,
			toast,
			transactions
		);

	const { realizedLPFee } = computeTradePriceBreakdown(
		returnedTradeValue?.v2Trade as Trade
	);

	const handleOnChangeTokenInputs = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (!isConnected) return;

		const regexPreventLetters = /^(?!,$)[\d,.]+$/;

		const inputValue = event?.currentTarget?.value;

		const typedInput = event?.currentTarget.name;

		if (inputValue === "" || regexPreventLetters.test(inputValue)) {
			if (!isWrap) {
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
				return;
			}

			const inputFrom: IInputValues = {
				value: typedInput === "inputFrom" ? inputValue : inputValue,
			};

			const inputTo: IInputValues = {
				value: typedInput === "inputTo" ? inputValue : inputValue,
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

	const { execute: onWrap } = UseWrapCallback(
		selectedToken,
		tokenInputValue,
		walletInfos,
		setTransactions,
		transactions,
		setApprovalState,
		setCurrentTxHash,
		signer as Signer
	);

	const handleSwapInfo = async () => {
		const {
			v2Trade,
			bestSwapMethods,
			inputErrors,
			parsedAmount,
			currencyBalances,
			isExactIn,
			slippageAdjustedAmounts,
		} = await UseDerivedSwapInfo(
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
			currencyBalances,
			isExactIn,
			slippageAdjustedAmounts,
		});
	};

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
		setApprovalState,
		setTransactions,
		transactions,
		toast,
		setApprovalSubmitted,
		setCurrentTxHash,
		setCurrentInputTokenName,
		userSlippageTolerance
	);

	const getTokensGraph = async () => {
		const [token0, token1] = UseTokensPairSorted([
			selectedToken[0],
			selectedToken[1],
		]);

		setTokensPairPosition([
			token0 as WrappedTokenInfo,
			token1 as WrappedTokenInfo,
		]);

		const tokensCandleData = await getTokensGraphCandle(
			token0,
			token1,
			setIsLoadingGraphCandles,
			tokensGraphCandlePeriod.period
		);

		setTokensGraphCandleData(tokensCandleData);

		return tokensCandleData;
	};

	// END HANDLE FUNCTIONALITIES AND HOOKS //

	// REACT HOOKS SESSION //

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

		if (!isWrap) {
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
		}
	}, [isConnected, returnedTradeValue?.v2Trade]);

	useEffect(() => {
		if (!isConnected) return;

		handleSwapInfo();
	}, [
		isConnected,
		tokenInputValue?.inputFrom?.value,
		tokenInputValue?.inputTo?.value,
		userSlippageTolerance,
		selectedToken[0]?.address,
		selectedToken[1]?.address,
	]);

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

	useEffect(() => {
		setIsSSR(false);
	}, []);

	if (isSSR) return null;

	// END REACT HOOKS //

	return (
		<Flex
			pt={["6", "6", "16", "16"]}
			justifyContent="center"
			fontFamily="inter"
			fontStyle="normal"
			alignItems={{
				base: "center",
				sm: "center",
				md: "center",
				lg: "flex-start",
			}}
			flexDirection={{
				base: "column",
				sm: "column",
				md: "column",
				lg: "row",
			}}
			mb={["6rem", "0"]}
			px={["4", "0", "0", "0"]}
			zIndex="1"
		>
			<SelectWallets isOpen={isOpenWallet} onClose={onCloseWallet} />
			<SelectCoinModal
				isOpen={isOpenCoin}
				onClose={onCloseCoin}
				selectedToken={selectedToken}
				buttonId={buttonId}
				setSelectedToken={setSelectedToken}
			/>
			<ConfirmSwap
				isOpen={isOpenConfirmSwap}
				onClose={onCloseConfirmSwap}
				selectedTokens={selectedToken}
				txType={txType}
				onTx={
					txType === "swap" || txType === "approve-swap"
						? swapCall?.callback
						: txType === "approve"
						? approve
						: txType === "wrap"
						? onWrap
						: swapCall?.callback
				}
				trade={returnedTradeValue?.v2Trade}
				isWrap={isWrap}
				tokenInputValue={tokenInputValue}
				minimumReceived={minimumReceived}
				liquidityFee={realizedLPFee}
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
					background={`linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
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
							(isConnected &&
								parseFloat(tokenInputValue.inputFrom.value) >
									parseFloat(selectedToken[0]?.balance) &&
								tokenInputValue.currentInputTyped === "inputFrom") ||
							parseFloat(tokenInputValue.inputFrom.value) === 0 ||
							(isConnected && verifyIfHaveInsufficientLiquidity && !isWrap)
								? theme.text.red400
								: "#ff000000"
						}
						transition="0.7s"
					>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text fontSize="md" fontWeight="500" color={theme.text.mono}>
								{translation("swapPage.from")}
							</Text>
							<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
								{translation("header.balance")} {selectedToken[0]?.balance}
							</Text>
						</Flex>
						<Flex alignItems="center" justifyContent="space-between">
							<Flex w="100%" alignItems="center">
								<Flex
									alignItems="center"
									id="0"
									borderRadius={12}
									cursor="pointer"
									onClick={(event: React.MouseEvent<HTMLInputElement>) => {
										setButtonId(Number(event.currentTarget.id));
										onOpenCoin();
									}}
								>
									<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
									<Text
										fontSize="xl"
										fontWeight="500"
										px="3"
										color={theme.text.mono}
									>
										{selectedToken[0]?.symbol}
									</Text>
									<Icon as={IoIosArrowDown} />
								</Flex>

								{isConnected &&
									!preventShowMaxButton &&
									parseFloat(selectedToken[0]?.balance) !== 0 && (
										<Flex ml="8" onClick={() => handleMaxInput()}>
											<Button
												bgColor="rgba(43, 108, 176, .6)"
												px="5"
												color={theme.text.white}
												transition="250ms ease-in-out"
												_hover={{
													backgroundColor: theme.bg.blue600,
												}}
												type="button"
											>
												MAX
											</Button>
										</Flex>
									)}
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
								_focus={{ outline: "none" }}
							/>
						</Flex>
					</Flex>
					{tokenInputValue.currentInputTyped === "inputFrom" && (
						<Flex flexDirection="row" gap="1" justifyContent="center">
							{parseFloat(tokenInputValue.inputFrom.value) >
								parseFloat(selectedToken[0]?.balance) && (
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
									fontWeight="semibold"
								>
									{translation("swapHooks.insufficient")}
									{selectedToken[0]?.symbol}
									{translation("swapHooks.balance")}. Please insert a valid
									amount.
								</Text>
							)}
						</Flex>
					)}
					{parseFloat(tokenInputValue.inputFrom.value) === 0 && (
						<Text
							fontSize="sm"
							pt="2"
							textAlign="center"
							fontWeight="semibold"
							color={theme.text.red400}
						>
							Please insert a valid amount.
						</Text>
					)}
					<Flex
						margin="0 auto"
						py="4"
						onClick={switchTokensPosition}
						_hover={{ cursor: "pointer" }}
					>
						<MdWifiProtectedSetup size={25} color={theme.text.cyanPurple} />
					</Flex>
					<Flex
						borderRadius="2xl"
						bgColor={theme.bg.blueNavy}
						flexDirection="column"
						py="1rem"
						px="1.25rem"
						border="1px solid"
						borderColor={
							isConnected && verifyIfHaveInsufficientLiquidity && !isWrap
								? theme.text.red400
								: "#ff000000"
						}
						transition="0.7s"
					>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text fontSize="md" fontWeight="500" color={theme.text.mono}>
								{translation("swapPage.to")}
							</Text>
							<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
								{translation("header.balance")} {selectedToken[1]?.balance}
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
								_focus={{ outline: "none" }}
							/>
						</Flex>
					</Flex>
					{isConnected && verifyIfHaveInsufficientLiquidity && !isWrap && (
						<Flex flexDirection="row" gap="1" justifyContent="center">
							<Text
								fontSize="sm"
								pt="2"
								textAlign="center"
								color={theme.text.red400}
								fontWeight="semibold"
							>
								{translation("swapPage.insufficientLiquidity")}
							</Text>
						</Flex>
					)}
					<Collapse
						in={
							!!tokenInputValue.inputTo.value &&
							!!tokenInputValue.inputFrom.value &&
							!isWrap
						}
					>
						<Flex
							flexDirection="column"
							borderRadius="2xl"
							borderWidth="1px"
							borderColor={theme.text.cyanPurple}
							mt="1.5rem"
							color={theme.text.mono}
						>
							<Text fontSize="md" fontWeight="medium" px="1.375rem" py="0.5rem">
								{translation("swap.price")}
							</Text>
							<Flex
								flexDirection="row"
								justifyContent="space-around"
								py="0.5rem"
								borderRadius="2xl"
								borderWidth="1px"
								borderColor={theme.text.cyanPurple}
								bgColor={theme.bg.bluePink}
								color={theme.text.mono}
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
					</Collapse>
					{isExpert}
					{isExpert && isOtherWallet}
					{!isERC20 && !isWrap && (
						<Button
							w="100%"
							mt={isExpert ? "1rem" : "2rem"}
							py="6"
							px="6"
							borderRadius="67px"
							onClick={() => {
								onOpenConfirmSwap();
								setTxType("swap");
							}}
							bgColor={theme.bg.button.connectWalletSwap}
							color={theme.text.cyan}
							fontSize="lg"
							fontWeight="semibold"
							disabled={!canSubmit}
							_hover={
								canSubmit
									? { bgColor: theme.bg.bluePurple }
									: { opacity: "0.3" }
							}
						>
							{swapButtonValidation}
						</Button>
					)}
					<Flex>
						{isERC20 && isConnected && !isWrap && (
							<Button
								w="100%"
								mt="2rem"
								py="6"
								px="6"
								borderRadius="67px"
								onClick={
									approveValidation &&
									!approvalSubmitted.tokens.includes(
										`${selectedToken[0]?.symbol}`
									)
										? () => {
												onOpenConfirmSwap();
												setTxType("approve");
										  }
										: () => {
												onOpenConfirmSwap();
												setTxType("approve-swap");
										  }
								}
								bgColor={theme.bg.button.connectWalletSwap}
								color={theme.text.cyan}
								fontSize="lg"
								fontWeight="semibold"
								disabled={!canSubmit || isPending}
								_hover={{
									opacity: 0.9,
								}}
							>
								{approveValidation &&
								!approvalSubmitted.tokens.includes(
									`${selectedToken[0]?.symbol}`
								)
									? translation("swapPage.approve")
									: translation("swapPage.swap")}
							</Button>
						)}
						{isWrap && isConnected && (
							<Button
								w="100%"
								mt="2rem"
								py="6"
								px="6"
								borderRadius="67px"
								onClick={() => {
									if (!onWrap) return;
									onWrap();
									setTxType("wrap");
								}}
								bgColor={theme.bg.button.connectWalletSwap}
								color={theme.text.cyan}
								fontSize="lg"
								fontWeight="semibold"
								disabled={!canWrap}
							>
								{wrapOrUnwrap}
							</Button>
						)}
					</Flex>
				</Flex>
				<Collapse
					in={
						!!tokenInputValue.inputTo.value &&
						!!tokenInputValue.inputFrom.value &&
						!isWrap
					}
				>
					<Flex
						flexDirection="column"
						p="1.5rem"
						background={theme.bg.blueNavy}
						w="25rem"
						borderRadius="xl"
						mt="7"
						mb={["2", "2", "2", "10rem"]}
						zIndex="1"
					>
						<Flex flexDirection="column">
							<Flex flexDirection="row" justifyContent="space-between">
								<Flex>
									<Text fontWeight="normal" mr="1" fontSize="sm">
										{translation("swap.minimumReceived")}
									</Text>

									<TooltipComponent
										label={translation("swap.transactionRevertHelper")}
										icon={MdHelpOutline}
									/>
								</Flex>
								<Text fontWeight="medium" fontSize="sm">
									{returnedTradeValue?.v2Trade &&
									returnedTradeValue?.slippageAdjustedAmounts
										? `${minimumReceived} ${returnedTradeValue?.v2Trade?.outputAmount?.currency.symbol}`
										: "-"}
								</Text>
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Flex>
									<Text fontWeight="normal" mr="1" fontSize="sm">
										{translation("swap.priceImpact")}
									</Text>

									<TooltipComponent
										label={translation("swap.priceImpactHelper")}
										icon={MdHelpOutline}
									/>
								</Flex>
								<FormattedPriceImpat
									priceImpact={returnedTradeValue?.v2Trade?.priceImpact}
								/>
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Flex w="max-content">
									<Text
										fontWeight="normal"
										mr="1"
										fontSize="sm"
										w="max-content"
									>
										{translation("swap.liquidityProviderFee")}
									</Text>

									<TooltipComponent
										label={translation("swap.liquidityProviderHelper")}
										icon={MdHelpOutline}
									/>
								</Flex>
								<Text fontWeight="medium" fontSize="sm" textAlign="right">
									{realizedLPFee
										? `${realizedLPFee.toSignificant(4)} ${
												returnedTradeValue?.v2Trade?.inputAmount.currency.symbol
										  }`
										: "-"}
								</Text>
							</Flex>
							{returnedTradeValue?.v2TradeRoute &&
								returnedTradeValue.v2TradeRoute.length > 2 && (
									<Flex flexDirection="column" w="100%">
										<Flex
											flexDirection="row"
											justifyContent="space-between"
											pt="1rem"
										>
											<Flex>
												<Text fontSize="sm" mr="1" fontWeight="normal">
													{translation("swap.route")}
												</Text>

												<TooltipComponent
													label={translation("swap.routingHelper")}
													icon={MdHelpOutline}
												/>
											</Flex>
										</Flex>
										<Flex
											border="1px solid rgba(160, 174, 192, 1)"
											py="2.5"
											px="1"
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
				</Collapse>
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
					flexDirection={["column", "row", "row", "row"]}
					alignItems="center"
					mb={`${tokensGraphCandleData?.length === 0 && "5"}`}
				>
					<Flex>
						{[0, 1].map(
							(
								_,
								index // Array with number of elements to display in the screen
							) => (
								<SkeletonCircle
									key={index}
									isLoaded={!isLoadingGraphCandles}
									mr={`${isLoadingGraphCandles && "0.5"}`}
									fadeDuration={1.5}
									speed={1.3}
									background="transparent"
									opacity={`${isLoadingGraphCandles && 0.2}`}
									startColor="#8A15E6"
									endColor="#19EBCE"
								>
									<Img
										src={
											index === 0
												? tokensPairPosition[0]?.tokenInfo?.logoURI
												: tokensPairPosition[1]?.tokenInfo?.logoURI
										}
										w="7"
										h="7"
										mr="0.5"
									/>
								</SkeletonCircle>
							)
						)}

						<Skeleton
							isLoaded={!isLoadingGraphCandles}
							ml={`${isLoadingGraphCandles && "1.5"}`}
							fadeDuration={1.5}
							speed={1.3}
							background="transparent"
							opacity={`${isLoadingGraphCandles && 0.2}`}
							startColor="#8A15E6"
							endColor="#19EBCE"
						>
							<Text fontWeight="700" fontSize="xl" ml="2.5">
								{tokensPairPosition[0]?.symbol} /{" "}
								{tokensPairPosition[1]?.symbol}
							</Text>
						</Skeleton>
					</Flex>
					<Skeleton
						h={`${isLoadingGraphCandles && "32px"}`}
						isLoaded={!isLoadingGraphCandles}
						fadeDuration={1.5}
						speed={1.3}
						background="transparent"
						opacity={`${isLoadingGraphCandles && 0.2}`}
						startColor="#8A15E6"
						endColor="#19EBCE"
					>
						<Text pl="2" fontSize="lg" fontWeight="400">
							{tokensGraphCandleData?.length === 0
								? "-"
								: `${parseFloat(
										String(tokensGraphCandleData[0]?.close)
								  ).toFixed(2)} ${tokensPairPosition[1]?.symbol}`}
						</Text>
					</Skeleton>
				</Flex>
				{tokensGraphCandleData?.length !== 0 && (
					<Flex my="6" justifyContent="center">
						{isLoadingGraphCandles ? (
							<Flex
								w="100%"
								maxW={`${isLoadingGraphCandles && "70%"}`}
								alignItems="center"
								justifyContent={`${
									isLoadingGraphCandles ? "space-evenly" : "center"
								}`}
							>
								{[1, 2, 3, 4, 5].map(
									(
										_,
										index // Array with number of elements to display in the screen
									) => (
										<SkeletonCircle
											key={index}
											w="40px"
											h="40px"
											fadeDuration={1.5}
											speed={1.3}
											background="transparent"
											opacity={`${isLoadingGraphCandles && 0.2}`}
											startColor="#8A15E6"
											endColor="#19EBCE"
										/>
									)
								)}
							</Flex>
						) : (
							<FilterButton
								periodStateValue={tokensGraphCandlePeriod}
								setPeriod={setTokensGraphCandlePeriod}
							/>
						)}
					</Flex>
				)}
				<Flex
					direction="column"
					justifyContent="center"
					maxW={isLoadingGraphCandles ? "475px" : ""}
					borderBottom={`${isLoadingGraphCandles && "1px solid"}`}
					borderRight={`${isLoadingGraphCandles && "1px solid"}`}
					borderColor={`${isLoadingGraphCandles && "rgba(255,255,255, .25)"}`}
					borderRadius={`${isLoadingGraphCandles && "5px"}`}
				>
					<Skeleton
						w="100%"
						h="315px"
						isLoaded={!isLoadingGraphCandles}
						fadeDuration={1.5}
						speed={1.3}
						background="transparent"
						opacity={`${isLoadingGraphCandles && 0.1}`}
						startColor="#8A15E6"
						endColor="#19EBCE"
						borderRadius="5px"
					>
						{tokensGraphCandleData?.length === 0 && !isLoadingGraphCandles ? (
							<>
								<Text
									textAlign="center"
									color={theme.text.mono}
									fontWeight="medium"
									fontSize="md"
								>
									Data not found for this pair of tokens.
								</Text>

								<Text
									textAlign="center"
									color={theme.text.mono}
									fontWeight="normal"
									fontSize="sm"
								>
									Please try again with another pair.
								</Text>
							</>
						) : (
							<ChartComponent data={tokensGraphCandleData} />
						)}
					</Skeleton>
				</Flex>
			</Flex>
		</Flex>
	);
};
