import {
	Button,
	Flex,
	Icon,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Slider,
	SliderFilledTrack,
	SliderMark,
	SliderThumb,
	SliderTrack,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdArrowBack, MdOutlineInfo } from "react-icons/md";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	buttonId: string;
	setButtonId: Dispatch<SetStateAction<string>>;
}

export const StakeActions: React.FC<IModal> = props => {
	const { isOpen, onClose, buttonId, setButtonId } = props;
	const theme = usePicasso();
	const [confirmStake, setConfirmStake] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [isAprroving, setIsAprroving] = useState("");
	const [isApproved, setIsAprrove] = useState("");

	const [sliderValue, setSliderValue] = React.useState(5);
	const [showTooltip, setShowTooltip] = React.useState(false);

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event?.target?.value;

		setInputValue(value);
	};

	const changeStakeButtonState = useMemo(() => {
		if (isAprroving) {
			return "Aprroving...";
		}
		if (isApproved) {
			return "Confirm Stake";
		}
		return "Approve";
	}, []);

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				mt="10rem"
				mb="0"
				position={["absolute", "absolute", "relative", "relative"]}
				bottom="0"
				maxHeight="90%"
				w={["100vw", "100vw", "max-content", "max-content"]}
				h={["max-content", "max-content", "max-content", "max-content"]}
				borderRadius="3xl"
				bgColor={theme.bg.blueNavy}
				border="1px solid transparent"
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					backgroundColor={theme.bg.blueNavy}
					borderTopRadius="3xl"
					alignItems="baseline"
					justifyContent="space-between"
				>
					<Flex
						flexDirection={["column-reverse", "column-reverse", "row", "row"]}
						justifyContent="space-between"
						alignItems={["flex-start", "flex-start", "center", "center"]}
					>
						<Flex pr="7" gap="2" mt={["6", "6", "0", "0"]}>
							<Button
								w="max-content"
								h="max-content"
								py="3"
								px={["6", "6", "8", "8"]}
								borderRadius="full"
								onClick={() => setButtonId("stake")}
								bgColor={
									buttonId === "stake" ? theme.bg.blue100 : "transparent"
								}
								color={
									buttonId === "stake" ? "black" : "rgba(255, 255, 255, 0.36)"
								}
								fontWeight="semibold"
								_hover={{ opacity: "0.9" }}
							>
								Stake
							</Button>
							<Button
								id="1"
								w="max-content"
								h="max-content"
								py="3"
								px={["6", "6", "8", "8"]}
								borderRadius="full"
								onClick={() => setButtonId("unstake")}
								bgColor={
									buttonId === "unstake" ? theme.bg.blue100 : "transparent"
								}
								color={
									buttonId === "unstake" ? "black" : "rgba(255, 255, 255, 0.36)"
								}
								fontWeight="semibold"
								_hover={{ opacity: "0.9" }}
							>
								Unstake
							</Button>
							<Button
								w="max-content"
								h="max-content"
								py="3"
								px={["6", "6", "8", "8"]}
								borderRadius="full"
								onClick={() => setButtonId("claim")}
								bgColor={
									buttonId === "claim" ? theme.bg.blue100 : "transparent"
								}
								color={
									buttonId === "claim" ? "black" : "rgba(255, 255, 255, 0.36)"
								}
								fontWeight="semibold"
								_hover={{ opacity: "0.9" }}
							>
								Claim
							</Button>
						</Flex>
						<Flex
							_hover={{ cursor: "pointer" }}
							onClick={onClose}
							alignItems="center"
							gap="2"
						>
							<Flex
								display={{
									base: "none",
									sm: "none",
									md: "block",
									lg: "block",
								}}
							>
								<AiOutlineClose size={20} />
							</Flex>
							<Flex
								display={{
									base: "block",
									sm: "block",
									md: "none",
									lg: "none",
								}}
							>
								<MdArrowBack size={24} color={theme.text.gray} />
							</Flex>
							<Text
								display={{
									base: "block",
									sm: "block",
									md: "none",
									lg: "none",
								}}
								color={theme.text.gray}
							>
								Farms
							</Text>
						</Flex>
					</Flex>
				</ModalHeader>
				<ModalBody>
					{buttonId === "stake" && (
						<Flex flexDirection="column">
							<Flex gap="2">
								<Flex>
									<Img src="icons/syscoin-logo.png" w="6" h="6" />
								</Flex>
								<Flex>
									<Text fontSize="lg" fontWeight="bold">
										SYS
									</Text>
								</Flex>
							</Flex>
							<Flex flexDirection="column" gap="2" mt="6">
								<Text fontWeight="normal">Available to deposit: 1</Text>
								{!confirmStake ? (
									<Flex>
										<Input
											placeholder="0.0"
											border="1px solid"
											borderColor="rgba(1, 219, 243, 0.2)"
											bgColor={theme.bg.whiteGray}
											borderLeftRadius="full"
											p="5"
											w="25rem"
											_hover={{}}
											onChange={handleInput}
											_focus={{
												outline: "none",
											}}
										/>
										<Button
											border="1px solid rgba(0, 217, 239, 0.2)"
											borderRightRadius="full"
											bgColor={theme.bg.whiteGray}
											color={theme.text.cyan}
											fontSize="lg"
											fontWeight="normal"
											px="4"
											py="5"
											_hover={{ backgroundColor: theme.bg.blueNavyLightness }}
										>
											max
										</Button>
									</Flex>
								) : (
									<Flex
										bgColor={theme.bg.whiteGray}
										flexDirection="column"
										justifyContent="center"
										alignItems="center"
										py="2"
										gap="3"
										borderRadius="xl"
									>
										<Flex flexDirection="row" alignItems="center">
											<Img src="icons/syscoin-logo.png" w="6" h="6" />
											<Text fontSize="2xl" fontWeight="semibold" pl="2">
												1
											</Text>
										</Flex>
										<Flex flexDirection="row">
											<Text>USDT</Text>
										</Flex>
									</Flex>
								)}
								<Text fontWeight="normal">Weekly Rewards: 0 PSYS / Week</Text>
							</Flex>
							<Button
								fontSize="lg"
								fontWeight="semibold"
								py="3"
								px="1.5rem"
								w="100%"
								my="4"
								h="max-content"
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								_hover={{ opacity: "1" }}
								_active={{}}
								borderRadius="full"
								disabled={!inputValue}
							>
								{changeStakeButtonState}
							</Button>
						</Flex>
					)}
					{buttonId === "unstake" && (
						<Flex flexDirection="column">
							<Text fontWeight="normal" mb="2">
								Deposited PLP Liquidity: 0.000001
							</Text>
							<Flex flexDirection="row">
								<Input
									placeholder="0.0"
									border="1px solid"
									borderColor="rgba(1, 219, 243, 0.2)"
									bgColor={theme.bg.whiteGray}
									borderLeftRadius="full"
									p="5"
									w="25rem"
									_hover={{}}
									_focus={{
										outline: "none",
									}}
								/>
								<Button
									border="1px solid rgba(0, 217, 239, 0.2)"
									borderRightRadius="full"
									bgColor={theme.bg.whiteGray}
									color={theme.text.cyan}
									fontSize="lg"
									fontWeight="normal"
									px="4"
									py="5"
									_hover={{ backgroundColor: theme.bg.blueNavyLightness }}
								>
									max
								</Button>
							</Flex>
							<Text fontWeight="normal" mt="2">
								Uncalimed PSYS: 0.01819
							</Text>

							<Flex justify="center">
								<Slider
									id="slider"
									mt="9"
									defaultValue={5}
									min={0}
									max={100}
									mb="4"
									w="85%"
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
							<Flex mt="7" mb="2" gap="4">
								<Button
									fontSize="lg"
									fontWeight="semibold"
									py="3"
									px="1.5rem"
									w="100%"
									h="max-content"
									border="1px solid"
									borderColor={theme.text.cyan}
									bgColor="transparent"
									color="white"
									_hover={{ opacity: "1" }}
									_active={{}}
									borderRadius="full"
								>
									Cancel
								</Button>
								<Button
									fontSize="lg"
									fontWeight="semibold"
									py="3"
									px="1.5rem"
									w="100%"
									h="max-content"
									bgColor={theme.bg.blueNavyLightness}
									color={theme.text.cyan}
									_hover={{ opacity: "1" }}
									_active={{}}
									borderRadius="full"
								>
									Unstake
								</Button>
							</Flex>
						</Flex>
					)}
					{buttonId === "claim" && (
						<Flex flexDirection="column" gap="6">
							<Flex
								bgColor={theme.bg.whiteGray}
								flexDirection="column"
								justifyContent="center"
								alignItems="center"
								py="2"
								gap="2"
								borderRadius="xl"
								w="100%"
							>
								<Flex flexDirection="row" alignItems="center">
									<Img src="icons/pegasys.png" w="6" h="6" />
									<Text fontSize="2xl" fontWeight="semibold" pl="2">
										0.132323
									</Text>
								</Flex>
								<Flex flexDirection="row">
									<Text>Unclaimed PSYS</Text>
								</Flex>
							</Flex>
							<Button
								fontSize="lg"
								fontWeight="semibold"
								py="3"
								my="4"
								px="1.5rem"
								w="100%"
								h="max-content"
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								_hover={{ opacity: "1" }}
								_active={{}}
								borderRadius="full"
							>
								Claim PSYS
							</Button>
						</Flex>
					)}
				</ModalBody>
				<Flex>
					{buttonId === "unstake" && (
						<Flex
							flexDirection="row"
							p="1.5rem"
							background={theme.text.gray600}
							position={["relative", "relative", "absolute", "absolute"]}
							w="100%"
							top={["unset", "unset", "24rem", "24rem"]}
							borderTopRadius={["0", "0", "3xl", "3xl"]}
							borderBottomRadius={["0", "0", "3xl", "3xl"]}
							alignItems="flex-start"
							gap="2"
						>
							<Flex>
								<Icon as={MdOutlineInfo} w="6" h="6" color={theme.text.cyan} />
							</Flex>
							<Flex flexDirection="column" gap="6">
								<Text>
									When you partially unstake your deposits, you will keep
									earning rewards from this staking pool proportionally to your
									remaining staked balance.
								</Text>
							</Flex>
						</Flex>
					)}
					{buttonId === "stake" && (
						<Flex
							flexDirection="row"
							p="1.5rem"
							background={theme.text.gray600}
							position={["relative", "relative", "absolute", "absolute"]}
							w="100%"
							top={["unset", "unset", "24rem", "24rem"]}
							borderTopRadius={["0", "0", "3xl", "3xl"]}
							borderBottomRadius={["0", "0", "3xl", "3xl"]}
							alignItems="flex-start"
							gap="2"
						>
							<Flex>
								<Icon as={MdOutlineInfo} w="6" h="6" color={theme.text.cyan} />
							</Flex>
							<Flex flexDirection="column" gap="6">
								<Text>
									Please note that when you claim without withdrawing your
									liquidity remains in the staking pool.
								</Text>
							</Flex>
						</Flex>
					)}
				</Flex>
			</ModalContent>
		</Modal>
	);
};
