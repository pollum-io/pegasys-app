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
import { FunctionComponent, useState } from "react";
import { MdWifiProtectedSetup } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { SelectCoinModal, SelectWallets } from "components/Modals";
import { SettingsButton } from "components/Header/SettingsButton";

interface IToken {
	logoURI: string;
	symbol: string;
	id?: number;
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
	const [selectedToken, setSelectedToken] = useState<IToken[]>([
		{ logoURI: "icons/syscoin-logo.png", symbol: "SYS", id: 0 },
		{ logoURI: "icons/pegasys.png", symbol: "PSYS", id: 1 },
	]);

	const [buttonId, setButtonId] = useState<number>(0);
	const swapButton = () => !isConnected && onOpenWallet();

	const switchTokensPosition = () =>
		setSelectedToken(prevState => [...prevState]?.reverse());

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
							Balance: 0.0275993
						</Text>
					</Flex>
					<Flex alignItems="center" justifyContent="space-between">
						<Flex
							alignItems="center"
							id="0"
							borderRadius={12}
							cursor="pointer"
							_hover={{}}
							onClick={event => {
								setButtonId(Number(event.currentTarget.id));
								onOpenCoin();
							}}
						>
							<Img src={selectedToken[0].logoURI} w="6" h="6" />
							<Text fontSize="xl" fontWeight="500" px="3">
								{selectedToken[0].symbol}
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
							type="number"
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
							From
						</Text>
						<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
							Balance: 0.0275993
						</Text>
					</Flex>
					<Flex alignItems="center" justifyContent="space-between">
						<Flex
							alignItems="center"
							id="1"
							borderRadius={12}
							cursor="pointer"
							_hover={{}}
							onClick={event => {
								setButtonId(Number(event.currentTarget.id));
								onOpenCoin();
							}}
						>
							<Img src={selectedToken[1].logoURI} w="6" h="6" />
							<Text fontSize="xl" fontWeight="500" px="3">
								{selectedToken[1].symbol}
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
							type="number"
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
					>
						{isConnected ? "Enter an amount" : "Connect Wallet"}
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};
