import {
	Button,
	Flex,
	Modal,
	ModalContent,
	ModalHeader,
	Img,
	ModalOverlay,
	Text,
	Stack,
	Switch,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	useMediaQuery,
} from "@chakra-ui/react";
import { ChainId, Pair, Token } from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { useModal, usePicasso, useTokens, useWallet } from "hooks";
import { UseRemoveLiquidity } from "hooks/pools/useRemoveLiquidity";
import React, { useState, useEffect, useMemo } from "react";
import { MdHelpOutline, MdArrowBack } from "react-icons/md";
import { IDeposited, WrappedTokenInfo } from "types";
import { TooltipComponent } from "components/Tooltip/TooltipComponent";
import { useTranslation } from "react-i18next";
import { unwrappedToken } from "utils";
import {
	useWallet as psUseWallet,
	usePegasys,
	useTransaction,
} from "pegasys-services";
import { SelectCoinModal } from "./SelectCoin";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
	setSelectedToken: React.Dispatch<React.SetStateAction<WrappedTokenInfo[]>>;
	selectedToken: WrappedTokenInfo[];
	currPair: Pair | undefined;
	isCreate?: boolean;
	setSliderValue: React.Dispatch<React.SetStateAction<number>>;
	sliderValue: number;
	depositedTokens: IDeposited | undefined;
	poolPercentShare: string;
	userPoolBalance: string;
	allTokens: WrappedTokenInfo[];
	openPendingTx: () => void;
	closePendingTx: () => void;
}

export interface IAmounts {
	token0: string;
	token1: string;
}

