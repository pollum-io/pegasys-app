/* eslint-disable */
import {
	Button,
	ButtonProps,
	Flex,
	Icon,
	Img,
	Input,
	Text,
	Tooltip,
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
import { ConfirmSwap } from "components/Modals/ConfirmSwap";

const ChartComponent = dynamic(() => import("./ChartComponent"), {
	ssr: false,
});
interface ITokenInputValue {
	inputFrom: string;
	inputTo: string;
}

export const Swap: FunctionComponent<ButtonProps> = () => {
	const theme = usePicasso();

	const { t: translation } = useTranslation();
	const { userTokensBalance } = useTokens();
	const {
		onOpenWallet,
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
	const [txType, setTxType] = useState<string>("");
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
			return;
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
		signer
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
		setApprovalState,
		setTransactions,
		transactions,
		toast,
		userSlippageTolerance
	);

	const getTokensGraph = async () => {
		const [tokenA, tokenB]: Token[] = [
			selectedToken[0],
			selectedToken[1],
		] as Token[];

		if (isWrap) {
			const [token0, token1] = [tokenA, tokenB];

			const requestTokensCandle = await getTokensGraphCandle(
				token0,
				token1,
				tokensGraphCandlePeriod.period
			);

			setTokensGraphCandleData(requestTokensCandle);

			return requestTokensCandle;
		}

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

	const isERC20 =
		selectedToken[0]?.symbol !== "SYS" && selectedToken[0]?.symbol !== "PSYS";

	const approveValidation =
		(isERC20 && approvalState === ApprovalState.UNKNOWN) ||
		(isERC20 && approvalState === ApprovalState.PENDING);

	const isPending = approvalState === ApprovalState.PENDING;

	const wrapOrUnwrap = selectedToken[0]?.symbol === "SYS" ? "Wrap" : "Unwrap";

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
				onOpen={onOpenConfirmSwap}
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
						<Text
							color={theme.text.mono}
							fontWeight="semibold"
							fontSize={["xl", "2xl", "2xl", "2xl"]}
						>
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
							(parseInt(tokenInputValue.inputFrom.value) >
								parseInt(selectedToken[0]?.balance) &&
								tokenInputValue.currentInputTyped !== "inputTo") ||
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
								<Icon as={IoIosArrowDown} color={theme.text.mono} />
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
								_focus={{ border: "1px solid #3182CE" }}
							/>
						</Flex>
					</Flex>
					{parseInt(tokenInputValue.inputFrom.value) >
						parseInt(selectedToken[0]?.balance) &&
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
							(parseInt(tokenInputValue.inputTo.value) >
								parseInt(selectedToken[1]?.balance) &&
								tokenInputValue.currentInputTyped !== "inputFrom") ||
							(isConnected && verifyIfHaveInsufficientLiquidity && !isWrap)
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
								_focus={{ border: "1px solid #3182CE" }}
							/>
						</Flex>
					</Flex>
					{parseInt(tokenInputValue.inputTo.value) >
						parseInt(selectedToken[1]?.balance) &&
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
						{!isERC20 && !isWrap && isConnected && (
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
								_hover={{ opacity: 0.3 }}
							>
								{swapButtonValidation}
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
									onOpenConfirmSwap();
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
				{tokenInputValue.inputTo.value && tokenInputValue.inputFrom.value && (
					<Flex
						flexDirection="column"
						p="1.5rem"
						background={theme.bg.subModal}
						w="90%"
						borderRadius="xl"
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
								<Flex gap="1" alignItems="center">
									<Text fontWeight="normal">Minimum Received</Text>
									<Tooltip
										label="Sua transação será revertida se houver um movimento de preço grande e desfavorável antes de ser confirmada."
										position="relative"
										bgColor={theme.bg.secondary}
										color={theme.text.mono}
										borderRadius="md"
									>
										<Text as="span" _hover={{ opacity: 0.8 }}>
											<Flex pb="0.2rem">
												<Icon
													as={MdHelpOutline}
													h="4"
													w="4"
													mt="3px"
													color={theme.icon.whiteGray}
													borderRadius="full"
												/>
											</Flex>
										</Text>
									</Tooltip>
								</Flex>
								<Flex>
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
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Flex gap="1" alignItems="center">
									<Text fontWeight="normal">Price Impact</Text>
									<Tooltip
										label="A diferença entre o preço de mercado e o preço estimado devido ao tamanho da troca."
										position="relative"
										bgColor={theme.bg.secondary}
										color={theme.text.mono}
										borderRadius="md"
									>
										<Text as="span" _hover={{ opacity: 0.8 }}>
											<Flex pb="0.2rem">
												<Icon
													as={MdHelpOutline}
													h="4"
													w="4"
													mt="3px"
													color={theme.icon.whiteGray}
													borderRadius="full"
												/>
											</Flex>
										</Text>
									</Tooltip>
								</Flex>
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
								<Flex gap="1" alignItems="center">
									<Text fontWeight="normal">Liquidity Provider Fee</Text>
									<Tooltip
										label="Uma parte de cada troca (0,30%) vai para os provedores de liquidez como um incentivo do protocolo."
										position="relative"
										bgColor={theme.bg.secondary}
										color={theme.text.mono}
										borderRadius="md"
									>
										<Text as="span" _hover={{ opacity: 0.8 }}>
											<Flex pb="0.2rem">
												<Icon
													as={MdHelpOutline}
													h="4"
													w="4"
													mt="3px"
													color={theme.icon.whiteGray}
													borderRadius="full"
												/>
											</Flex>
										</Text>
									</Tooltip>
								</Flex>
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
											<Flex gap="1" alignItems="center">
												<Text fontWeight="normal">Route</Text>
												<Tooltip
													label="A rota através desses tokens resultaram no melhor preço para a sua troca."
													position="relative"
													bgColor={theme.bg.secondary}
													color={theme.text.mono}
													borderRadius="md"
												>
													<Text as="span" _hover={{ opacity: 0.8 }}>
														<Flex pb="0.15rem">
															<Icon
																as={MdHelpOutline}
																h="4"
																w="4"
																mt="3px"
																color={theme.icon.whiteGray}
																borderRadius="full"
															/>
														</Flex>
													</Text>
												</Tooltip>
											</Flex>
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
						{`${
							truncateNumberDecimalsPlaces(
								parseFloat(tokensGraphCandleData[0]?.close)
							) || "0.00"
						}`}
						{` ${selectedToken[1]?.symbol}`}
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
