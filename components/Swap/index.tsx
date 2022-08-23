import {
	Button,
	ButtonProps,
	Collapse,
	Fade,
	Flex,
	Icon,
	Img,
	Input,
	Text,
	Tooltip,
	useDisclosure,
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
import React, { FunctionComponent, useEffect, useState, useMemo } from "react";
import { MdWifiProtectedSetup, MdHelpOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { ChainId, JSBI, Trade } from "@pollum-io/pegasys-sdk";
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

import { ONE_DAY_IN_SECONDS } from "helpers/consts";
import { ConfirmSwap } from "components/Modals/ConfirmSwap";
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

	const { isOpen, onToggle } = useDisclosure();
	const [show, setShow] = React.useState(false);

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

	const swapButtonValidation = !isConnected ? "Connect Wallet" : "Swap";

	// END VALIDATIONS AT ALL //

	// HANDLE FUNCTIONALITIES AND HOOKS //

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
		signer as Signer
	);

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
		userSlippageTolerance
	);

	const getTokensGraph = async () => {
		setTokensPairPosition([selectedToken[0], selectedToken[1]]);

		const requestTokensCandle = await getTokensGraphCandle(
			selectedToken[0],
			selectedToken[1],
			tokensGraphCandlePeriod.period
		);

		setTokensGraphCandleData(requestTokensCandle);

		return requestTokensCandle;
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
					txType === "swap"
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
							tokenInputValue.inputFrom.value === "" ||
							(isConnected && verifyIfHaveInsufficientLiquidity && !isWrap)
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
								_hover={{ border: "1px solid #3182CE" }}
								_focus={{ border: "1px solid #3182CE", outline: "none" }}
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
									Insufficient {selectedToken[0]?.symbol} balance. Please enter
									a valid amount.
								</Text>
							)}
						</Flex>
					)}
					{parseFloat(tokenInputValue.inputFrom.value) === 0 ||
						(tokenInputValue.inputFrom.value === "" && (
							<Text
								fontSize="sm"
								pt="2"
								textAlign="center"
								fontWeight="semibold"
								color={theme.text.red400}
							>
								Please insert a valid amount.
							</Text>
						))}
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
								_hover={{ border: "1px solid #3182CE" }}
								_focus={{ border: "1px solid #3182CE", outline: "none" }}
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
								Insufficient liquidity for this trade.
							</Text>
						</Flex>
					)}
					{!isERC20 && !isWrap && (
						<Button
							w="100%"
							mt="2rem"
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
							disabled={!canSubmit || isPending}
						>
							{swapButtonValidation}
						</Button>
					)}
					{tokenInputValue.inputTo.value &&
						tokenInputValue.inputFrom.value &&
						!isWrap && (
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
						{isERC20 && isConnected && !isWrap && (
							<Button
								w="100%"
								mt="2rem"
								py="6"
								px="6"
								borderRadius="67px"
								onClick={
									approveValidation
										? () => {
												onOpenConfirmSwap();
												setTxType("approve");
										  }
										: () => {
												onOpenConfirmSwap();
												setTxType("swap");
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
								{approveValidation ? "Approve" : "Swap"}
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
								disabled={!canSubmit || isPending}
							>
								{wrapOrUnwrap}
							</Button>
						)}
					</Flex>
				</Flex>
				{tokenInputValue.inputTo.value &&
					tokenInputValue.inputFrom.value &&
					!isWrap && (
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
									<FormattedPriceImpat
										priceImpact={returnedTradeValue?.v2Trade?.priceImpact}
									/>
								</Flex>
								<Flex
									flexDirection="row"
									justifyContent="space-between"
									pt="0.75rem"
								>
									<Text fontWeight="normal">
										Liquidity Provider Fee <Icon as={MdHelpOutline} />
									</Text>
									<Text fontWeight="medium">
										{realizedLPFee
											? `${realizedLPFee.toSignificant(4)} ${
													returnedTradeValue?.v2Trade?.inputAmount.currency
														.symbol
											  }`
											: "-"}
									</Text>
								</Flex>
								{returnedTradeValue?.v2TradeRoute &&
									returnedTradeValue.v2TradeRoute.length > 2 && (
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
												justifyContent="center"
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
					flexDirection={["column", "row", "row", "row"]}
					alignItems="center"
					mb={`${tokensGraphCandleData.length === 0 && "16"}`}
				>
					<Flex>
						<Img src={tokensPairPosition[0]?.logoURI} w="7" h="7" mr="0.5" />
						<Img src={tokensPairPosition[1]?.logoURI} w="7" h="7" />
						<Text fontWeight="700" fontSize="xl" ml="2.5">
							{tokensPairPosition[0]?.symbol} / {tokensPairPosition[1]?.symbol}
						</Text>
					</Flex>
					<Text pl="2" fontSize="lg" fontWeight="400">
						{tokensGraphCandleData.length === 0
							? "-"
							: `${parseFloat(tokensGraphCandleData[0]?.close).toFixed(2)} ${
									tokensPairPosition[1]?.symbol
							  }`}
					</Text>
				</Flex>
				{tokensGraphCandleData.length !== 0 && (
					<Flex my="6">
						<FilterButton
							periodStateValue={tokensGraphCandlePeriod}
							setPeriod={setTokensGraphCandlePeriod}
						/>
					</Flex>
				)}
				<Flex direction="column" justifyContent="center">
					<ChartComponent data={tokensGraphCandleData} />
					{tokensGraphCandleData.length === 0 && (
						<Text
							textAlign="center"
							color="#fff"
							fontWeight="400"
							fontSize="sm"
						>
							Candle data not available to this token pair.
						</Text>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};
