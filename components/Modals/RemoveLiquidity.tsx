import {
	Button,
	Flex,
	Icon,
	Modal,
	ModalContent,
	ModalHeader,
	Img,
	ModalOverlay,
	Text,
	Tooltip,
	Stack,
	Switch,
	Slider,
	SliderMark,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
} from "@chakra-ui/react";
import { ChainId, Pair, Token } from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { useModal, usePicasso, useTokens, useWallet } from "hooks";
import { UseRemoveLiquidity } from "hooks/pools/useRemoveLiquidity";
import React, { useState, useEffect } from "react";
import { MdHelpOutline, MdArrowBack } from "react-icons/md";
import { IDeposited, WrappedTokenInfo } from "types";
import { TooltipComponent } from "components/Tooltip/TooltipComponent";
import { useTranslation } from "react-i18next";
import { unwrappedToken } from "utils";
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
	} = props;
	const { t: translation } = useTranslation();

	const { userTokensBalance } = useTokens();
	const {
		provider,
		walletAddress,
		currentNetworkChainId,
		signer,
		userSlippageTolerance,
		setTransactions,
		transactions,
		setCurrentTxHash,
		setApprovalState,
		approvalState,
		userTransactionDeadlineValue,
		currentLpAddress,
	} = useWallet();

	const theme = usePicasso();
	const { isOpenCoin, onCloseCoin } = useModal();
	const [buttonId] = useState<number>(0);
	const [txSignature, setTxSignature] = useState<boolean>(false);
	const [availableTokensAmount, setAvailableTokensAmount] = useState<IAmounts>({
		token0: "",
		token1: "",
	});
	const [receiveSys, setReceiveSys] = useState<boolean>(true);
	const walletInfos = {
		provider,
		walletAddress,
		chainId: currentNetworkChainId === 5700 ? ChainId.TANENBAUM : ChainId.NEVM,
	};
	const WSYS = allTokens?.find(token => token?.symbol === "WSYS");
	const SYS = allTokens?.find(token => token?.symbol === "SYS");

	const currencyA = unwrappedToken(currPair?.token0 as Token);
	const currencyB = unwrappedToken(currPair?.token1 as Token);

	const haveSys = [currencyA, currencyB].some(item => item?.symbol === "SYS");
	const haveWsys = selectedToken.some(item => item?.symbol === "WSYS");

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
		setApprovalState,
		approvalState,
		setTxSignature,
		userTransactionDeadlineValue
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
				h={["100%", "100%", "max-content", "max-content"]}
				p="1.5rem"
				border={["none", "1px solid transparent"]}
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				background={`linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					display="flex"
					alignItems="baseline"
					justifyContent="space-between"
					px="0"
					py="0"
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
							Remove Liquidity
						</Text>
					</Flex>
					<TooltipComponent
						label={translation("navigationTabs.whenYouAddLiquidityInfo")}
						icon={MdHelpOutline}
					/>
				</ModalHeader>
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
						justifyContent="space-between"
						fontSize="md"
						fontWeight="medium"
					>
						<Text>Amount</Text>
						<Text color={theme.text.cyanPurple}>Detailed</Text>
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
							<Flex alignItems="center" gap="2" justifyContent="space-between">
								<Text fontSize="xl" fontWeight="medium">
									{availableTokensAmount.token0 && sliderValue !== 0
										? availableTokensAmount.token0
										: "0.0000000"}
								</Text>
								<Text fontSize="md" fontWeight="normal">
									{currencyA?.symbol}
								</Text>
							</Flex>
							<Flex alignItems="center" gap="2" justifyContent="space-between">
								<Text fontSize="xl" fontWeight="medium">
									{availableTokensAmount.token1 && sliderValue !== 0
										? availableTokensAmount.token1
										: "0.0000000"}
								</Text>
								<Text fontSize="md" fontWeight="normal">
									{currencyB?.symbol}
								</Text>
							</Flex>
						</Flex>
					</Flex>
					<Slider
						color={theme.text.transactionsItems}
						id="slider"
						mt="9"
						defaultValue={0}
						min={0}
						max={100}
						mb="6"
						size="lg"
						colorScheme="red"
						onChange={(value: number) => {
							setSliderValue(value);
							onSlide(setAvailableTokensAmount);
						}}
					>
						<SliderMark value={0} mt="1rem" ml="1.5" fontSize="sm">
							0%
						</SliderMark>
						<SliderMark value={25} mt="1rem" ml="-2.5" fontSize="sm">
							25%
						</SliderMark>
						<SliderMark value={50} mt="1rem" ml="-2.5" fontSize="sm">
							50%
						</SliderMark>
						<SliderMark value={75} mt="1rem" ml="-2.5" fontSize="sm">
							75%
						</SliderMark>
						<SliderMark value={100} mt="1rem" ml="-8" fontSize="sm">
							100%
						</SliderMark>
						<SliderTrack>
							<SliderFilledTrack bg={theme.text.psysBalance} />
						</SliderTrack>

						<SliderThumb />
					</Slider>
				</Flex>

				<Flex flexDirection="column" py="6" color={theme.text.mono}>
					{haveSys && (
						<Flex flexDirection="row" justifyContent="space-between">
							<Text fontWeight="medium" fontSize="md">
								Recive
							</Text>
							<Flex flexDirection="row">
								<Stack align="center" direction="row">
									<Text>WSYS</Text>
									<Switch
										size="md"
										colorScheme="cyan"
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
							Price
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
						onClick={!txSignature ? onAttemptToApprove : onRemove}
						borderRadius="67px"
						bgColor={theme.bg.blueNavyLightness}
						color={theme.text.cyan}
						fontSize="lg"
						fontWeight="semibold"
						_hover={{
							bgColor: theme.bg.bluePurple,
						}}
					>
						{isCreate ? "Create a pair" : "Remove Liquidity"}
					</Button>
				</Flex>
				<Flex
					flexDirection="column"
					p="1.5rem"
					background={theme.bg.subModal}
					position={["absolute", "absolute", "absolute", "absolute"]}
					bottom={["-245", "-245", "-280", "-280"]}
					left={["0", "0", "0", "0"]}
					w="100%"
					borderTopRadius={["0", "0", "3xl", "3xl"]}
					borderBottomRadius={["0", "0", "3xl", "3xl"]}
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
							<Text pl="2">{`${selectedToken[0]?.symbol}/${selectedToken[1]?.symbol}`}</Text>
						</Flex>
						<Text fontSize="lg" fontWeight="bold">
							{userPoolBalance || "-"}
						</Text>
					</Flex>
					<Flex flexDirection="column">
						<Flex flexDirection="row" justifyContent="space-between">
							<Text fontWeight="semibold">Your pool share:</Text>
							<Text fontWeight="normal">
								{poolPercentShare ? `${poolPercentShare}%` : "-%"}
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
			</ModalContent>
		</Modal>
	);
};
