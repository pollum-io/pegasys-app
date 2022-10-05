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
import React, { useState, useEffect } from "react";
import { MdHelpOutline, MdArrowBack } from "react-icons/md";
import { WrappedTokenInfo } from "types";
import { TooltipComponent } from "components/Tooltip/TooltipComponent";
import { useTranslation } from "react-i18next";
import { SelectCoinModal } from "./SelectCoin";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
	isCreate?: boolean;
	haveValue?: boolean;
}

export const RemoveLiquidity: React.FC<IModal> = props => {
	const { isModalOpen, onModalClose, isCreate, haveValue } = props;
	const { t: translation } = useTranslation();

	const { userTokensBalance } = useTokens();

	const theme = usePicasso();
	const { isOpenCoin, onCloseCoin } = useModal();
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [buttonId] = useState<number>(0);
	const [sliderValue, setSliderValue] = React.useState(5);

	useEffect(() => {
		const defaultTokenValues = userTokensBalance.filter(
			tokens =>
				tokens.symbol === "WSYS" ||
				tokens.symbol === "SYS" ||
				tokens.symbol === "PSYS"
		);

		setSelectedToken([defaultTokenValues[2], defaultTokenValues[1]]);
	}, [userTokensBalance]);

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
						color={theme.text.softGray}
						id="slider"
						mt="9"
						defaultValue={5}
						min={0}
						max={100}
						mb="6"
						size="lg"
						colorScheme="red"
						onChange={(value: number) => setSliderValue(value)}
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
						bgColor={theme.bg.blueNavyLightness}
						color={theme.text.cyan}
						fontSize="lg"
						fontWeight="semibold"
						_hover={{
							bgColor: theme.bg.bluePurple,
						}}
					>
						{isCreate ? "Create a pair" : "Add Liquidity"}
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
