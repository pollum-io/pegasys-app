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
import React, { FunctionComponent, useEffect, useState } from "react";
import { MdWifiProtectedSetup } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { SettingsButton } from "components/Header/SettingsButton";
import { ISwapTokenInputValue, IWalletHookInfos } from "types";

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
		setTypedValue,
		currentNetworkChainId,
		provider,
		signer,
		walletAddress,
	} = useWallet();

	const [selectedToken, setSelectedToken] = useState([
		{
			...userTokensBalance[0],
		},
		{
			...userTokensBalance[1],
		},
	]);
	const [currentInput, setCurrentInput] = useState();
	const [trade, setTrade] = useState();
	const [buttonId, setButtonId] = useState<number>(0);

	const [tokenInputValue, setTokenInputValue] = useState<ISwapTokenInputValue>({
		inputFrom: {
			token: userTokensBalance[0],
			value: "",
		},
		inputTo: {
			token: userTokensBalance[1],
			value: "",
		},
		typedValue: "",
		lastInputTyped: undefined,
	});

	const handleOnChangeTokenInputs = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const regexPreventLetters = /^(?!,$)[\d,.]+$/;

		const inputValue = event?.currentTarget?.value;

		const typedInput = event?.currentTarget.name;

		setTypedValue(inputValue);
		setCurrentInput(typedInput);

		if (inputValue === "" || regexPreventLetters.test(inputValue)) {
			setTokenInputValue({
				inputFrom:
					typedInput === "inputFrom"
						? {
								token: userTokensBalance[0],
								value: inputValue,
						  }
						: {
								token: userTokensBalance[0],
								value: "",
						  },

				inputTo:
					typedInput === "inputTo"
						? {
								token: userTokensBalance[1],
								value: inputValue,
						  }
						: {
								token: userTokensBalance[1],
								value: "",
						  },

				typedValue: inputValue,
				lastInputTyped: typedInput === "inputFrom" ? 0 : 1,
			});
		}
	};

	const switchTokensPosition = () =>
		setSelectedToken(prevState => [...prevState]?.reverse());

	const swapButton = () => !isConnected && onOpenWallet();

	useEffect(() => {
		if (!isConnected || !userTokensBalance) return;

		const getTokensBySymbol = userTokensBalance?.filter(
			token =>
				token?.symbol === "WSYS" ||
				token?.symbol === "SYS" ||
				token?.symbol === "PSYS"
		);

		const setIdToTokens: any = getTokensBySymbol.map(
			(token, index: number) => ({
				...token,
				id: index,
			})
		);

		setSelectedToken(setIdToTokens);
	}, [isConnected, userTokensBalance]);

	const canSubmit =
		isConnected &&
		parseFloat(tokenInputValue?.inputFrom?.value) > 0 &&
		parseFloat(selectedToken[0]?.tokenInfo?.balance) >
			parseFloat(tokenInputValue?.inputFrom?.value);

	const walletInfos: IWalletHookInfos = {
		chainId: currentNetworkChainId,
		walletAddress,
		provider,
	};

	const handleSwapInfo = async () => {
		const { v2Trade } = await UseDerivedSwapInfo(tokenInputValue, walletInfos);
		setTrade(v2Trade);
	};

	const swapCall: any =
		trade &&
		signer &&
		UseSwapCallback(trade, walletAddress, 50, walletInfos, signer);

	useEffect(() => {
		const { inputTo, inputFrom } = tokenInputValue;
		if (currentInput !== "inputFrom") {
			setTokenInputValue(prevState => {
				const newObject = {
					...prevState,
					inputFrom: {
						...prevState.inputFrom,
						value:
							inputTo.value !== "" ? trade?.inputAmount?.toSignificant(6) : "",
					},
				};
				return newObject;
			});
			return;
		}
		if (currentInput !== "inputTo") {
			setTokenInputValue(prevState => {
				const newObject = {
					...prevState,
					inputTo: {
						...prevState.inputTo,
						value:
							inputFrom.value !== ""
								? trade?.outputAmount?.toSignificant(6)
								: "",
					},
				};
				return newObject;
			});
		}
	}, [trade]);

	useEffect(() => {
		handleSwapInfo();
	}, [tokenInputValue, selectedToken]);

	return (
		<Flex
			pt="24"
			justifyContent="center"
			fontFamily="inter"
			fontStyle="normal"
			h="100vh"
			w="100%"
			overflow="none"
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
				<Flex>
					<Button
						w="100%"
						mt="2rem"
						py="6"
						px="6"
						borderRadius="67px"
						onClick={swapCall?.callback}
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
		</Flex>
	);
};
