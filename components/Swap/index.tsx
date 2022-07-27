import {
	Button,
	ButtonProps,
	Flex,
	Icon,
	Img,
	Input,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import {
	usePicasso,
	useTokens,
	useWallet,
	UseDerivedSwapInfo,
	UseSwapCallback,
} from "hooks";
import React, { FunctionComponent, useEffect, useState, useMemo } from "react";
import { MdWifiProtectedSetup, MdHelpOutline } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { SettingsButton } from "components/Header/SettingsButton";
import { ChainId, Trade } from "@pollum-io/pegasys-sdk";
import {
	ISwapTokenInputValue,
	IWalletHookInfos,
	WrappedTokenInfo,
} from "types";

export const Swap: FunctionComponent<ButtonProps> = () => {
	const theme = usePicasso();

	const { userTokensBalance } = useTokens();

	const {
		onOpen: onOpenWallet,
		isOpen: isOpenWallet,
		onClose: onCloseWallet,
	} = useDisclosure();
	const {
		onOpen: onOpenCoin,
		isOpen: isOpenCoin,
		onClose: onCloseCoin,
	} = useDisclosure();

	const {
		isConnected,
		currentNetworkChainId,
		provider,
		signer,
		walletAddress,
	} = useWallet();

	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [currentInput, setCurrentInput] = useState<string>("");
	const [trade, setTrade] = useState<Trade | undefined>();
	const [buttonId, setButtonId] = useState<number>(0);

	const [tokenInputValue, setTokenInputValue] = useState<ISwapTokenInputValue>({
		inputFrom: {
			token: selectedToken[0],
			value: "",
		},
		inputTo: {
			token: selectedToken[1],
			value: "",
		},
		typedValue: "",
		lastInputTyped: undefined,
	});

	const handleOnChangeTokenInputs = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (!isConnected) return;

		const regexPreventLetters = /^(?!,$)[\d,.]+$/;

		const inputValue = event?.currentTarget?.value;

		const typedInput = event?.currentTarget.name;

		setCurrentInput(typedInput);

		if (inputValue === "" || regexPreventLetters.test(inputValue)) {
			setTokenInputValue({
				inputFrom:
					typedInput === "inputFrom"
						? {
								token: selectedToken[0],
								value: inputValue,
						  }
						: {
								token: selectedToken[0],
								value: "",
						  },

				inputTo:
					typedInput === "inputTo"
						? {
								token: selectedToken[1],
								value: inputValue,
						  }
						: {
								token: selectedToken[1],
								value: "",
						  },

				typedValue: inputValue,
				lastInputTyped: typedInput === "inputFrom" ? 0 : 1,
			});
		}
	};

	const switchTokensPosition = () =>
		setSelectedToken(prevState => [...prevState]?.reverse());

	useEffect(() => {
		if (!isConnected || !userTokensBalance) return;

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
	}, [isConnected, userTokensBalance]);

	const submitValidation = [
		isConnected && tokenInputValue.lastInputTyped === 0
			? parseFloat(selectedToken[0]?.tokenInfo?.balance) >=
			  parseFloat(tokenInputValue?.inputFrom?.value)
			: parseFloat(selectedToken[1]?.tokenInfo?.balance) >=
			  parseFloat(tokenInputValue?.inputTo?.value),
	];

	const canSubmit = submitValidation.every(validation => validation === true);

	const walletInfos: IWalletHookInfos = {
		chainId: currentNetworkChainId === 5700 ? ChainId.TANENBAUM : ChainId.NEVM,
		walletAddress,
		provider,
	};

	const swapCall =
		trade && signer && UseSwapCallback(trade, 50, walletInfos, signer);

	const handleSwapInfo = async () => {
		const { v2Trade } = await UseDerivedSwapInfo(tokenInputValue, walletInfos);
		setTrade(v2Trade);
	};

	useEffect(() => {
		if (!isConnected) return;

		handleSwapInfo();
	}, [isConnected, tokenInputValue, selectedToken]);

	useEffect(() => {
		setSelectedToken([userTokensBalance[0], userTokensBalance[1]]);
	}, [userTokensBalance]);

	useMemo(() => {
		if (!isConnected || !trade) return;

		const { inputTo, inputFrom } = tokenInputValue;

		if (currentInput === "inputTo") {
			tokenInputValue.inputFrom.value = inputTo?.value
				? trade?.inputAmount?.toSignificant(6)
				: "";
		}

		if (currentInput === "inputFrom") {
			tokenInputValue.inputTo.value = inputFrom?.value
				? trade?.outputAmount?.toSignificant(6)
				: "";
		}
	}, [isConnected, trade, selectedToken]);

	return (
		<Flex
			pt="24"
			justifyContent="center"
			fontFamily="inter"
			fontStyle="normal"
			alignItems="center"
			flexDirection="column"
		>
			<SelectWallets isOpen={isOpenWallet} onClose={onCloseWallet} />
			<SelectCoinModal
				isOpen={isOpenCoin}
				onClose={onCloseCoin}
				selectedToken={selectedToken}
				buttonId={buttonId}
				setSelectedToken={setSelectedToken}
			/>
			<Flex
				h="max-content"
				w="md"
				p="1.5rem"
				flexDirection="column"
				zIndex="1"
				borderRadius={30}
				border="1px solid transparent;"
				boxShadow=" 0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4);"
				background={`linear-gradient(${theme.bg.whiteGray}, ${theme.bg.whiteGray}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<Flex flexDirection="row" justifyContent="space-between" pb="1.5rem">
					<Text fontWeight="semibold" fontSize="2xl">
						Swap
					</Text>
					<SettingsButton />
				</Flex>
				<Flex
					borderRadius="2xl"
					bgColor={theme.bg.blueNavy}
					flexDirection="column"
					py="1rem"
					px="1.25rem"
					border="1px solid"
					borderColor={
						tokenInputValue.inputFrom.value >
						selectedToken[0]?.tokenInfo?.balance
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
							Balance: {selectedToken[0]?.tokenInfo?.balance}
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
							<Img src={selectedToken[0]?.tokenInfo?.logoURI} w="6" h="6" />
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
							px="1.5"
							ml="50"
							type="text"
							onChange={handleOnChangeTokenInputs}
							name="inputFrom"
							value={tokenInputValue?.inputFrom?.value}
						/>
					</Flex>
				</Flex>
				{tokenInputValue.inputFrom.value >
					selectedToken[0]?.tokenInfo?.balance && (
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
						tokenInputValue.inputTo.value > selectedToken[1]?.tokenInfo.balance
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
							Balance: {selectedToken[1]?.tokenInfo?.balance}
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
							<Img src={selectedToken[1]?.tokenInfo?.logoURI} w="6" h="6" />
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
							px="1.5"
							ml="50"
							type="text"
							onChange={handleOnChangeTokenInputs}
							name="inputTo"
							value={tokenInputValue?.inputTo?.value}
						/>
					</Flex>
				</Flex>
				{tokenInputValue.inputTo.value >
					selectedToken[1]?.tokenInfo.balance && (
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
				<Flex>
					<Button
						w="100%"
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
						{isConnected ? "Swap" : "Connect Wallet"}
					</Button>
				</Flex>
			</Flex>
			{tokenInputValue.inputTo.value && tokenInputValue.inputFrom.value && (
				<Flex
					flexDirection="column"
					p="1.5rem"
					background={theme.bg.blueNavy}
					w="22%"
					borderRadius="xl"
					mt="7"
					mb="10rem"
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
						{tokenInputValue.inputFrom.value <
							selectedToken[0]?.tokenInfo?.balance &&
							tokenInputValue.inputTo.value <
								selectedToken[1]?.tokenInfo?.balance && (
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
	);
};
