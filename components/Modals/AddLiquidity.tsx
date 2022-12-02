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
	Collapse,
	toast,
	useMediaQuery,
	useColorMode,
} from "@chakra-ui/react";
import { useModal, usePicasso, useWallet, useAllCommonPairs } from "hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	MdHelpOutline,
	MdArrowBack,
	MdAdd,
	MdOutlineInfo,
} from "react-icons/md";
import { IDeposited, IInputValues, WrappedTokenInfo } from "types";
import { TooltipComponent } from "components/Tooltip/TooltipComponent";
import { useTranslation } from "react-i18next";
import {
	PoolServices,
	useWallet as psUseWallet,
	usePegasys,
	PegasysContracts,
	ONE_BIPS,
	ApprovalState,
	useTransaction,
	useToasty,
	PersistentFramework,
} from "pegasys-services";
import {
	getTokenAllowance,
	getTotalSupply,
	tryParseAmount,
	wrappedCurrencyAmount,
	maxAmountSpend,
} from "utils";
import {
	ChainId,
	JSBI,
	Pair,
	Percent,
	TokenAmount,
} from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { parseUnits } from "@ethersproject/units";
import { SelectCoinModal } from "./SelectCoin";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
	isCreate?: boolean;
	haveValue?: boolean;
	setSelectedToken: React.Dispatch<React.SetStateAction<WrappedTokenInfo[]>>;
	selectedToken: WrappedTokenInfo[];
	depositedTokens: IDeposited | undefined;
	poolPercentShare: string;
	userPoolBalance: string;
	currPair: Pair | undefined;
	openPendingTx: () => void;
	closePendingTx: () => void;
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
		openPendingTx,
		closePendingTx,
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

	const { t: translation, i18n } = useTranslation();
	const theme = usePicasso();
	const { isOpenCoin, onCloseCoin } = useModal();
	const [buttonId] = useState<number>(0);
	const { colorMode } = useColorMode();
	const [tokenInputValue, setTokenInputValue] = useState<ITokenInputValue>(
		initialTokenInputValue
	);
	const [approveTokenStatus, setApproveTokenStatus] = useState<ApprovalState>(
		ApprovalState.UNKNOWN
	);
	const [tokenToApp, setTokenToApp] = useState<WrappedTokenInfo>();
	const [amountToApp, setAmountToApp] = useState<TokenAmount>();
	const [liquidityMintendValue, setLiquidityMintedValue] =
		useState<TokenAmount>();
	const [amounts, setAmounts] = useState<TokenAmount[]>([]);
	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const [currPoolShare, setCurrPoolShare] = useState<string>("");
	const [currPendingTx, setCurrPendingTx] = useState<string>("");
	const [finishApproveTx, setFinishApproveTx] = useState<boolean>(false);
	const { setCurrentLpAddress } = useWallet();
	const { pendingTxs, finishedTxs, addTransactions } = useTransaction();
	const { address, chainId, isConnected, signer, provider } = psUseWallet();
	const { userSlippageTolerance, userTransactionDeadlineValue } = usePegasys();
	const { toast } = useToasty();

	let currentChainId: ChainId;

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

	const router = PegasysContracts[currentChainId].ROUTER_ADDRESS;

	const { language } = i18n;

	const walletInfo = useMemo(
		() => ({
			walletAddress: address,
			chainId: currentChainId,
			provider,
		}),
		[chainId, address, provider]
	);

	const invalidPair =
		(selectedToken[0]?.symbol === "SYS" &&
			selectedToken[1]?.symbol === "WSYS") ||
		(selectedToken[0]?.symbol === "WSYS" && selectedToken[1]?.symbol === "SYS");

	const isPending = useMemo(() => {
		if (pendingTxs.length) {
			return true;
		}

		return false;
	}, [chainId, pendingTxs]);

	const inputValidation =
		parseFloat(tokenInputValue.inputTo.value) >
			parseFloat(selectedToken[1]?.formattedBalance) ||
		parseFloat(tokenInputValue.inputFrom.value) >
			parseFloat(selectedToken[0]?.formattedBalance);

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
		}
	};

	const currencyBalances = {
		inputFrom: tryParseAmount(
			selectedToken[0]?.formattedBalance,
			selectedToken[0]
		),
		inputTo: tryParseAmount(
			selectedToken[1]?.formattedBalance,
			selectedToken[1]
		),
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
							value: maxAmounts?.inputFrom?.toExact() as string,
						},
						lastInputTyped: 0,
						currentInputTyped: "inputFrom",
						typedValue: maxAmounts?.inputFrom?.toExact() as string,
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

	useEffect(() => {
		const onInputChange = async () => {
			const {
				inputTo: { value: inputToValue },
				inputFrom: { value: inputFromValue },
				currentInputTyped,
			} = tokenInputValue;

			if (currentInputTyped === "inputFrom" && currPair) {
				const parseInputValue = tryParseAmount(
					inputFromValue,
					selectedToken[0]
				);
				const wrappedAmountValue = wrappedCurrencyAmount(
					parseInputValue,
					currentChainId
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
					currentChainId
				);
				const quoteValue =
					wrappedAmountValue &&
					currPair?.priceOf(currPair?.token1)?.quote(wrappedAmountValue);

				tokenInputValue.inputFrom.value =
					inputToValue && quoteValue ? quoteValue?.toSignificant(6) : "";
			}
		};

		onInputChange();
	}, [tokenInputValue]);

	useEffect(() => {
		const onInputChange = async () => {
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
				wrappedCurrencyAmount(currencyAmountA, currentChainId),
				wrappedCurrencyAmount(currencyAmountB, currentChainId),
			];

			const liquidityMinted =
				currPair &&
				tokenAmountA &&
				tokenAmountB &&
				currPair.getLiquidityMinted(
					totalSupply as TokenAmount,
					tokenAmountA,
					tokenAmountB
				);

			setLiquidityMintedValue(liquidityMinted);

			const poolPercentageShare =
				liquidityMinted &&
				totalSupply &&
				new Percent(
					liquidityMinted?.raw,
					totalSupply?.add(liquidityMinted).raw
				);

			setCurrPoolShare(
				poolPercentageShare?.lessThan(ONE_BIPS)
					? "<0.01%"
					: `${poolPercentageShare?.toFixed(2)}%` ?? "0%"
			);
		};

		onInputChange();
	}, [tokenInputValue]);

	useEffect(() => {
		const getIsApproved = async () => {
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
		};

		getIsApproved();
	}, [tokenInputValue, isModalOpen]);

	const languageList = ["de", "fr", "es"];

	const approve = async () => {
		await PoolServices.approve({
			approvalState: approveTokenStatus,
			amountToApprove: amountToApp,
		})
			.then(res => {
				if (res?.spender) {
					setApproveTokenStatus(ApprovalState.APPROVED);
					addTransactions({
						hash: res.hash,
						summary: `Approve ${tokenToApp?.symbol}`,
						service: "poolsApproveAddLiquidity",
					});
					closePendingTx();
				}
			})
			.catch(err => console.log(err));
	};

	const addLiquidity = async () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const pairs = await useAllCommonPairs(
			selectedToken[0],
			selectedToken[1] ?? selectedToken[0],
			walletInfo
		);

		const pair = pairs[0];

		setCurrentLpAddress(pair.liquidityToken.address);

		await PoolServices.addLiquidity({
			tokens: selectedToken as [WrappedTokenInfo, WrappedTokenInfo],
			values: [tokenInputValue.inputFrom.value, tokenInputValue.inputTo.value],
			haveValue,
			slippage: userSlippageTolerance,
			userDeadline: userTransactionDeadlineValue,
			pair,
		})
			.then(res => {
				addTransactions({
					hash: res.hash,
					summary: `Add ${tokenInputValue.inputFrom.value} ${selectedToken[0]?.symbol} and ${tokenInputValue.inputTo.value} ${selectedToken[1]?.symbol}`,
					service: "poolsAddLiquidity",
				});
			})
			.catch(err => {
				toast({
					id: "toast1",
					position: "top-right",
					status: "error",
					title: "error while adding liquidity",
				});
				console.log(err);
			});
	};

	const approveAddLiquidityPendingTxs = useMemo(() => {
		if (!chainId) return [];

		return pendingTxs.filter(tx => tx.service === "poolsApproveAddLiquidity");
	}, [pendingTxs, chainId]);

	useEffect(() => {
		if (chainId) {
			if (approveAddLiquidityPendingTxs.length) {
				setCurrPendingTx(
					approveAddLiquidityPendingTxs[
						approveAddLiquidityPendingTxs.length - 1
					].hash
				);
				PersistentFramework.add("currentApproveAddLiquidityPendingTxs", {
					hash: approveAddLiquidityPendingTxs[
						approveAddLiquidityPendingTxs.length - 1
					].hash,
				});
				setFinishApproveTx(false);
			} else if (currPendingTx) {
				const currFullTx = finishedTxs.find(tx => tx.hash === currPendingTx);

				if (currFullTx?.success) {
					setFinishApproveTx(true);
					setCurrPendingTx("");
					PersistentFramework.remove("currentApproveAddLiquidityPendingTxs");
				} else {
					setCurrPendingTx("");
					PersistentFramework.remove("currentApproveAddLiquidityPendingTxs");
					setFinishApproveTx(false);
				}
			} else {
				setCurrPendingTx("");
				PersistentFramework.remove("currentApproveAddLiquidityPendingTxs");
				setFinishApproveTx(false);
			}
		}
	}, [approveAddLiquidityPendingTxs, chainId]);

	useEffect(() => {
		const currentApproveAddLiquidityPendingTx = PersistentFramework.get(
			"currentApproveAddLiquidityPendingTxs"
		);

		if (currentApproveAddLiquidityPendingTx) {
			setCurrPendingTx(
				(currentApproveAddLiquidityPendingTx as { hash: string }).hash
			);
		}
	}, []);

	useEffect(() => {
		setTokenInputValue(initialTokenInputValue);
		setApproveTokenStatus(ApprovalState.UNKNOWN);
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
				top={["9.5rem", "2rem", "2rem", "2rem"]}
				position={["absolute", "relative", "relative", "relative"]}
				mb={["0", "25rem", "25rem", "25rem"]}
				borderTopRadius="30px"
				h="max-content"
				borderBottomRadius={["0", "30px", "30px", "30px"]}
				boxShadow={
					colorMode === "light"
						? "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
						: "none"
				}
				border={[
					"none",
					"1px solid transparent",
					"1px solid transparent",
					"1px solid transparent",
				]}
				borderTop="1px solid transparent"
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
							{translation("positionCard.add")}
						</Text>
					</Flex>
					<TooltipComponent
						label={translation("navigationTabs.whenYouAddLiquidityInfo")}
						icon={MdHelpOutline}
						color={theme.icon.whiteGray}
					/>
				</ModalHeader>

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
							flexDirection="column"
							justifyContent="space-between"
							border="1px solid"
							borderColor={
								parseFloat(tokenInputValue.inputFrom.value) >
								parseFloat(selectedToken[0]?.formattedBalance)
									? theme.text.red400
									: "#ff000000"
							}
							transition="500ms ease-in-out"
						>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								color={theme.text.mono}
							>
								<Text fontSize="sm">Input</Text>
								<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
									{translation("currencyInputPanel.balance")}{" "}
									{selectedToken[0]?.formattedBalance}
								</Text>
							</Flex>

							<Flex
								flexDirection="row"
								justifyContent="space-between"
								color={theme.text.swapInfo}
							>
								<Flex
									alignItems="center"
									justifyContent="center"
									py="1"
									mt="1"
									id="0"
									w="max-content"
									ml="3"
									borderRadius="2xl"
									cursor="default"
									_hover={{}}
								>
									<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
									<Text
										fontSize="xl"
										fontWeight="500"
										px="3"
										_hover={{ opacity: "0.9" }}
										color={theme.text.mono}
									>
										{selectedToken[0]?.symbol}
									</Text>
								</Flex>
								<Flex
									ml="3"
									h="fit-content"
									position="relative"
									top="14px"
									onClick={() => handleMaxInput("inputFrom")}
								>
									<Text
										color={theme.text.cyanPurple}
										_hover={{ cursor: "pointer", opacity: "0.8" }}
									>
										Max
									</Text>
								</Flex>

								<Input
									fontSize="xl"
									border="none"
									w="85%"
									placeholder="0.00"
									textAlign="right"
									mt="2"
									px="1.5"
									pl="4"
									_placeholder={{ color: theme.text.whiteGray }}
									_active={{ border: "none" }}
									name="inputFrom"
									onChange={handleOnChangeTokenInputs}
									value={tokenInputValue.inputFrom.value}
									_focus={{ outline: "none" }}
								/>
							</Flex>
						</Flex>
						{tokenInputValue.inputFrom.value && (
							<Flex flexDirection="row" gap="1" justifyContent="center">
								<Collapse
									in={
										parseFloat(tokenInputValue.inputFrom.value) >
										parseFloat(selectedToken[0]?.formattedBalance)
									}
								>
									<Flex flexDirection="row" gap="1" justifyContent="center">
										<Text
											fontSize="sm"
											pt="2"
											textAlign="center"
											color={theme.text.red400}
											fontWeight="semibold"
										>
											{translation("swapHooks.insufficient")}{" "}
											{selectedToken[0]?.symbol}{" "}
											{translation("swapHooks.balance")}.{" "}
											{translation("swapHooks.validAmount")}.
										</Text>
									</Flex>
								</Collapse>
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
							flexDirection="column"
							justifyContent="space-between"
							border="1px solid"
							borderColor={
								parseFloat(tokenInputValue.inputTo.value) >
								parseFloat(selectedToken[1]?.formattedBalance)
									? theme.text.red400
									: "#ff000000"
							}
							transition="500ms ease-in-out"
						>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								color={theme.text.mono}
							>
								<Text fontSize="sm">Input</Text>
								<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
									{translation("currencyInputPanel.balance")}{" "}
									{selectedToken[1]?.formattedBalance}
								</Text>
							</Flex>

							<Flex
								flexDirection="row"
								justifyContent="space-between"
								color={theme.text.swapInfo}
							>
								<Flex
									alignItems="center"
									justifyContent="center"
									py="1"
									mt="1"
									id="1"
									w="max-content"
									ml="3"
									borderRadius="2xl"
									cursor="default"
									_hover={{}}
								>
									<Img src={selectedToken[1]?.logoURI} w="6" h="6" />
									<Text
										fontSize="xl"
										fontWeight="500"
										px="3"
										_hover={{ opacity: "0.9" }}
										color={theme.text.mono}
									>
										{selectedToken[1]?.symbol}
									</Text>
								</Flex>
								<Flex
									ml="3"
									h="fit-content"
									position="relative"
									top="14px"
									onClick={() => handleMaxInput("inputTo")}
								>
									<Text
										color={theme.text.cyanPurple}
										_hover={{ cursor: "pointer", opacity: "0.8" }}
									>
										Max
									</Text>
								</Flex>

								<Input
									fontSize="xl"
									border="none"
									w="85%"
									placeholder="0.00"
									textAlign="right"
									mt="2"
									px="1.5"
									pl="4"
									_placeholder={{ color: theme.text.whiteGray }}
									_active={{ border: "none" }}
									name="inputTo"
									onChange={handleOnChangeTokenInputs}
									value={tokenInputValue.inputTo.value}
									_focus={{ outline: "none" }}
								/>
							</Flex>
						</Flex>
						{tokenInputValue.inputTo.value && (
							<Flex flexDirection="row" gap="1" justifyContent="center">
								<Collapse
									in={
										parseFloat(tokenInputValue.inputTo.value) >
										parseFloat(selectedToken[1]?.formattedBalance)
									}
								>
									<Flex flexDirection="row" gap="1" justifyContent="center">
										<Text
											fontSize="sm"
											pt="2"
											textAlign="center"
											color={theme.text.red400}
											fontWeight="semibold"
										>
											{translation("swapHooks.insufficient")}{" "}
											{selectedToken[1]?.symbol}{" "}
											{translation("swapHooks.balance")}.{" "}
											{translation("swapHooks.validAmount")}.
										</Text>
									</Flex>
								</Collapse>
							</Flex>
						)}

						<Collapse
							in={
								(tokenInputValue.inputTo.value &&
									tokenInputValue.inputFrom.value &&
									!invalidPair) === true
							}
						>
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
									{translation("addLiquidity.prices")}{" "}
									{translation("addLiquidity.poolShare")}
								</Text>
								<Flex
									flexDirection={["row", "row", "row", "row"]}
									justifyContent="space-between"
									py="0.5rem"
									px="1rem"
									borderRadius="2xl"
									borderTop="1px solid"
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
											{selectedToken[0]?.symbol}
											{translation("addLiquidity.per")}
											{selectedToken[1]?.symbol}
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
											{selectedToken[1]?.symbol}
											{translation("addLiquidity.per")}
											{selectedToken[0]?.symbol}
										</Text>
									</Flex>
									<Flex
										fontSize="sm"
										gap={["2", "0", "0", "0"]}
										flexDirection={["column", "column", "column", "column"]}
										textAlign="center"
									>
										<Text fontWeight="semibold">{currPoolShare || "-"}</Text>
										<Text fontWeight="normal">
											{translation("addLiquidity.shareOfPool")}
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Collapse>

						<Flex>
							<Button
								w="100%"
								mt="1.5rem"
								py={["4", "4", "6", "6"]}
								px="6"
								borderRadius="67px"
								disabled={invalidPair || emptyInput || inputValidation}
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								fontSize="lg"
								fontWeight="semibold"
								_hover={
									invalidPair || emptyInput || isPending || inputValidation
										? { opacity: "0.3" }
										: { bgColor: theme.bg.bluePurple }
								}
								onClick={
									approveTokenStatus === ApprovalState.NOT_APPROVED &&
									!finishApproveTx
										? () => {
												approve();
												openPendingTx();
										  }
										: () => {
												addLiquidity();
												openPendingTx();
												onModalClose();
										  }
								}
							>
								{isCreate
									? "Create a pair"
									: invalidPair
									? "Invalid Pair"
									: approveTokenStatus === ApprovalState.NOT_APPROVED &&
									  !finishApproveTx
									? `${translation("earn.approve")} ${tokenToApp?.symbol}`
									: translation("positionCard.add")}
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
						pb={["3rem", "1.5rem", "1.5rem", "1.5rem"]}
						transition="200ms"
						background={isMobile ? theme.bg.subModalMobile : theme.bg.subModal}
						position={["relative", "absolute", "absolute", "absolute"]}
						top={
							parseFloat(tokenInputValue.inputTo.value) >
								parseFloat(selectedToken[1]?.formattedBalance) &&
							parseFloat(tokenInputValue.inputFrom.value) >
								parseFloat(selectedToken[0]?.formattedBalance)
								? languageList.includes(language)
									? ["unset", "42rem", "42rem", "42rem"]
									: ["unset", "38.5rem", "39.5rem", "39.5rem"]
								: parseFloat(tokenInputValue.inputTo.value) >
										parseFloat(selectedToken[1]?.formattedBalance) ||
								  parseFloat(tokenInputValue.inputFrom.value) >
										parseFloat(selectedToken[0]?.formattedBalance)
								? languageList.includes(language)
									? ["unset", "38rem", "39rem", "39rem"]
									: ["unset", "37rem", "38rem", "38rem"]
								: ["unset", "35.5rem", "36rem", "36rem"]
						}
						w="100%"
						borderRadius={["0", "30px", "30px", "30px"]}
						color={theme.text.mono}
					>
						<Text fontWeight="bold" fontSize="lg">
							{translation("positionCard.yourPosition")}
						</Text>
						<Flex
							flexDirection="row"
							justifyContent="space-between"
							py="1.563rem"
						>
							<Flex
								fontSize="lg"
								fontWeight="bold"
								align="center"
								position="relative"
							>
								<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
								<Img
									src={selectedToken[1]?.logoURI}
									w="6"
									h="6"
									position="absolute"
									left="1.3rem"
								/>
								<Text pl="2" ml="1.2rem">
									{selectedToken[0]?.symbol}/{selectedToken[1]?.symbol}
								</Text>
							</Flex>
							<Text fontSize="lg" fontWeight="bold">
								{liquidityMintendValue
									? Number(userPoolBalance) +
									  Number(liquidityMintendValue?.toSignificant(6))
									: userPoolBalance || "-"}
							</Text>
						</Flex>
						<Flex flexDirection="column">
							<Flex flexDirection="row" justifyContent="space-between">
								<Text fontWeight="semibold">
									{translation("positionCard.poolShare")}
								</Text>
								<Text fontWeight="normal">
									{poolPercentShare === "0.00" &&
									depositedTokens?.token0?.toSignificant(6) !== "0" &&
									depositedTokens?.token1?.toSignificant(6) !== "0"
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
										? Number(depositedTokens.token0?.toSignificant(6)) +
										  Number(tokenInputValue.inputFrom.value)
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
										? Number(depositedTokens.token1?.toSignificant(6)) +
										  Number(tokenInputValue.inputTo.value)
										: "-"}
								</Text>
							</Flex>
						</Flex>
					</Flex>
				) : (
					<Flex
						flexDirection="row"
						p="1.5rem"
						pb={["3rem", "1.5rem", "1.5rem", "1.5rem"]}
						background={isMobile ? theme.bg.subModalMobile : theme.bg.subModal}
						position={["relative", "absolute", "absolute", "absolute"]}
						w="100%"
						top={["unset", "27rem", "28rem", "28rem"]}
						borderRadius={["0", "30px", "30px", "30px"]}
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
							<Text textAlign="justify">
								{translation("positionCard.byAddingLiquidityInfo1")}
							</Text>
							<Text textAlign="justify">
								{translation("positionCard.byAddingLiquidityInfo2")}
							</Text>
						</Flex>
					</Flex>
				)}
			</ModalContent>
		</Modal>
	);
};
