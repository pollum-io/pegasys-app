import {
	Button,
	Flex,
	Icon,
	Img,
	Input,
	InputGroup,
	InputRightAddon,
	Modal,
	ModalBody,
	ModalContent,
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
import { useStake } from "pegasys-services";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	buttonId: string;
	setButtonId: Dispatch<SetStateAction<string>>;
}

export const StakeActions: React.FC<IModal> = props => {
	const { isOpen, onClose, buttonId, setButtonId } = props;
	const theme = usePicasso();
	const [confirmStake] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [isAprroving] = useState("");
	const [isApproved] = useState("");
	const [sliderValue, setSliderValue] = React.useState(5);
	const [showTooltip, setShowTooltip] = React.useState(false);
	const {
		claim,
		stake,
		unstake,
		selectedStake,
		stakeTypedValue,
		setStakeTypedValue,
	} = useStake();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

	if (!selectedStake) {
		return null;
	}

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				mt={["0", "0", "10rem", "10rem"]}
				mb="0"
				position={["absolute", "absolute", "relative", "relative"]}
				bottom="0"
				w={["100vw", "100vw", "max-content", "max-content"]}
				h={["max-content", "max-content", "max-content", "max-content"]}
				borderRadius="3xl"
				bgColor={theme.bg.blueNavyLight}
				border={[
					"none",
					"none",
					"1px solid transparent",
					"1px solid transparent",
				]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					backgroundColor={theme.bg.blueNavyLight}
					borderTopRadius="3xl"
					alignItems="baseline"
					justifyContent="space-between"
				>
					<Flex
						flexDirection={["column-reverse", "column-reverse", "row", "row"]}
						justifyContent="space-between"
						alignItems={["flex-start", "flex-start", "center", "center"]}
					>
						<Flex pr="7" gap="2" mt={["6", "6", "2", "2"]}>
							<Button
								w="max-content"
								h="max-content"
								py="3"
								px={["6", "6", "8", "8"]}
								borderRadius="full"
								onClick={() => setButtonId("stake")}
								bgColor={
									buttonId === "stake"
										? theme.bg.farmActionsHover
										: "transparent"
								}
								color={
									buttonId === "stake"
										? theme.text.farmActionsHover
										: theme.border.borderSettings
								}
								fontWeight="semibold"
								_hover={{
									opacity: "0.9",
								}}
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
									buttonId === "unstake"
										? theme.bg.farmActionsHover
										: "transparent"
								}
								color={
									buttonId === "unstake"
										? theme.text.farmActionsHover
										: theme.border.borderSettings
								}
								fontWeight="semibold"
								_hover={{
									opacity: "0.9",
								}}
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
									buttonId === "claim"
										? theme.bg.farmActionsHover
										: "transparent"
								}
								color={
									buttonId === "claim"
										? theme.text.farmActionsHover
										: theme.border.borderSettings
								}
								fontWeight="semibold"
								_hover={{
									opacity: "0.9",
								}}
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
									md: "flex",
									lg: "flex",
								}}
								position="relative"
								right="2"
								bottom="4"
							>
								<AiOutlineClose size={20} color={theme.icon.closeWhiteGray} />
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
								Stake
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
								<Text fontWeight="normal">
									Available to deposit:{" "}
									{selectedStake.unstakedPsysAmount.toFixed(10, {
										groupSeparator: ",",
									})}
								</Text>
								{!confirmStake ? (
									<Flex>
										<InputGroup size="md">
											<Input
												placeholder="0.0"
												border="1px solid"
												borderColor={theme.border.farmInput}
												bgColor={theme.bg.blackAlpha}
												borderLeftRadius="full"
												w="25rem"
												_hover={{}}
												_focus={{
													outline: "none",
												}}
												value={stakeTypedValue}
												onChange={event =>
													setStakeTypedValue(event.target.value)
												}
											/>
											<InputRightAddon
												// eslint-disable-next-line react/no-children-prop
												children="max"
												border="1px solid"
												borderColor={theme.border.farmInput}
												background={theme.bg.max}
												borderRightRadius="full"
												color={theme.text.max}
												fontSize="lg"
												fontWeight="normal"
												transition="100ms ease-in-out"
												_hover={{
													borderColor: theme.border.farmInput,
													bgColor: theme.bg.blueNavyLightness,
													color: theme.text.cyan,
													cursor: "pointer",
												}}
											/>
										</InputGroup>
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
								mt="1.5rem"
								mb="1rem"
								h="max-content"
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								_hover={
									inputValue
										? { bgColor: theme.bg.bluePurple }
										: { opacity: "0.3" }
								}
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
								Deposited PLP Liquidity:{" "}
								{selectedStake.stakedAmount.toFixed(10, {
									groupSeparator: ",",
								})}
							</Text>
							<Flex>
								<InputGroup size="md">
									<Input
										placeholder="0.0"
										border="1px solid"
										borderColor={theme.border.farmInput}
										bgColor={theme.bg.blackAlpha}
										borderLeftRadius="full"
										w="25rem"
										_hover={{}}
										_focus={{
											outline: "none",
										}}
									/>
									<InputRightAddon
										// eslint-disable-next-line react/no-children-prop
										children="max"
										border="1px solid"
										borderColor={theme.border.farmInput}
										background={theme.bg.max}
										borderRightRadius="full"
										color={theme.text.max}
										fontSize="lg"
										fontWeight="normal"
										transition="100ms ease-in-out"
										_hover={{
											borderColor: theme.border.farmInput,
											bgColor: theme.bg.blueNavyLightness,
											color: theme.text.cyan,
											cursor: "pointer",
										}}
									/>
								</InputGroup>
							</Flex>
							<Text fontWeight="normal" mt="2">
								Uncalimed PSYS:{" "}
								{selectedStake.earnedAmount.toFixed(10, {
									groupSeparator: ",",
								})}
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
									onChange={(value: number) => setSliderValue(value)}
									onMouseEnter={() => setShowTooltip(true)}
									onMouseLeave={() => setShowTooltip(false)}
								>
									<SliderMark value={0} mt="0.5rem" ml="1.5" fontSize="sm">
										0%
									</SliderMark>
									<SliderMark value={25} mt="0.5rem" ml="-2.5" fontSize="sm">
										25%
									</SliderMark>
									<SliderMark value={50} mt="0.5rem" ml="-2.5" fontSize="sm">
										50%
									</SliderMark>
									<SliderMark value={75} mt="0.5rem" ml="-2.5" fontSize="sm">
										75%
									</SliderMark>
									<SliderMark value={100} mt="0.5rem" ml="-8" fontSize="sm">
										100%
									</SliderMark>
									<SliderTrack>
										<SliderFilledTrack bg={theme.text.psysBalance} />
									</SliderTrack>

									<Tooltip
										hasArrow
										filter="drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.1)) drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.06))"
										bgColor={theme.bg.secondary}
										color={theme.text.mono}
										placement="top"
										isOpen={showTooltip}
										label={`${sliderValue}%`}
									>
										<SliderThumb />
									</Tooltip>
								</Slider>
							</Flex>
							<Flex mt="1.5rem" mb="1rem" gap="4">
								<Button
									fontSize="lg"
									fontWeight="semibold"
									py="3"
									px="1.5rem"
									w="100%"
									h={["2.5rem", "2.5rem", "3rem", "3rem"]}
									border="1px solid"
									borderColor={theme.text.cyanPurple}
									bgColor="transparent"
									color={theme.text.whitePurple}
									_hover={{
										borderColor: theme.text.cyanLightPurple,
										color: theme.text.cyanLightPurple,
									}}
									_active={{}}
									borderRadius="full"
									onClick={onClose}
								>
									Cancel
								</Button>
								<Button
									fontSize="lg"
									fontWeight="semibold"
									py="3"
									px="1.5rem"
									w="100%"
									h={["2.5rem", "2.5rem", "3rem", "3rem"]}
									bgColor={theme.bg.blueNavyLightness}
									color={theme.text.cyan}
									_hover={{ bgColor: theme.bg.bluePurple }}
									_active={{}}
									borderRadius="full"
									onClick={unstake}
								>
									Unstake
								</Button>
							</Flex>
						</Flex>
					)}
					{buttonId === "claim" && (
						<Flex flexDirection="column" gap="6">
							<Flex
								bgColor={theme.bg.max}
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
										{selectedStake.earnedAmount.toFixed(10, {
											groupSeparator: ",",
										})}
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
								_hover={{ opacity: "1", bgColor: theme.bg.bluePurple }}
								_active={{}}
								borderRadius="full"
								onClick={claim}
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
							background={theme.bg.subModal}
							position={["relative", "relative", "absolute", "absolute"]}
							w="100%"
							top={["unset", "unset", "24rem", "24rem"]}
							borderTopRadius={["0", "0", "3xl", "3xl"]}
							borderBottomRadius={["0", "0", "3xl", "3xl"]}
							alignItems="flex-start"
							gap="2"
						>
							<Flex>
								<Icon
									as={MdOutlineInfo}
									w="6"
									h="6"
									color={theme.text.cyanPurple}
								/>
							</Flex>
							<Flex flexDirection="column" gap="6" color={theme.text.mono}>
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
							background={theme.bg.subModal}
							position={["relative", "relative", "absolute", "absolute"]}
							w="100%"
							top={["unset", "unset", "24rem", "23rem"]}
							borderTopRadius={["0", "0", "3xl", "3xl"]}
							borderBottomRadius={["0", "0", "3xl", "3xl"]}
							alignItems="flex-start"
							gap="2"
						>
							<Flex>
								<Icon
									as={MdOutlineInfo}
									w="6"
									h="6"
									color={theme.text.cyanPurple}
								/>
							</Flex>
							<Flex flexDirection="column" gap="6" color={theme.text.mono}>
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
