import {
	Button,
	ButtonProps,
	Collapse,
	Flex,
	Icon,
	Img,
	Input,
	Text,
	useColorMode,
	SlideFade,
} from "@chakra-ui/react";
import {
	useToasty,
	useWallet as psUseWallet,
	usePegasys,
	ONE_DAY_IN_SECONDS,
	SUPPORTED_NETWORK_CHAINS,
	useTransaction,
} from "pegasys-services";
import {
	useModal,
	usePicasso,
	useTokens,
	useWallet,
	UseDerivedSwapInfo,
	useApproveCallbackFromTrade,
	UseSwapCallback,
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
import {
	LoadingTransition,
	SelectCoinModal,
	SelectWallets,
} from "components/Modals";
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

	const { colorMode } = useColorMode();

	const { toast } = useToasty();

	const { t: translation } = useTranslation();

	const { userTokensBalance } = useTokens();

	const {
		isOpenWallet,
		onCloseWallet,
		isOpenSelectWalletModal,
		onCloseSelectWalletModal,
		onOpenCoin,
		isOpenCoin,
		onCloseCoin,
		onOpenConfirmSwap,
		isOpenConfirmSwap,
		onCloseConfirmSwap,
		onOpenTransaction,
		isOpenTransaction,
		onCloseTransaction,
		onOpenSelectWalletModal,
	} = useModal();
	const {
		setTransactions,
		transactions,
		setApprovalState,
		approvalState,
		setApprovalSubmitted,
		setCurrentTxHash,
		setCurrentSummary,
		setCurrentInputTokenName,
	} = useTransaction();
	const { otherWallet } = useWallet();

	const { address, chainId, isConnected, provider, signer } = psUseWallet();
	const { userSlippageTolerance, userTransactionDeadlineValue, expert } =
		usePegasys();

	// END HOOKS IMPORTED VALUES

	// SOME INITIAL VALUES FOR REACT STATES //

	let currentChainId: ChainId;

	const validatedCurrentChain = SUPPORTED_NETWORK_CHAINS.includes(
		chainId as number
	);

	switch (chainId) {
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
		chainId: validatedCurrentChain ? currentChainId : ChainId.NEVM,
		walletAddress: address,
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

	const [approveTokenStatus, setApproveTokenStatus] = useState<ApprovalState>(
		ApprovalState.UNKNOWN
	);

	const [recipientAddress, setRecipientAddress] = useState<string>("");

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
		isConnected &&
		parseFloat(tokenInputValue.typedValue) > 0 &&
		tokenInputValue.lastInputTyped === 0
			? parseFloat(selectedToken[0]?.tokenInfo?.balance as string) >=
			  parseFloat(tokenInputValue?.inputFrom?.value)
			: parseFloat(selectedToken[1]?.tokenInfo?.balance as string) >=
			  parseFloat(tokenInputValue?.inputTo?.value),
	];

	const canSubmit = submitValidation.every(validation => validation === true);

	const wrapValidation = [
		isConnected && parseFloat(tokenInputValue.typedValue) > 0,
		parseFloat(selectedToken[0]?.tokenInfo?.balance as string) >=
			parseFloat(tokenInputValue?.inputFrom?.value),
		parseFloat(selectedToken[0]?.tokenInfo?.balance as string) >=
			parseFloat(tokenInputValue?.inputTo?.value),
		parseFloat(selectedToken[1]?.tokenInfo?.balance as string) >=
			parseFloat(tokenInputValue?.inputTo?.value),
		parseFloat(selectedToken[1]?.tokenInfo?.balance as string) >=
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

	const alreadyApproved = approveTokenStatus === ApprovalState.APPROVED;

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
			userTransactionDeadlineValue,
			walletInfos,
			signer,
			recipientAddress,
			setTransactions,
			setApprovalState,
			setCurrentTxHash,
			setCurrentSummary,
			setCurrentInputTokenName,
			txType,
			toast,
			transactions,
			onCloseTransaction
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

	const switchTokensPosition = () => {
		setSelectedToken(prevState => [...prevState]?.reverse());
		setTokenInputValue(prevState => ({
			...prevState,
			currentInputTyped:
				prevState.currentInputTyped === "inputFrom" ? "inputTo" : "inputFrom",
			lastInputTyped: prevState.lastInputTyped === 0 ? 1 : 0,
			inputFrom: {
				value:
					prevState.currentInputTyped === "inputFrom"
						? prevState.inputTo.value
						: prevState.typedValue,
			},
			inputTo: {
				value:
					prevState.currentInputTyped === "inputTo"
						? prevState.inputFrom.value
						: prevState.typedValue,
			},
		}));
	};

	const { execute: onWrap } = UseWrapCallback(
		selectedToken,
		tokenInputValue,
		walletInfos,
		setTransactions,
		transactions,
		setApprovalState,
		setCurrentTxHash,
		setCurrentSummary,
		signer as Signer,
		onCloseTransaction
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
			userTransactionDeadlineValue,
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
			chainId: chainId === 5700 ? ChainId.TANENBAUM : ChainId.NEVM,
			provider,
			walletAddress: address,
		},
		signer as Signer,
		tokenInputValue,
		setApprovalState,
		setTransactions,
		transactions,
		toast,
		setApprovalSubmitted,
		setCurrentTxHash,
		setCurrentSummary,
		setCurrentInputTokenName,
		setApproveTokenStatus,
		onCloseTransaction,
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
		if (userTokensBalance.length === 0) return;

		const getTokensBySymbol = userTokensBalance?.filter(
			token => token?.symbol === "SYS" || token?.symbol === "PSYS"
		);

		const setIdToTokens = getTokensBySymbol.map(
			(token: WrappedTokenInfo, index: number) => ({
				...token,
				id: index,
			})
		) as WrappedTokenInfo[];

		setSelectedToken(setIdToTokens as WrappedTokenInfo[]);
	}, [userTokensBalance]);

	useEffect(() => {
		if (userTokensBalance.length === 0) return;

		const SYS = userTokensBalance?.find(token => token.symbol === "SYS");
		const PSYS = userTokensBalance?.find(token => token.symbol === "PSYS");

		setSelectedToken([SYS as WrappedTokenInfo, PSYS as WrappedTokenInfo]);
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
		userTransactionDeadlineValue,
		selectedToken[0]?.address,
		selectedToken[1]?.address,
	]);

	const isOtherWallet = useMemo(() => {
		if (otherWallet && expert) {
			return <OtherWallet setRecipientAddress={setRecipientAddress} />;
		}
		return <Flex />;
	}, [otherWallet]);

	const isExpert = useMemo(() => {
		if (expert && isConnected) {
			return <SwapExpertMode />;
		}
		return <Flex />;
	}, [expert]);

	// END REACT HOOKS //

	return (
		<Flex
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
				openPendingTx={onOpenTransaction}
			/>
			<LoadingTransition
				isOpen={isOpenTransaction}
				onClose={onCloseTransaction}
			/>
			<Flex alignItems="center" flexDirection="column">
				<Flex
					h="max-content"
					width={["100%", "md", "md", "md"]}
					p="1.5rem"
					flexDirection="column"
					zIndex="1"
					borderRadius={30}
					border="1px solid transparent;"
					boxShadow={
						colorMode === "light"
							? "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
							: "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4)"
					}
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
								tokenInputValue.currentInputTyped === "inputFrom" &&
								parseFloat(tokenInputValue.inputFrom.value) >
									parseFloat(selectedToken[0]?.balance as string)) ||
							(tokenInputValue.currentInputTyped === "inputTo" &&
								parseFloat(tokenInputValue.inputFrom.value) >
									parseFloat(selectedToken[0]?.balance as string)) ||
							(isConnected && verifyIfHaveInsufficientLiquidity && !isWrap)
								? theme.text.red400
								: "#ff000000"
						}
						transition="500ms border ease-in-out"
					>
						<Flex
							flexDirection="row"
							justifyContent="space-between"
							alignItems="center"
						>
							<Text fontSize="md" fontWeight="500" color={theme.text.mono}>
								{translation("swapPage.from")}
							</Text>
							<Text
								fontSize={["14px", "14px", "16px", "16px"]}
								fontWeight="400"
								color={theme.text.gray500}
							>
								{`${translation("header.balance")} ${
									selectedToken[0]?.formattedBalance as string
								}`}
							</Text>
						</Flex>
						<Flex alignItems="center" justifyContent="space-between">
							<Flex w="100%" alignItems="center" mt="0.313rem">
								<Flex
									justifyContent=""
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
									parseFloat(selectedToken[0]?.balance as string) !== 0 && (
										<Flex ml="8" onClick={() => handleMaxInput()}>
											<Text
												color={theme.text.cyanPurple}
												_hover={{ cursor: "pointer", opacity: "0.8" }}
											>
												Max
											</Text>
										</Flex>
									)}
							</Flex>

							<Input
								fontSize="2xl"
								maxW="160px"
								display="inline-block"
								overflow="hidden"
								whiteSpace="nowrap"
								textOverflow="ellipsis"
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
							<Collapse
								in={
									parseFloat(tokenInputValue.inputFrom.value) >
									parseFloat(selectedToken[0]?.balance as string)
								}
							>
								<Flex gap="1">
									<Text
										fontSize="sm"
										pt="2"
										textAlign="center"
										color={theme.text.red400}
										fontWeight="semibold"
									>
										{translation("swapHooks.insufficient")}
										{selectedToken[0]?.symbol}
										{translation("swapHooks.balance")}.{" "}
										{translation("swapHooks.validAmount")}.
									</Text>
								</Flex>
							</Collapse>
						</Flex>
					)}
					{tokenInputValue.currentInputTyped === "inputTo" && (
						<Flex flexDirection="row" gap="1" justifyContent="center">
							<Collapse
								in={
									parseFloat(tokenInputValue.inputFrom.value) >
									parseFloat(selectedToken[0]?.balance as string)
								}
							>
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
									fontWeight="semibold"
								>
									{translation("swapHooks.insufficient")}
									{selectedToken[0]?.symbol}
									{translation("swapHooks.balance")}.
									{translation("swapHooks.validAmount")}.
								</Text>
							</Collapse>
						</Flex>
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
						transition="500ms border ease-in-out"
					>
						<Flex
							flexDirection="row"
							justifyContent="space-between"
							alignItems="center"
						>
							<Text fontSize="md" fontWeight="500" color={theme.text.mono}>
								{translation("currencyInputPanel.to")}
							</Text>
							<Text
								fontSize={["14px", "14px", "16px", "16px"]}
								fontWeight="400"
								color={theme.text.gray500}
							>
								{`${translation("header.balance")} ${
									selectedToken[1]?.formattedBalance as string
								}`}
							</Text>
						</Flex>

						<Flex alignItems="center" justifyContent="space-between">
							<Flex
								mt="0.313rem"
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
								maxW="160px"
								display="inline-block"
								overflow="hidden"
								whiteSpace="nowrap"
								textOverflow="ellipsis"
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
					<Flex flexDirection="column" gap="1">
						<Collapse
							in={isConnected && verifyIfHaveInsufficientLiquidity && !isWrap}
						>
							<Text
								fontSize="sm"
								pt="2"
								textAlign="center"
								color={theme.text.red400}
								fontWeight="semibold"
							>
								{translation("swapPage.insufficientLiquidity")}
							</Text>
						</Collapse>
					</Flex>
					<Collapse
						in={
							!!tokenInputValue.inputTo.value &&
							!!tokenInputValue.inputFrom.value &&
							!isWrap
						}
					>
						<Flex
							w="100%"
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
								justifyContent={[
									"space-around",
									"space-between",
									"space-between",
									"space-between",
								]}
								py="0.5rem"
								borderRadius="2xl"
								borderTop="1px solid"
								borderColor={theme.text.cyanPurple}
								bgColor={theme.bg.bluePink}
								color={theme.text.mono}
								px="3"
								pr={["1.8rem", "2.8rem", "2.8rem", "2.8rem"]}
							>
								<Flex
									fontSize="sm"
									flexDirection="column"
									textAlign="center"
									alignItems="center"
								>
									<Text
										fontWeight="semibold"
										w={["8rem", "11rem", "11rem", "11rem"]}
									>
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
								<Flex
									fontSize="sm"
									flexDirection="column"
									textAlign="center"
									alignItems="center"
								>
									<Text
										fontWeight="semibold"
										w={["4.2rem", "7rem", "7rem", "7rem"]}
									>
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
					<Collapse in={expert && isConnected}>{isExpert}</Collapse>
					<Collapse in={otherWallet && expert}>{isOtherWallet}</Collapse>

					{!isERC20 && !isWrap && (
						<Button
							w="100%"
							mt={isExpert ? "1.8rem" : "1.5rem"}
							py="6"
							px="6"
							borderRadius="67px"
							onClick={
								!isConnected
									? () => {
											onOpenSelectWalletModal();
									  }
									: () => {
											onOpenConfirmSwap();
											setTxType("swap");
									  }
							}
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							fontSize={["16px", "16px", "lg", "lg"]}
							fontWeight="semibold"
							disabled={
								!isConnected
									? false
									: !canSubmit || Boolean(returnedTradeValue?.inputErrors)
							}
							_hover={
								canSubmit || !isConnected
									? { bgColor: theme.bg.bluePurple }
									: { opacity: "0.3" }
							}
						>
							{isConnected &&
							(tokenInputValue.typedValue === "" ||
								parseFloat(tokenInputValue.typedValue) === 0)
								? translation("swapHooks.enterAmount")
								: `${swapButtonValidation}`}
						</Button>
					)}
					<Flex>
						{isERC20 && !isWrap && (
							<Button
								w="100%"
								mt="2rem"
								py="6"
								px="6"
								borderRadius="67px"
								onClick={
									approveValidation && !alreadyApproved
										? () => {
												onOpenConfirmSwap();
												setTxType("approve");
										  }
										: () => {
												onOpenConfirmSwap();
												setTxType("approve-swap");
										  }
								}
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								fontSize="lg"
								fontWeight="semibold"
								disabled={!canSubmit || isPending}
								_hover={{
									opacity: 0.9,
								}}
							>
								{isConnected
									? tokenInputValue.typedValue === "" ||
									  parseFloat(tokenInputValue.typedValue) === 0
										? translation("swapHooks.enterAmount")
										: `${
												approveValidation && !alreadyApproved
													? translation("swapPage.approve")
													: translation("swapPage.swap")
										  }`
									: `${swapButtonValidation}`}
							</Button>
						)}
						{isWrap && (
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
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								fontSize="lg"
								fontWeight="semibold"
								disabled={
									!canWrap ||
									(tokenInputValue.currentInputTyped === "inputFrom" &&
										parseFloat(tokenInputValue.typedValue) >
											parseFloat(
												selectedToken[0]?.tokenInfo?.balance as string
											)) ||
									(tokenInputValue.currentInputTyped === "inputTo" &&
										parseFloat(tokenInputValue.typedValue) >
											parseFloat(
												selectedToken[1]?.tokenInfo?.balance as string
											))
								}
							>
								{isConnected &&
								(tokenInputValue.typedValue === "" ||
									parseFloat(tokenInputValue.typedValue) === 0)
									? translation("swapHooks.enterAmount")
									: `${wrapOrUnwrap}`}
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
					style={{
						width: "100%",
					}}
				>
					<Flex
						flexDirection="column"
						p="1.5rem"
						background={theme.bg.blueNavy}
						w={["100%", "28rem", "28rem", "28rem"]}
						borderRadius="30px"
						mt="7"
						mb={["2", "2", "2", "10rem"]}
						zIndex="1"
					>
						<Flex flexDirection="column">
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								alignItems="center"
							>
								<Flex alignItems="center">
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
								<Flex alignItems="center">
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
								alignItems="center"
							>
								<Flex
									w={["70%", "70%", "max-content", "max-content"]}
									alignItems="center"
								>
									<Text
										fontWeight="normal"
										mr="1"
										fontSize="sm"
										w={["60%", "max-content", "max-content", "max-content"]}
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
											pt={["1rem", "1rem", "0", "0"]}
										>
											<Flex alignItems="center" pt="1.5rem" pb="0.3rem">
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
				w={["90%", "md", "md", "xl"]}
				ml={["0", "0", "0", "12"]}
				mt={["8", "8", "8", "0"]}
				mb={["24", "24", "24", "0"]}
				flexDirection="column"
				zIndex="1"
				borderRadius={30}
				border="1px solid transparent;"
			>
				<SlideFade in={!isLoadingGraphCandles} offsetY="20px">
					{!isLoadingGraphCandles && (
						<Flex flexDirection="column">
							<Flex
								gap="2"
								justifyContent="center"
								flexDirection={["column", "row", "row", "row"]}
								alignItems="center"
								mb={`${
									!isLoadingGraphCandles &&
									tokensGraphCandleData?.length === 0 &&
									"2"
								}`}
							>
								<Flex position="relative">
									<Img
										src={tokensPairPosition[0]?.tokenInfo?.logoURI}
										w="7"
										h="7"
									/>
									<Img
										src={tokensPairPosition[1]?.tokenInfo?.logoURI}
										w="7"
										h="7"
										position="absolute"
										left="1.4rem"
									/>

									<Text fontWeight="700" fontSize="xl" ml="2rem">
										{tokensPairPosition[0]?.symbol} /{" "}
										{tokensPairPosition[1]?.symbol}
									</Text>
								</Flex>

								<Text pl="2" fontSize="lg" fontWeight="400">
									{tokensGraphCandleData?.length === 0
										? "-"
										: `${parseFloat(
												String(tokensGraphCandleData[0]?.close)
										  ).toFixed(2)} ${tokensPairPosition[1]?.symbol}`}
								</Text>
							</Flex>
							<Flex
								my={`${
									tokensGraphCandleData?.length === 0 && !isLoadingGraphCandles
										? "0"
										: "6"
								}`}
								justifyContent="center"
							>
								<SlideFade
									in={tokensGraphCandleData?.length !== 0}
									offsetY="20px"
								>
									<FilterButton
										periodStateValue={tokensGraphCandlePeriod}
										setPeriod={setTokensGraphCandlePeriod}
									/>
								</SlideFade>
							</Flex>
						</Flex>
					)}
				</SlideFade>
				<Flex
					direction="column"
					justifyContent="center"
					maxW={isLoadingGraphCandles ? "475px" : ""}
				>
					{isLoadingGraphCandles ? (
						<Flex
							flexDirection="column"
							justifyContent="center"
							align="center"
							gap="3"
							mt={["0rem", "9rem", "9rem", "9rem"]}
							ml="8"
							color={theme.text.mono}
						>
							<Img src="icons/loading.gif" className="blob" w="25%" h="25%" />
						</Flex>
					) : tokensGraphCandleData?.length === 0 ? (
						<Flex flexDirection="column">
							<Text
								textAlign="center"
								color={theme.text.mono}
								fontWeight="medium"
								fontSize="md"
							>
								{translation("swapPage.dataNotFound")}{" "}
							</Text>

							<Text
								textAlign="center"
								color={theme.text.mono}
								fontWeight="normal"
								fontSize="sm"
							>
								{translation("swapPage.tryWithAnother")}
							</Text>
						</Flex>
					) : (
						<SlideFade
							in={!isLoadingGraphCandles || tokensGraphCandleData}
							offsetY="20px"
						>
							<ChartComponent data={tokensGraphCandleData} />
						</SlideFade>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
