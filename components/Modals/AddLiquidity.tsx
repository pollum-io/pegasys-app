/* eslint-disable */
// @ts-nocheck
import {
	Button,
	Flex,
	Icon,
	Input,
	Modal,
	ModalContent,
	ModalHeader,
	Img,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import {
	useModal,
	usePicasso,
	useTokens,
	useWallet,
	useAllCommonPairs,
} from "hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	MdHelpOutline,
	MdArrowBack,
	MdAdd,
	MdOutlineInfo,
} from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IDeposited, IInputValues, WrappedTokenInfo } from "types";
import { TooltipComponent } from "components/Tooltip/TooltipComponent";
import { useTranslation } from "react-i18next";
import { PoolServices, useWallet as psUseWallet } from "pegasys-services";
import {
	addTransaction,
	getTokenAllowance,
	getTotalSupply,
	tryParseAmount,
	wrappedCurrencyAmount,
	maxAmountSpend,
} from "utils";
import { SelectCoinModal } from "./SelectCoin";
import {
	ChainId,
	JSBI,
	Pair,
	Percent,
	TokenAmount,
} from "@pollum-io/pegasys-sdk";
import { ONE_BIPS, ROUTER_ADDRESS } from "helpers/consts";
import { Signer } from "ethers";
import { ApprovalState } from "contexts";
import { parseUnits } from "@ethersproject/units";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
	isCreate?: boolean;
	setIsCreate: React.Dispatch<React.SetStateAction<boolean>>;
	haveValue?: boolean;
	setSelectedToken: React.Dispatch<React.SetStateAction<WrappedTokenInfo[]>>;
	selectedToken: WrappedTokenInfo[];
	depositedTokens: IDeposited | undefined;
	poolPercentShare: string;
	userPoolBalance: string;
	currPair: Pair | undefined;
}
interface ITokenInputValue {
	inputFrom: IInputValues;
	inputTo: IInputValues;
	typedValue: string;
	currentInputTyped: string;
	lastInputTyped: number | undefined;
}

