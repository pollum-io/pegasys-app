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
import { useModal, usePicasso, useTokens } from "hooks";
import React, { useState } from "react";
import { MdHelpOutline, MdArrowBack } from "react-icons/md";
import { SelectCoinModal } from "components";
import { WrappedTokenInfo } from "types";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
	isCreate?: boolean;
	haveValue?: boolean;
}

export const RemoveLiquidity: React.FC<IModal> = props => {
	const { isModalOpen, onModalClose, isCreate, haveValue } = props;

	const { userTokensBalance } = useTokens();

	const theme = usePicasso();
	const { isOpenCoin, onCloseCoin } = useModal();
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [buttonId, setButtonId] = useState<number>(0);
	const [sliderValue, setSliderValue] = React.useState(5);
	const [showTooltip, setShowTooltip] = React.useState(false);

	const defaultTokenValues = userTokensBalance.filter(
		tokens =>
			tokens.symbol === "WSYS" ||
			tokens.symbol === "SYS" ||
			tokens.symbol === "PSYS"
	);

	setSelectedToken([defaultTokenValues[2], defaultTokenValues[1]]);

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
				buttonId={buttonId}
				setSelectedToken={setSelectedToken}
			/>
			<ModalOverlay />
			<ModalContent
				h={["100%", "100%", "max-content", "max-content"]}
				p="1.5rem"
				border={["none", "1px solid transparent"]}
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				background={`linear-gradient(${theme.bg.whiteGray}, ${theme.bg.whiteGray}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
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
							<MdArrowBack size={24} />
						</Flex>
						<Text fontSize="2xl" fontWeight="medium" textAlign="center" px="4">
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
								h="4"
								w="4"
								color="white"
								backgroundColor="gray.800"
								borderRadius="full"
							/>
						</Text>
					</Tooltip>
				</ModalHeader>
				<Flex
					flexDirection="column"
					bgColor={theme.bg.blueNavy}
					borderRadius="2xl"
					mt="4"
					px="5"
					py="5"
				>
					<Flex
						flexDirection="row"
						justifyContent="space-between"
						fontSize="md"
						fontWeight="medium"
					>
						<Text>Amount</Text>
						<Text color={theme.text.cyan}>Detailed</Text>
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
						id="slider"
						mt="9"
						defaultValue={5}
						min={0}
						max={100}
						mb="4"
						colorScheme="teal"
						onChange={(value: number) => setSliderValue(value)}
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
					background={theme.bg.blueGray}
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