export const RemoveLiquidity: React.FC<IModal> = props => {
	const {
		isModalOpen,
		onModalClose,
		isCreate,
		selectedToken,
		setSelectedToken,
		currPair,
		setSliderValue,
		sliderValue,
		depositedTokens,
		poolPercentShare,
		userPoolBalance,
		allTokens,
		openPendingTx,
		closePendingTx,
	} = props;
	const { t: translation } = useTranslation();

	const { userTokensBalance } = useTokens();
	const { currentLpAddress } = useWallet();
	const {
		setTransactions,
		transactions,
		setCurrentTxHash,
		setCurrentSummary,
		setApprovalState,
		approvalState,
	} = useTransaction();
	const { userSlippageTolerance, userTransactionDeadlineValue } = usePegasys();

	const { address, chainId, provider, signer } = psUseWallet();

	const theme = usePicasso();
	const [isMobile] = useMediaQuery("(max-width: 480px)");
	const { isOpenCoin, onCloseCoin } = useModal();
	const [buttonId] = useState<number>(0);
	const [txSignature, setTxSignature] = useState<boolean>(false);
	const [availableTokensAmount, setAvailableTokensAmount] = useState<IAmounts>({
		token0: "",
		token1: "",
	});
	const [receiveSys, setReceiveSys] = useState<boolean>(true);
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
	const walletInfos = {
		provider,
		walletAddress: address,
		chainId: currentChainId,
	};
	const WSYS = allTokens?.find(token => token?.symbol === "WSYS");
	const SYS = allTokens?.find(token => token?.symbol === "SYS");

	const currencyA = unwrappedToken(currPair?.token0 as Token);
	const currencyB = unwrappedToken(currPair?.token1 as Token);

	const haveSys = [currencyA, currencyB].some(item => item?.symbol === "SYS");
	const haveWsys = selectedToken.some(item => item?.symbol === "WSYS");

	const slideValidation =
		sliderValue === 0 ||
		sliderValue === 25 ||
		sliderValue === 50 ||
		sliderValue === 75 ||
		sliderValue === 100;

	const { onAttemptToApprove, onRemove, onSlide } = UseRemoveLiquidity(
		currentLpAddress,
		sliderValue,
		walletInfos,
		signer as Signer,
		selectedToken,
		userSlippageTolerance,
		setTransactions,
		transactions,
		setCurrentTxHash,
		setCurrentSummary,
		setApprovalState,
		approvalState,
		setTxSignature,
		userTransactionDeadlineValue,
		closePendingTx
	);

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
		setTxSignature(false);
	}, [isModalOpen]);

	useMemo(() => {
		setTxSignature(false);

		if (isModalOpen && slideValidation)
			onSlide(setAvailableTokensAmount, sliderValue);
	}, [sliderValue]);

	useEffect(() => {
		if (haveSys) {
			if (receiveSys) {
				if (haveWsys) {
					const newTokens = selectedToken.map(item => {
						if (item.symbol === "WSYS" && item) {
							item = SYS as WrappedTokenInfo;
							return item;
						}
						return item;
					});
					setSelectedToken(newTokens);
					return;
				}
				setSelectedToken(selectedToken);
			}
			const newTokens = selectedToken.map(item => {
				if (item.symbol === "SYS" && item) {
					item = WSYS as WrappedTokenInfo;
					return item;
				}
				return item;
			});
			setSelectedToken(newTokens);
		}
	}, [receiveSys]);

	return (
		<Modal
			blockScrollOnMount={false}
			isOpen={isModalOpen}
			onClose={onModalClose}
		>
			<SelectCoinModal
				isOpen={isOpenCoin}
				onClose={onCloseCoin}
				selectedToken={selectedToken}
				setSelectedToken={setSelectedToken}
				buttonId={buttonId}
			/>
			<ModalOverlay />
			<ModalContent
				h="max-content"
				mb={["0", "25rem", "25rem", "25rem"]}
				border={[
					"none",
					"1px solid transparent",
					"1px solid transparent",
					"1px solid transparent",
				]}
				borderTop="1px solid transparent"
				borderTopRadius="30px"
				borderBottomRadius={["0", "30px", "30px", "30px"]}
				background={`linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					display="flex"
					alignItems="baseline"
					justifyContent="space-between"
					p="1.5rem"
				>
					<Flex alignItems="center" color={theme.text.mono}>
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
							{translation("navigationTabs.removeLiquidity")}
						</Text>
					</Flex>
					<TooltipComponent
						label={translation("navigationTabs.whenYouAddLiquidityInfo")}
						icon={MdHelpOutline}
					/>
				</ModalHeader>
				<Flex flexDirection="column" p="1.5rem">
					<Flex
						bgColor={theme.bg.blueNavy}
						flexDirection="column"
						borderRadius="2xl"
						mt="4"
						px="5"
						py="5"
						color={theme.text.mono}
					>
						<Flex
							flexDirection="row"
							justifyContent="flex-start"
							fontSize="md"
							fontWeight="medium"
						>
							<Text>{translation("removeLiquidity.amount")}</Text>
						</Flex>
						<Flex
							flexDirection="row"
							alignItems="center"
							justifyContent="space-between"
							pt="6"
						>
							<Flex>
								<Text fontSize="4xl" fontWeight="medium">
									{sliderValue}%
								</Text>
							</Flex>
							<Flex flexDirection="column">
								<Flex
									alignItems="center"
									gap="2"
									justifyContent="space-between"
								>
									<Text fontSize="xl" fontWeight="medium">
										{availableTokensAmount.token0 && sliderValue !== 0
											? availableTokensAmount.token0
											: "0.0000000"}
									</Text>
									<Text fontSize="md" fontWeight="normal">
										{selectedToken[0]?.symbol}
									</Text>
								</Flex>
								<Flex
									alignItems="center"
									gap="2"
									justifyContent="space-between"
								>
									<Text fontSize="xl" fontWeight="medium">
										{availableTokensAmount.token1 && sliderValue !== 0
											? availableTokensAmount.token1
											: "0.0000000"}
									</Text>
									<Text fontSize="md" fontWeight="normal">
										{selectedToken[1]?.symbol}
									</Text>
								</Flex>
							</Flex>
						</Flex>
						<Slider
							color={theme.text.softGray}
							id="slider"
							mt="9"
							defaultValue={0}
							value={sliderValue}
							min={0}
							max={100}
							mb="2"
							size="lg"
							colorScheme="red"
							onChange={(value: number) => {
								setSliderValue(value);
								onSlide(setAvailableTokensAmount, value);
								setTxSignature(false);
							}}
						>
							<SliderTrack>
								<SliderFilledTrack bg={theme.text.psysBalance} />
							</SliderTrack>

							<SliderThumb />
						</Slider>
						<Flex w="100%" justifyContent="space-between">
							<Flex
								cursor="pointer"
								fontSize="sm"
								ml="1.5"
								color={theme.text.softGray}
								onClick={() => setSliderValue(0)}
							>
								0%
							</Flex>
							<Flex
								cursor="pointer"
								ml="-2.5"
								fontSize="sm"
								color={theme.text.softGray}
								onClick={() => setSliderValue(25)}
							>
								25%
							</Flex>
							<Flex
								cursor="pointer"
								ml="-2.5"
								fontSize="sm"
								color={theme.text.softGray}
								onClick={() => setSliderValue(50)}
							>
								50%
							</Flex>
							<Flex
								cursor="pointer"
								ml="-2.5"
								fontSize="sm"
								color={theme.text.softGray}
								onClick={() => setSliderValue(75)}
							>
								75%
							</Flex>
							<Flex
								cursor="pointer"
								ml="-8"
								fontSize="sm"
								color={theme.text.softGray}
								onClick={() => setSliderValue(100)}
							>
								100%
							</Flex>
						</Flex>
					</Flex>

					<Flex flexDirection="column" py="6" color={theme.text.mono}>
						{haveSys && (
							<Flex flexDirection="row" justifyContent="space-between">
								<Text fontWeight="medium" fontSize="md">
									{translation("removeLiquidity.receive")}
								</Text>
								<Flex flexDirection="row">
									<Stack align="center" direction="row">
										<Text>WSYS</Text>
										<Switch
											size="md"
											defaultChecked
											onChange={e => setReceiveSys(e.target.checked)}
										/>
										<Text>SYS</Text>
									</Stack>
								</Flex>
							</Flex>
						)}
						<Flex flexDirection="row" justifyContent="space-between" pt="6">
							<Text fontWeight="medium" fontSize="md">
								{translation("removeLiquidity.price")}
							</Text>
							<Flex flexDirection="column">
								<Flex flexDirection="row">
									<Text fontSize="sm">
										{currPair
											? `1 ${selectedToken[0]?.symbol} = ${currPair
													?.priceOf(currPair?.token0)
													.toSignificant(6)} ${currencyB?.symbol}`
											: "-"}
									</Text>
								</Flex>
								<Flex flexDirection="row">
									<Text fontSize="sm">
										{currPair
											? `1 ${selectedToken[1]?.symbol} = ${currPair
													?.priceOf(currPair?.token1)
													.toSignificant(6)} ${currencyA?.symbol}`
											: "-"}
									</Text>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
					<Flex>
						<Button
							w="100%"
							py="6"
							px="6"
							disabled={sliderValue === 0}
							onClick={
								!txSignature
									? onAttemptToApprove
									: () => {
											onRemove();
											openPendingTx();
											onModalClose();
									  }
							}
							borderRadius="67px"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							fontSize="lg"
							fontWeight="semibold"
							_hover={{
								bgColor: theme.bg.bluePurple,
							}}
						>
							{isCreate
								? "Create a pair"
								: !txSignature
								? translation("removeLiquidity.sign")
								: translation("navigationTabs.removeLiquidity")}
						</Button>
					</Flex>
				</Flex>
				<Flex p="0">
					<Flex
						flexDirection="column"
						p="1.5rem"
						background={isMobile ? theme.bg.subModalMobile : theme.bg.subModal}
						position={["relative", "absolute", "absolute", "absolute"]}
						top={["0", "36.6rem", "37rem", "37rem"]}
						left="0"
						mt={["1rem", "0", "0", "0"]}
						w="100%"
						borderTopRadius={["0", "30px", "30px", "30px"]}
						borderBottomRadius={["0", "30px", "30px", "30px"]}
					>
						<Text fontWeight="bold" fontSize="lg">
							{translation("positionCard.yourPosition")}
						</Text>
						<Flex
							flexDirection="row"
							justifyContent="space-between"
							py="1.563rem"
						>
							<Flex fontSize="lg" fontWeight="bold" align="center">
								<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
								<Img src={selectedToken[1]?.logoURI} w="6" h="6" />
								<Text pl="2">{`${selectedToken[0]?.symbol}/${selectedToken[1]?.symbol}`}</Text>
							</Flex>
							<Text fontSize="lg" fontWeight="bold">
								{userPoolBalance || "-"}
							</Text>
						</Flex>
						<Flex flexDirection="column">
							<Flex flexDirection="row" justifyContent="space-between">
								<Text fontWeight="semibold">
									{translation("positionCard.poolShare")}
								</Text>
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
								<Text fontWeight="semibold">{currencyA?.symbol}</Text>
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
								<Text fontWeight="semibold">{currencyB?.symbol}</Text>
								<Text fontWeight="normal">
									{" "}
									{depositedTokens
										? depositedTokens.token1?.toSignificant(6)
										: "-"}
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
