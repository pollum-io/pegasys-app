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
	useDisclosure,
	Stack,
	Switch,
	Slider,
	SliderMark,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import React, { useState } from "react";
import { MdHelpOutline, MdArrowBack } from "react-icons/md";
import { SelectCoinModal } from "components";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
	isCreate?: boolean;
	haveValue?: boolean;
}
interface IToken {
	logoURI: string;
	symbol: string;
	id?: number;
}

export const RemoveLiquidity: React.FC<IModal> = props => {
	const { isModalOpen, onModalClose, isCreate, haveValue } = props;
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
	const [selectedToken] = useState<IToken[]>([
		{ logoURI: "icons/syscoin-logo.png", symbol: "SYS", id: 0 },
		{ logoURI: "icons/pegasys.png", symbol: "PSYS", id: 1 },
	]);
	const [buttonId, setButtonId] = useState<number>(0);
	const [sliderValue, setSliderValue] = React.useState(5);
	const [showTooltip, setShowTooltip] = React.useState(false);

	return (
		<Modal
			blockScrollOnMount={false}
			isOpen={isModalOpen}
			onClose={onModalClose}
		>
			<SelectCoinModal
				isOpen={isOpen}
				onClose={onClose}
				selectedToken={selectedToken}
				buttonId={buttonId}
			/>
			<ModalOverlay />
			<ModalContent
				mb="20rem"
				h="max-content"
				p="1.5rem"
				borderRadius="3xl"
				border="1px solid transparent;"
				background={theme.bg.blackAlpha}
			>
				<ModalHeader
					display="flex"
					alignItems="baseline"
					justifyContent="space-between"
					px="0"
					py="0"
				>
					<Flex alignItems="center">
						<Flex _hover={{ cursor: "pointer" }} onClick={onModalClose}>
							<MdArrowBack size={24} color={theme.icon.whiteGray} />
						</Flex>
						<Text
							fontSize="2xl"
							fontWeight="medium"
							textAlign="center"
							px="4"
							color={theme.text.mono}
						>
							Remove Liquidity
						</Text>
					</Flex>
					<Tooltip
						label="When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time."
						position="relative"
						bgColor={theme.bg.blueNavy}
						border="1px solid"
						borderColor={theme.border.borderSettings}
						color={theme.text.swapInfo}
						borderRadius="md"
						px="4"
						py="2"
					>
						<Text as="span" _hover={{ opacity: 0.8 }}>
							<Icon
								as={MdHelpOutline}
								h="5"
								w="5"
								color={theme.icon.whiteGray}
								borderRadius="full"
							/>
						</Text>
					</Tooltip>
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
									0.000185
								</Text>
								<Text fontSize="md" fontWeight="normal">
									USDT
								</Text>
							</Flex>
							<Flex alignItems="center" gap="2" justifyContent="space-between">
								<Text fontSize="xl" fontWeight="medium">
									0.00127213
								</Text>
								<Text fontSize="md" fontWeight="normal">
									SYS
								</Text>
							</Flex>
						</Flex>
					</Flex>
					<Slider
						color={theme.text.transactionsItems}
						id="slider"
						mt="9"
						defaultValue={5}
						min={0}
						max={100}
						mb="4"
						colorScheme="teal"
						onChange={value => setSliderValue(value)}
						onMouseEnter={() => setShowTooltip(true)}
						onMouseLeave={() => setShowTooltip(false)}
					>
						<SliderMark value={0} mt="1" ml="1.5" fontSize="sm">
							0%
						</SliderMark>
						<SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
							25%
						</SliderMark>
						<SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
							50%
						</SliderMark>
						<SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
							75%
						</SliderMark>
						<SliderMark value={100} mt="1" ml="-8" fontSize="sm">
							100%
						</SliderMark>
						<SliderTrack>
							<SliderFilledTrack bg={theme.text.psysBalance} />
						</SliderTrack>
						<Tooltip
							hasArrow
							bg="teal.500"
							color="white"
							placement="top"
							isOpen={showTooltip}
						>
							<SliderThumb />
						</Tooltip>
					</Slider>
				</Flex>

				<Flex flexDirection="column" py="6">
					<Flex flexDirection="row" justifyContent="space-between">
						<Text fontWeight="medium" fontSize="md">
							Recive
						</Text>
						<Flex flexDirection="row">
							<Stack align="center" direction="row">
								<Text>WSYS</Text>
								<Switch size="md" colorScheme="cyan" />
								<Text>SYS</Text>
							</Stack>
						</Flex>
					</Flex>
					<Flex flexDirection="row" justifyContent="space-between" pt="6">
						<Text fontWeight="medium" fontSize="md">
							Price
						</Text>
						<Flex flexDirection="column">
							<Flex flexDirection="row">
								<Text fontSize="sm">1 USDC = 6.84973 SYS</Text>
							</Flex>
							<Flex flexDirection="row">
								<Text fontSize="sm">1 SYS = 0.145991 USDC</Text>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Flex>
					<Button
						w="100%"
						py="6"
						px="6"
						borderRadius="67px"
						bgColor={theme.bg.button.connectWalletSwap}
						color={theme.text.cyan}
						fontSize="lg"
						fontWeight="semibold"
					>
						{isCreate ? "Create a pair" : "Add Liquidity"}
					</Button>
				</Flex>
				<Flex
					flexDirection="column"
					p="1.5rem"
					background={theme.bg.blueNavy}
					position="absolute"
					w="90%"
					bottom="-280"
					borderRadius="xl"
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
							<Img src="icons/syscoin-logo.png" w="6" h="6" />
							<Img src="icons/pegasys.png" w="6" h="6" />
							<Text pl="2">USDT/SYS</Text>
						</Flex>
						<Text fontSize="lg" fontWeight="bold">
							0.0000005
						</Text>
					</Flex>
					<Flex flexDirection="column">
						<Flex flexDirection="row" justifyContent="space-between">
							<Text fontWeight="semibold">Your pool share:</Text>
							<Text fontWeight="normal">33.480024%</Text>
						</Flex>
						<Flex
							flexDirection="row"
							justifyContent="space-between"
							pt="0.75rem"
						>
							<Text fontWeight="semibold">SYS</Text>
							<Text fontWeight="normal">0.2145005</Text>
						</Flex>
						<Flex
							flexDirection="row"
							justifyContent="space-between"
							pt="0.75rem"
						>
							<Text fontWeight="semibold">PSYS</Text>
							<Text fontWeight="normal">0.9475005</Text>
						</Flex>
					</Flex>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