export const AddLiquidityModal: React.FC<IModal> = props => {
	const {
		isModalOpen,
		onModalClose,
		isCreate,
		haveValue,
		selectedToken,
		setSelectedToken,
		depositedTokens,
		poolPercentShare,
		userPoolBalance,
		currPair,
		setIsCreate,
	} = props;

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

	const { userTokensBalance } = useTokens();
	const { t: translation } = useTranslation();
	const theme = usePicasso();
	const { isOpenCoin, onCloseCoin, onOpenCoin } = useModal();
	const [buttonId, setButtonId] = useState<number>(0);
	const [tokenInputValue, setTokenInputValue] = useState<ITokenInputValue>(
		initialTokenInputValue
	);
	const [approveTokenStatus, setApproveTokenStatus] = useState<ApprovalState>(
		ApprovalState.UNKNOWN
	);
	const [tokenToApp, setTokenToApp] = useState<WrappedTokenInfo>();
	const [amountToApp, setAmountToApp] = useState<TokenAmount>();
	const [amounts, setAmounts] = useState<TokenAmount[]>([]);
	const [currPoolShare, setCurrPoolShare] = useState<string>("");

	const {
		userSlippageTolerance,
		userTransactionDeadlineValue,
		provider,
		setTransactions,
		transactions,
		setCurrentLpAddress,
		signer,
		setApprovalState,
		approvalState,
		setCurrentTxHash,
		isConnected,
	} = useWallet();
	const { address, chainId } = psUseWallet();

	const chain = chainId === 57 ? ChainId.NEVM : ChainId.TANENBAUM;

	const router = ROUTER_ADDRESS[chain];

	const walletInfo = useMemo(
		() => ({
			walletAddress: address,
			chainId,
			provider,
		}),
		[chainId, address, provider]
	);

	const invalidPair =
		(selectedToken[0]?.symbol === "SYS" &&
			selectedToken[1]?.symbol === "WSYS") ||
		(selectedToken[0]?.symbol === "WSYS" && selectedToken[1]?.symbol === "SYS");

	const isPending = approvalState.status === ApprovalState.PENDING;

	const isApproved =
		approvalState.type === "approve" &&
		approvalState.status === ApprovalState.APPROVED;

	const emptyInput =
		!tokenInputValue.inputFrom.value || !tokenInputValue.inputTo.value;

	const isERC20 =
		(selectedToken[0]?.symbol !== "SYS" &&
			selectedToken[0]?.symbol !== "PSYS") ||
		(selectedToken[1]?.symbol !== "SYS" && selectedToken[1]?.symbol !== "PSYS");

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
			return;
		}
	};

	const currencyBalances = {
		inputFrom: tryParseAmount(selectedToken[0]?.balance, selectedToken[0]),
		inputTo: tryParseAmount(selectedToken[1]?.balance, selectedToken[1]),
	};

	const maxAmounts = {
		inputFrom: maxAmountSpend(currencyBalances?.inputFrom),
		inputTo: maxAmountSpend(currencyBalances?.inputTo),
	};

	const handleMaxInput = useCallback(
		(typedInput: string) => {
			setTokenInputValue(prevState => {
				if (typedInput === "inputFrom") {
					return {
						...prevState,
						inputFrom: {
							value: maxAmounts?.inputFrom?.toExact().replaceAll(",", ".") as string,
						},
						lastInputTyped: 0,
						currentInputTyped: "inputFrom",
						typedValue: maxAmounts?.inputFrom?.toExact().replaceAll(",", ".") as string,
					};
				}
				return {
					...prevState,
					inputTo: {
						value: maxAmounts?.inputTo?.toExact() as string,
					},
					lastInputTyped: 1,
					currentInputTyped: "inputTo",
					typedValue: maxAmounts?.inputTo?.toExact() as string,
				};
			});
		},
		[maxAmounts]
	);

	const showMaxInput = Boolean(
		!tokenInputValue.inputFrom.value && !tokenInputValue.inputTo.value
	);

	useMemo(async () => {
		const {
			inputTo: { value: inputToValue },
			inputFrom: { value: inputFromValue },
			currentInputTyped,
		} = tokenInputValue;

		if (currentInputTyped === "inputFrom" && currPair) {
			const parseInputValue = tryParseAmount(inputFromValue, selectedToken[0]);
			const wrappedAmountValue = wrappedCurrencyAmount(
				parseInputValue,
				chainId
			);
			const quoteValue =
				wrappedAmountValue &&
				currPair?.priceOf(currPair?.token0)?.quote(wrappedAmountValue);

			tokenInputValue.inputTo.value =
				inputFromValue && quoteValue ? quoteValue?.toSignificant(6) : "";
		}

		if (currentInputTyped === "inputTo" && currPair) {
			const parseInputValue = tryParseAmount(inputToValue, selectedToken[1]);
			const wrappedAmountValue = wrappedCurrencyAmount(
				parseInputValue,
				chainId
			);
			const quoteValue =
				wrappedAmountValue &&
				currPair?.priceOf(currPair?.token1)?.quote(wrappedAmountValue);

			tokenInputValue.inputFrom.value =
				inputToValue && quoteValue ? quoteValue?.toSignificant(6) : "";
		}
	}, [tokenInputValue]);

	useMemo(async () => {
		const totalSupply =
			currPair &&
			(await getTotalSupply(
				currPair?.liquidityToken,
				signer as Signer,
				provider
			));
		const currencyAmountA = tryParseAmount(
			tokenInputValue.inputFrom.value,
			selectedToken[0]
		);
		const currencyAmountB = tryParseAmount(
			tokenInputValue.inputTo.value,
			selectedToken[1]
		);

		const [tokenAmountA, tokenAmountB] = [
			wrappedCurrencyAmount(currencyAmountA, chainId),
			wrappedCurrencyAmount(currencyAmountB, chainId),
		];

		const liquidityMinted =
			currPair &&
			tokenAmountA &&
			tokenAmountB &&
			currPair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB);

		const poolPercentageShare =
			liquidityMinted &&
			totalSupply &&
			new Percent(liquidityMinted?.raw, totalSupply?.add(liquidityMinted).raw);

		setCurrPoolShare(
			poolPercentageShare?.lessThan(ONE_BIPS)
				? "<0.01%"
				: `${poolPercentageShare?.toFixed(2)}%` ?? "0%"
		);
	}, [tokenInputValue]);

	useMemo(async () => {
		if (
			isERC20 &&
			tokenInputValue.inputFrom.value &&
			tokenInputValue.inputTo.value
		) {
			const valueA = JSBI.BigInt(
				parseUnits(tokenInputValue.inputFrom.value, selectedToken[0].decimals)
			);
			const amountAtoApprove =
				selectedToken[0] && new TokenAmount(selectedToken[0], valueA);

			const allowanceA =
				selectedToken[0] &&
				(await getTokenAllowance(
					selectedToken[0],
					address,
					`${router}`,
					signer as Signer
				));

			const valueB = JSBI.BigInt(
				parseUnits(tokenInputValue.inputTo.value, selectedToken[1].decimals)
			);
			const amountBtoApprove =
				selectedToken[1] && new TokenAmount(selectedToken[1], valueB);

			const allowanceB =
				selectedToken[1] &&
				(await getTokenAllowance(
					selectedToken[1],
					address,
					`${router}`,
					signer as Signer
				));

			const isApproved =
				!allowanceA?.lessThan(amountAtoApprove) &&
				!allowanceB?.lessThan(amountBtoApprove);

			if (isApproved) {
				setApproveTokenStatus(ApprovalState.APPROVED);
				return;
			}
			setApproveTokenStatus(ApprovalState.NOT_APPROVED);

			const tokenToApprove = selectedToken.find(
				token => token.symbol !== "SYS" && token.symbol !== "PSYS"
			);

			const amountToApprove = [amountAtoApprove, amountBtoApprove].find(
				amount => amount.token.symbol === tokenToApprove?.symbol
			);

			setTokenToApp(tokenToApprove);
			setAmountToApp(amountToApprove);
			setAmounts([amountAtoApprove, amountBtoApprove]);
		}
	}, [tokenInputValue, isModalOpen]);

	const approve = async () => {
		await PoolServices.approve({
			approvalState: approveTokenStatus,
			amountToApprove: amountToApp,
		})
			.then(res => {
				if (res?.spender) {
					setApprovalState({ type: "approve", status: ApprovalState.PENDING });
					setApproveTokenStatus(ApprovalState.APPROVED);
					setCurrentTxHash(res?.hash);
					addTransaction(
						res?.response,
						walletInfo,
						setTransactions,
						transactions,
						{
							summary: `Approve ${tokenToApp?.symbol}`,
						}
					);
				}
			})
			.catch(err => console.log(err));
	};

	const addLiquidity = async () => {

		const pairs = await useAllCommonPairs(
			selectedToken[0],
			selectedToken[1] ?? selectedToken[0],
			walletInfo
		);

		const pair = pairs[0];

		setCurrentLpAddress(pair.liquidityToken.address);

		const response = await PoolServices.addLiquidity({
			tokens: selectedToken as [WrappedTokenInfo, WrappedTokenInfo],
			values: [tokenInputValue.inputFrom.value, tokenInputValue.inputTo.value],
			haveValue,
			slippage: userSlippageTolerance,
			userDeadline: userTransactionDeadlineValue,
			pair,
		});
		setApprovalState({ type: "add-liquidity", status: ApprovalState.PENDING });
		addTransaction(response, walletInfo, setTransactions, transactions, {
			summary: `Add ${amounts[0]?.toSignificant(6)} ${
				selectedToken[0]?.symbol
			} and ${amounts[1]?.toSignificant(6)} ${selectedToken[1]?.symbol}`,
		});
	};

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
		if (tokenInputValue.inputFrom.value && tokenInputValue.inputTo.value) {
			setIsCreate(false);
		}
	}, [tokenInputValue]);

	useEffect(() => {
		setTokenInputValue(initialTokenInputValue);
	}, [isModalOpen]);
	return (
		<Modal blockScrollOnMount isOpen={isModalOpen} onClose={onModalClose}>
			<SelectCoinModal
				isOpen={isOpenCoin}
				onClose={onCloseCoin}
				selectedToken={selectedToken}
				setSelectedToken={setSelectedToken}
				buttonId={buttonId}
			/>
			<ModalOverlay />
			<ModalContent
				mb={["0", "0", "20rem", "20rem"]}
				bottom={["0", "0", "0", "0"]}
				position={["relative", "relative", "relative", "relative"]}
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				h={["max-content", "100%", "max-content", "max-content"]}
				borderBottomRadius={["0px", "3xl", "3xl", "3xl"]}
				border={["none", "1px solid transparent"]}
				background={`linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					display="flex"
					alignItems="baseline"
					justifyContent="space-between"
					pt="4"
				>
					<Flex alignItems="center">
						<Flex _hover={{ cursor: "pointer" }} onClick={onModalClose}>
							<MdArrowBack size={24} color={theme.icon.whiteGray} />
						</Flex>
						<Text
							fontSize={["xl", "xl", "2xl", "2xl"]}
							fontWeight="medium"
							textAlign="center"
							px="4"
							color={theme.text.mono}
						>
							{isCreate ? "Create a pair" : "Add Liquidity"}
						</Text>
					</Flex>
					<TooltipComponent
						label={translation("navigationTabs.whenYouAddLiquidityInfo")}
						icon={MdHelpOutline}
					/>
				</ModalHeader>
				{isCreate && (
					<Flex alignItems="center" w="100%" justifyContent="center">
						<Flex
							w={["90%", "90%", "90%", "90%"]}
							h={["100%", "max-content", "90%", "100%"]}
							borderRadius="2xl"
							bgColor={theme.bg.blueNavyLightnessOp}
							color={theme.text.cyan}
							p="1.5rem"
							flexDirection="column"
							gap={3}
						>
							<Text
								fontSize={["sm", "sm", "md", "md"]}
								fontWeight="semibold"
								textAlign="left"
							>
								You are the first liquidity provider.
							</Text>
							<Text
								fontSize={["sm", "sm", "md", "md"]}
								fontWeight="normal"
								textAlign="left"
								lineHeight="base"
							>
								The ratio of tokens you add will set the price of this pool.
								Once you are happy with the rate click supply to review.
							</Text>
						</Flex>
					</Flex>
				)}

				<Flex flexDirection="column">
					<Flex
						height="max-content"
						width="100%"
						bgColor="transparent"
						margin="0 auto"
						position="relative"
						borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
						h="100%"
						borderBottomRadius={["0px", "0", "3xl", "3xl"]}
						p="5"
						flexDirection="column"
					>
						<Flex
							borderRadius={18}
							width="100%"
							height="max-content"
							px="4"
							py="2"
							bgColor={theme.bg.blueNavy}
							flexDirection="row"
							justifyContent="space-between"
							border="1px solid"
							borderColor={
								parseFloat(tokenInputValue.inputFrom.value) >
									parseFloat(selectedToken[0]?.balance) ||
								parseFloat(tokenInputValue.inputFrom.value) >
									parseFloat(selectedToken[0]?.balance)
									? theme.text.red400
									: "#ff000000"
							}
						>
							<Flex flexDirection="column" color={theme.text.mono}>
								<Text fontSize="sm">Input</Text>
								<Flex
									alignItems="center"
									justifyContent="center"
									py="1"
									mt="1"
									id="0"
									w="max-content"
									onClick={(event: React.MouseEvent<HTMLInputElement>) => {
										onOpenCoin();
										setButtonId(Number(event.currentTarget.id));
									}}
									borderRadius="2xl"
									cursor="pointer"
									_hover={{}}
								>
									<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
									<Text
										fontSize="xl"
										fontWeight="500"
										px="3"
										_hover={{ opacity: "0.9" }}
									>
										{selectedToken[0]?.symbol}
									</Text>
									<Icon as={IoIosArrowDown} />
								</Flex>
							</Flex>

							<Flex
								ml="2"
								h="fit-content"
								position="relative"
								top="30px"
								onClick={() => handleMaxInput("inputFrom")}
							>
								<Text
									color={theme.text.cyanPurple}
									_hover={{ cursor: "pointer", opacity: "0.8" }}
								>
									Max
								</Text>
							</Flex>

							<Flex
								flexDirection="column"
								color={theme.text.swapInfo}
								alignItems="flex-end"
							>
								<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
									Balance: {selectedToken[0]?.balance}
								</Text>
								<Input
									fontSize="xl"
									border="none"
									w="85%"
									placeholder="0.00"
									textAlign="right"
									mt="2"
									px="1.5"
									type="number"
									_placeholder={{ color: theme.text.whiteGray }}
									_active={{ border: "none" }}
									name="inputFrom"
									onChange={handleOnChangeTokenInputs}
									value={tokenInputValue.inputFrom.value}
									_focus={{ outline: "none" }}
								/>
							</Flex>
						</Flex>
						{parseFloat(tokenInputValue.inputFrom.value) >
							parseFloat(selectedToken[0]?.balance) && (
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
						<Flex justifyContent="center" my="4">
							<MdAdd size={24} color={theme.text.cyanPurple} />
						</Flex>
						<Flex
							borderRadius={18}
							width="100%"
							height="max-content"
							px="4"
							py="2"
							bgColor={theme.bg.blueNavy}
							flexDirection="row"
							justifyContent="space-between"
							border="1px solid"
							borderColor={
								parseFloat(tokenInputValue.inputTo.value) >
									parseFloat(selectedToken[1]?.balance) ||
								parseFloat(tokenInputValue.inputTo.value) >
									parseFloat(selectedToken[1]?.balance)
									? theme.text.red400
									: "#ff000000"
							}
						>
							<Flex flexDirection="column" color={theme.text.mono}>
								<Text fontSize="sm">Input</Text>
								<Flex
									alignItems="center"
									justifyContent="center"
									py="1"
									mt="1"
									id="1"
									w="max-content"
									onClick={(event: React.MouseEvent<HTMLInputElement>) => {
										onOpenCoin();
										setButtonId(Number(event.currentTarget.id));
									}}
									borderRadius="2xl"
									cursor="pointer"
									_hover={{}}
								>
									<Img src={selectedToken[1]?.logoURI} w="6" h="6" />
									<Text
										fontSize="xl"
										fontWeight="500"
										px="3"
										_hover={{ opacity: "0.9" }}
									>
										{selectedToken[1]?.symbol}
									</Text>
									<Icon as={IoIosArrowDown} />
								</Flex>
							</Flex>
							<Flex
								ml="2"
								h="fit-content"
								position="relative"
								top="30px"
								onClick={() => handleMaxInput("inputTo")}
							>
								<Text
									color={theme.text.cyanPurple}
									_hover={{ cursor: "pointer", opacity: "0.8" }}
								>
									Max
								</Text>
							</Flex>
							<Flex
								flexDirection="column"
								color={theme.text.swapInfo}
								alignItems="flex-end"
							>
								<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
									Balance: {selectedToken[1]?.balance}
								</Text>
								<Input
									fontSize="xl"
									border="none"
									w="85%"
									placeholder="0.00"
									textAlign="right"
									mt="2"
									px="1.5"
									type="number"
									_placeholder={{ color: theme.text.whiteGray }}
									_active={{ border: "none" }}
									_focus={{
										outline: "none",
									}}
									name="inputTo"
									value={tokenInputValue.inputTo.value}
									onChange={handleOnChangeTokenInputs}
								/>
							</Flex>
						</Flex>
						{parseFloat(tokenInputValue.inputTo.value) >
							parseFloat(selectedToken[1]?.balance) && (
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
						{tokenInputValue.inputTo.value &&
							tokenInputValue.inputFrom.value &&
							!invalidPair && (
								<Flex
									flexDirection="column"
									borderRadius="2xl"
									bgColor="transparent"
									borderWidth="1px"
									borderColor={theme.text.cyanPurple}
									mt="1.5rem"
								>
									<Text
										fontSize="md"
										fontWeight="medium"
										px="1.375rem"
										py="0.5rem"
										color={theme.text.mono}
									>
										Prices and pool share
									</Text>
									<Flex
										flexDirection={["row", "row", "row", "row"]}
										justifyContent="space-between"
										py="0.5rem"
										px="1rem"
										borderRadius="2xl"
										borderWidth="1px"
										borderColor={theme.text.cyanPurple}
										bgColor={theme.bg.bluePink}
									>
										<Flex
											fontSize="sm"
											flexDirection={["column", "column", "column", "column"]}
											gap={["2", "0", "0", "0"]}
											textAlign="center"
										>
											<Text fontWeight="semibold">
												{currPair
													? currPair?.priceOf(currPair.token0).toSignificant(6)
													: "-"}
											</Text>
											<Text fontWeight="normal">
												{selectedToken[0]?.symbol} per{" "}
												{selectedToken[1]?.symbol}{" "}
											</Text>
										</Flex>
										<Flex
											fontSize="sm"
											flexDirection={["column", "column", "column", "column"]}
											gap={["2", "0", "0", "0"]}
											textAlign="center"
										>
											<Text fontWeight="semibold">
												{currPair
													? currPair?.priceOf(currPair.token1).toSignificant(6)
													: "-"}
											</Text>
											<Text fontWeight="normal">
												{selectedToken[1]?.symbol} per{" "}
												{selectedToken[0]?.symbol}
											</Text>
										</Flex>
										<Flex
											fontSize="sm"
											gap={["2", "0", "0", "0"]}
											flexDirection={["column", "column", "column", "column"]}
											textAlign="center"
										>
											<Text fontWeight="semibold">
												{currPoolShare ? currPoolShare : "-"}
											</Text>
											<Text fontWeight="normal">Share of Pool</Text>
										</Flex>
									</Flex>
								</Flex>
							)}
						<Flex>
							<Button
								w="100%"
								mt="1.5rem"
								py={["4", "4", "6", "6"]}
								px="6"
								borderRadius="67px"
								disabled={invalidPair || emptyInput || isPending}
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								fontSize="lg"
								fontWeight="semibold"
								_hover={{ bgColor: theme.bg.bluePurple }}
								onClick={
									approveTokenStatus === ApprovalState.NOT_APPROVED &&
									!isApproved
										? approve
										: addLiquidity
								}
							>
								{isCreate
									? "Create a pair"
									: invalidPair
									? "Invalid Pair"
									: approveTokenStatus === ApprovalState.NOT_APPROVED &&
									  !isApproved
									? `Approve ${tokenToApp?.symbol}`
									: "Add Liquidity"}
							</Button>
						</Flex>
					</Flex>
				</Flex>
				{tokenInputValue.inputTo.value &&
				tokenInputValue.inputFrom.value &&
				!invalidPair ? (
					<Flex
						flexDirection="column"
						p="1.5rem"
						background={theme.bg.subModal}
						position={["relative", "relative", "absolute", "absolute"]}
						bottom={["0", "-280", "-280", "-280"]}
						w="100%"
						borderTopRadius={["0", "0", "3xl", "3xl"]}
						borderBottomRadius={["0", "0", "3xl", "3xl"]}
						color={theme.text.mono}
					>
						<Text fontWeight="bold" fontSize="lg">
							Your position
						</Text>
						<Flex
							flexDirection="row"
							justifyContent="space-between"
							py="1.563rem"
						>
							<Flex fontSize="lg" fontWeight="bold" align="center">
								<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
								<Img src={selectedToken[1]?.logoURI} w="6" h="6" />
								<Text pl="2">
									{selectedToken[0]?.symbol}/{selectedToken[1]?.symbol}
								</Text>
							</Flex>
							<Text fontSize="lg" fontWeight="bold">
								{userPoolBalance ? userPoolBalance : "-"}
							</Text>
						</Flex>
						<Flex flexDirection="column">
							<Flex flexDirection="row" justifyContent="space-between">
								<Text fontWeight="semibold">Your pool share:</Text>
								<Text fontWeight="normal">
									{poolPercentShare === "0.00"
										? "<0.01%"
										: `${poolPercentShare}%`}
								</Text>
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Text fontWeight="semibold">{selectedToken[0]?.symbol}</Text>
								<Text fontWeight="normal">
									{depositedTokens
										? depositedTokens.token0?.toSignificant(6)
										: "-"}
								</Text>
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Text fontWeight="semibold">{selectedToken[1]?.symbol}</Text>
								<Text fontWeight="normal">
									{depositedTokens
										? depositedTokens.token1?.toSignificant(6)
										: "-"}
								</Text>
							</Flex>
						</Flex>
					</Flex>
				) : (
					<Flex
						flexDirection="row"
						p="1.5rem"
						bgColor={theme.bg.subModal}
						position={["relative", "relative", "absolute", "absolute"]}
						w="100%"
						bottom={["0", "0", "-250", "-250"]}
						borderTopRadius={["0", "0", "3xl", "3xl"]}
						borderBottomRadius={["0", "0", "3xl", "3xl"]}
						alignItems="flex-start"
						gap="2"
					>
						<Flex>
							<Icon
								as={MdOutlineInfo}
								w="6"
								h="6"
								color={theme.text.cyanPurple}
							/>
						</Flex>
						<Flex
							flexDirection="column"
							gap="6"
							fontSize={["sm", "sm", "md", "md"]}
						>
							<Text>
								By adding liquidity you’ll earn 0.25% of all trades on this pair
								proportional to your share of the pool.
							</Text>
							<Text>
								Fees are added to the pool, accrue in real time and can be
								claimed by withdrawing your liquidity.
							</Text>
						</Flex>
					</Flex>
				)}
			</ModalContent>
		</Modal>
	);
};
