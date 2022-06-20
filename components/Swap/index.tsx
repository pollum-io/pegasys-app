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
import { usePicasso, useWallet } from "hooks";
import { FunctionComponent, useMemo, useState } from "react";
import { BiDownArrowAlt } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { FcInfo } from "react-icons/fc";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { getDefaultTokens } from "networks";

interface IToken {
	address: string;
	chainId: number;
	decimals: number;
	logoURI: string;
	name: string;
	symbol: string;
	balance: string;
}

export const Swap: FunctionComponent<ButtonProps> = () => {
	const theme = usePicasso();
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
	const { isConnected } = useWallet();
	const [selectedToken, setSelectedToken] = useState<IToken>();
	const [defaultTokenSymbol, setDefaultTokenSymbol] = useState("");
	const [defaultTokenLogo, setDefaultTokenLogo] = useState("");

	const swapButton = () => !isConnected && onOpenWallet();
	console.log(selectedToken, " asdasda");

	useMemo(async () => {
		const request = await getDefaultTokens();
		const { tokens } = request;
		let sysTokenName = "";
		let sysTokenLogo = "";
		tokens.filter((token: IToken, index: number) => {
			if (token.symbol === "PSYS") {
				sysTokenName = token.symbol;
				sysTokenLogo = token.logoURI;
			}
			return sysTokenName && sysTokenLogo;
		});
		setDefaultTokenSymbol(sysTokenName);
		setDefaultTokenLogo(sysTokenLogo);
	}, []);

	return (
		<Flex pt="24" zIndex="1">
			<SelectWallets isOpen={isOpenWallet} onClose={onCloseWallet} />
			<SelectCoinModal
				isOpen={isOpenCoin}
				onClose={onCloseCoin}
				selectToken={setSelectedToken}
			/>
			<Flex
				height="max-content"
				width="22%"
				bgColor={theme.bg.whiteGray}
				margin="0 auto"
				position="relative"
				borderRadius={30}
				p="5"
				flexDirection="column"
			>
				<Flex
					borderRadius={18}
					width="100%"
					height="max-content"
					px="3"
					py="1.5"
					border="1px solid"
					borderColor={theme.border.swapInput}
					flexDirection="column"
				>
					<Flex
						flexDirection="row"
						justifyContent="space-between"
						pb="1"
						color={theme.text.swapInfo}
					>
						<Text fontSize="sm" fontWeight="500">
							From
						</Text>
						<Text fontSize="sm" fontWeight="500">
							Balance: 31321
						</Text>
					</Flex>
					<Flex alignItems="center" justifyContent="space-around">
						<Flex alignItems="center">
							<Input
								fontSize="2xl"
								border="none"
								placeholder="0.0"
								width="50%"
								mt="2"
								fontFamily="mono"
								px="0.5"
								letterSpacing="-4px"
								type="number"
							/>
							<Button
								fontSize="sm"
								height="max-content"
								fontWeight="500"
								ml="2"
								px="2"
								py="1.5"
								borderRadius="8"
								color={theme.text.whiteCyan}
								bgColor={theme.bg.button.swapBlue}
								_hover={{ opacity: 0.75 }}
							>
								MAX
							</Button>
							<Flex
								alignItems="center"
								justifyContent="space-between"
								px="5"
								py="1"
								w="max-content"
								ml="2"
								borderRadius={12}
								cursor="pointer"
								_hover={{
									bgColor: theme.bg.button.swapTokenCurrency,
								}}
							>
								<Img
									src={
										selectedToken ? selectedToken?.logoURI : defaultTokenLogo
									}
									w="6"
									h="6"
								/>
								<Text
									fontSize="xl"
									fontWeight="500"
									px="3"
									onClick={onOpenCoin}
								>
									{selectedToken ? selectedToken?.symbol : defaultTokenSymbol}
								</Text>
								<Icon as={IoIosArrowDown} />
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Flex margin="0 auto" py="4">
					<BiDownArrowAlt />
				</Flex>
				<Flex
					borderRadius={18}
					width="100%"
					height="max-content"
					px="3"
					py="1.5"
					border="1px solid"
					borderColor={theme.border.swapInput}
					flexDirection="column"
				>
					<Flex
						flexDirection="row"
						justifyContent="space-between"
						pb="1"
						color={theme.text.swapInfo}
					>
						<Text fontSize="sm">To</Text>
						<Text fontSize="sm">-</Text>
					</Flex>
					<Flex alignItems="center" justifyContent="space-around">
						<Flex alignItems="center">
							<Input
								fontSize="2xl"
								border="none"
								placeholder="0.0"
								width="50%"
								mt="2"
								fontFamily="mono"
								px="0.5"
								letterSpacing="-4px"
								type="number"
							/>
							<Button
								fontSize="sm"
								height="max-content"
								fontWeight="500"
								ml="2"
								px="2"
								py="1.5"
								borderRadius="8"
								color={theme.text.whiteCyan}
								bgColor={theme.bg.button.swapBlue}
								_hover={{ opacity: 0.75 }}
							>
								MAX
							</Button>
							<Flex
								alignItems="center"
								justifyContent="space-between"
								px="5"
								py="1"
								w="max-content"
								ml="2"
								borderRadius={12}
								cursor="pointer"
								_hover={{
									bgColor: theme.bg.button.swapTokenCurrency,
								}}
							>
								<Img
									src={
										selectedToken ? selectedToken?.logoURI : defaultTokenLogo
									}
									w="6"
									h="6"
								/>
								<Text
									fontSize="xl"
									fontWeight="500"
									px="3"
									onClick={onOpenCoin}
								>
									{selectedToken ? selectedToken?.symbol : defaultTokenSymbol}
								</Text>
								<Icon as={IoIosArrowDown} />
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Flex
					justifyContent="space-between"
					fontWeight={500}
					py="4"
					px="3"
					color={theme.text.swapInfo}
				>
					<Text fontSize="sm">Slippage Tolerance</Text>
					<Text fontSize="sm">1.01%</Text>
				</Flex>
				<Flex>
					<Button
						w="100%"
						p="8"
						borderRadius="12"
						fontSize="lg"
						onClick={swapButton}
					>
						{isConnected ? "Enter an amount" : "Connect your Wallet"}
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};
