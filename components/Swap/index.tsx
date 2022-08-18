import {
	Button,
	ButtonProps,
	Flex,
	Icon,
	Img,
	Input,
	Text,
} from "@chakra-ui/react";
import { useModal, usePicasso, useTokens, useWallet } from "hooks";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
	MdWifiProtectedSetup,
	MdHelpOutline,
	MdOutlineArrowDownward,
} from "react-icons/md";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiTrashAlt } from "react-icons/bi";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { ITokenBalance, ITokenBalanceWithId } from "types";
import { TOKENS_INITIAL_STATE } from "helpers/consts";
import { ConfirmSwap } from "components/Modals/ConfirmSwap";
import dynamic from "next/dynamic";
import { BsHandThumbsUp } from "react-icons/bs";
import { SwapExpertMode } from "./SwapExpertMode";
import { OtherWallet } from "./OtherWallet";

const ChartComponent = dynamic(() => import("./ChartComponent"), {
	ssr: false,
});
interface ITokenInputValue {
	inputFrom: string;
	inputTo: string;
}

interface IToken extends ITokenBalance {
	logoURI: string;
	symbol: string;
	id?: number;
}

export const Swap: FunctionComponent<ButtonProps> = () => {
	const initialData = [
		{ open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
		{ open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: 1642514276 },
		{ open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
		{ open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
		{ open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: 1642773476 },
		{ open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 },
		{ open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: 1642946276 },
		{ open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: 1643032676 },
		{ open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: 1643119076 },
		{ open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
	];

	const colors = {
		backgroundColor: "transparent",
		textColor: "#718096",
		upColor: "#25855A",
		downColor: "#C53030",
		borderVisible: false,
		wickUpColor: "#25855A",
		wickDownColor: "#C53030",
	};

	const theme = usePicasso();

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

	const { isConnected } = useWallet();
	const [selectedToken, setSelectedToken] = useState<
		ITokenBalanceWithId[] | ITokenBalance[] | IToken[]
	>(TOKENS_INITIAL_STATE);

	const [tokenInputValue, setTokenInputValue] = useState<ITokenInputValue>({
		inputFrom: "",
		inputTo: "",
	});

	const [buttonId, setButtonId] = useState<number>(0);
	const swapButton = () => {
		if (!isConnected) {
			onOpenWallet();
		} else if (
			tokenInputValue.inputFrom < selectedToken[0]?.balance &&
			tokenInputValue.inputTo < selectedToken[1]?.balance
		) {
			onOpenConfirmSwap();
		}
	};

	const buttonName = useMemo(() => {
		if (isConnected) {
			return "Enter an amount";
		}
		if (isConnected && tokenInputValue.inputTo && tokenInputValue.inputFrom) {
			return "Aprove";
		}
		return "Connect Wallet";
	}, [isConnected]);

	useEffect(() => {
		if (!isConnected || !userTokensBalance) return;

		const getTokensBySymbol = userTokensBalance?.filter(
			token => token.symbol.includes("TSYS") || token.symbol.includes("PSYS")
		);

		const setIdToTokens = getTokensBySymbol.map((token, index: number) => ({
			...token,
			id: index,
		}));

		setSelectedToken(setIdToTokens);
	}, [isConnected, userTokensBalance]);

	const handleOnChangeTokenInputs = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const regexPreventLetters = /^(?!,$)[\d,.]+$/;

		const inputValue = event?.target?.value;

		if (inputValue === "" || regexPreventLetters.test(inputValue)) {
			setTokenInputValue(prevState => ({
				...prevState,
				[event.target.name]: inputValue,
			}));
		}
	};

	const switchTokensPosition = () =>
		setSelectedToken(prevState => [...prevState]?.reverse());

	const canSubmit =
		isConnected &&
		parseFloat(tokenInputValue?.inputFrom) > 0 &&
		parseFloat(selectedToken[0]?.balance) >
			parseFloat(tokenInputValue?.inputFrom);

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
			<ConfirmSwap isOpen={isOpenConfirmSwap} onClose={onCloseConfirmSwap} />
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
							tokenInputValue.inputFrom > selectedToken[0]?.balance
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
								value={tokenInputValue.inputFrom}
								_hover={{ border: "1px solid #3182CE" }}
								_focus={{ border: "1px solid #3182CE" }}
							/>
						</Flex>
					</Flex>
					{tokenInputValue.inputFrom > selectedToken[0]?.balance && (
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
							tokenInputValue.inputTo > selectedToken[1]?.balance
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
								value={tokenInputValue.inputTo}
								_hover={{ border: "1px solid #3182CE" }}
								_focus={{ border: "1px solid #3182CE" }}
							/>
						</Flex>
					</Flex>
					{tokenInputValue.inputTo > selectedToken[1]?.balance && (
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
					{tokenInputValue.inputTo && tokenInputValue.inputFrom && (
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
									<Text fontWeight="semibold">-</Text>
									<Text fontWeight="normal">
										{selectedToken[0]?.symbol} per {selectedToken[1]?.symbol}
									</Text>
								</Flex>
								<Flex fontSize="sm" flexDirection="column" textAlign="center">
									<Text fontWeight="semibold">-</Text>
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
						<Button
							w="100%"
							mt={isExpert ? "1rem" : "2rem"}
							py="6"
							px="6"
							borderRadius="67px"
							onClick={swapButton}
							bgColor={theme.bg.button.connectWalletSwap}
							color={theme.text.cyan}
							fontSize="lg"
							fontWeight="semibold"
							disabled={!canSubmit}
							_hover={{
								opacity: 0.3,
							}}
						>
							{buttonName}
						</Button>
					</Flex>
				</Flex>
				{tokenInputValue.inputTo && tokenInputValue.inputFrom && (
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
								<Text fontWeight="medium">-</Text>
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Text fontWeight="normal">
									Price Impact <Icon as={MdHelpOutline} />
								</Text>
								<Text fontWeight="medium">-</Text>
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
							{tokenInputValue.inputFrom < selectedToken[0]?.balance &&
								tokenInputValue.inputTo < selectedToken[1]?.balance && (
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
											<Flex gap="2">
												<Img src={selectedToken[1]?.logoURI} w="5" h="5" />
												<Text fontSize="sm">WSYS</Text>
											</Flex>
											<Flex mx="3" my="2">
												<Icon as={IoIosArrowForward} />
											</Flex>
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
				>
					<Flex>
						<Img src={selectedToken[0]?.logoURI} w="7" h="7" />
						<Img src={selectedToken[1]?.logoURI} w="7" h="7" />
					</Flex>
					<Flex align="center">
						<Text fontWeight="bold" fontSize="xl">
							TSYS/PSYS
						</Text>
						<Text pl="2" fontSize="lg">
							$15.56
						</Text>
					</Flex>
				</Flex>
				<ChartComponent data={initialData} colors={colors} />
			</Flex>
		</Flex>
	);
};
