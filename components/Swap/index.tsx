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
import { usePicasso, useTokens, useWallet, UseDerivedSwapInfo } from "hooks";
import React, { FunctionComponent, useEffect, useState } from "react";
import { MdWifiProtectedSetup } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { SettingsButton } from "components/Header/SettingsButton";
import {
	ITokenBalance,
	ITokenBalanceWithId,
	ISwapTokenInputValue,
	IWalletHookInfos,
} from "types";
import { TOKENS_INITIAL_STATE } from "helpers/consts";

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
		walletAddress,
	} = useWallet();

	const [selectedToken, setSelectedToken] = useState<
		ITokenBalanceWithId[] | ITokenBalance[]
	>(TOKENS_INITIAL_STATE);

	const [buttonId, setButtonId] = useState<number>(0);

	const [tokenInputValue, setTokenInputValue] = useState<ISwapTokenInputValue>({
		inputFrom: {
			token: TOKENS_INITIAL_STATE[0],
			value: "",
		},
		inputTo: {
			token: TOKENS_INITIAL_STATE[1],
			value: "",
		},
		typedValue: "",
		lastInputTyped: undefined,
	});

	// const getTokenAllowance = async (
	// 	token: ITokenBalance | ITokenBalanceWithId
	// ) => {
	// 	try {
	// 		if (!provider || !token) return;
	// 		const contract = createContractUsingAbi(
	// 			String(token.address),
	// 			erc20Abi,
	// 			provider
	// 		);

	// 		const contractCall = await contract.allowance(
	// 			token.address,
	// 			walletAddress
	// 		);

	// 		return String(ethers.utils.formatUnits(contractCall, token.decimals));
	// 	} catch (error) {
	// 		return "0";
	// 	}
	// };

	const handleOnChangeTokenInputs = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const regexPreventLetters = /^(?!,$)[\d,.]+$/;

		const inputValue = event?.currentTarget?.value;

		const typedInput = event?.currentTarget.name;

		setTypedValue(inputValue);

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

			// setTokenInputValue(prevState => ({
			// 	...prevState,
			// 	[event.target.name]: inputValue,
			// }));
		}
	};

	const switchTokensPosition = () =>
		setSelectedToken(prevState => [...prevState]?.reverse());

	const swapButton = () => !isConnected && onOpenWallet();

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

	const canSubmit =
		isConnected &&
		parseFloat(tokenInputValue?.inputFrom?.value) > 0 &&
		parseFloat(selectedToken[0]?.balance) >
			parseFloat(tokenInputValue?.inputFrom?.value);

	const walletInfos: IWalletHookInfos = {
		chainId: currentNetworkChainId,
		walletAddress,
		provider,
	};

	const handleSwapInfo = async () => {
		const { parsedAmount, v2Trade } = await UseDerivedSwapInfo(
			tokenInputValue,
			walletInfos
		);

		console.log("v2Trade", v2Trade);
	};

	useEffect(() => {
		handleSwapInfo();
	}, [tokenInputValue, selectedToken]);

	// useMemo(() => {
	// 	if(!isConnected) return

	// 	const {parsedAmount, v2Trade} = useDerivedSwapInfo(tokenInputValue, walletInfos)

	// 	console.log('v2Trade', v2Trade)

	// }, [tokenInputValue, selectedToken])

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
						onClick={swapButton}
						bgColor={theme.bg.button.connectWalletSwap}
						color={theme.text.cyan}
						fontSize="lg"
						fontWeight="semibold"
						disabled={!canSubmit}
					>
						{isConnected ? "Enter an amount" : "Connect Wallet"}
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};
