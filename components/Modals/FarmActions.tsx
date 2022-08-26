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
import React, { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdArrowBack, MdOutlineInfo } from "react-icons/md";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	buttonId: string;
	setButtonId: Dispatch<SetStateAction<string>>;
}

export const FarmActions: React.FC<IModal> = props => {
	const { isOpen, onClose, buttonId, setButtonId } = props;
	const theme = usePicasso();
	const [confirmDepoist] = useState(false);
	const [sliderValue, setSliderValue] = React.useState(5);
	const [showTooltip, setShowTooltip] = React.useState(false);

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				mt={["8rem", "8", "10rem", "10rem"]}
				mb={["0", "0", "10rem", "10rem"]}
				position={["absolute", "absolute", "relative", "relative"]}
				bottom="0"
				maxWidth="max-content"
				w={["100vw", "100vw", "max-content", "max-content"]}
				h={["max-content", "100vh", "max-content", "max-content"]}
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				bgColor={theme.bg.blueNavyLight}
				border={["none", "1px solid transparent"]}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					backgroundColor={theme.bg.blueNavyLight}
					borderTopRadius="3xl"
					alignItems="baseline"
					justifyContent="space-between"
					pl={["5", "5", "20", "20"]}
				>
					<Flex
						flexDirection={["column-reverse", "column-reverse", "row", "row"]}
						justifyContent="space-between"
						alignItems={["flex-start", "flex-start", "center", "center"]}
					>
						<Flex
							pr={["0", "0", "7", "7"]}
							pl={["0", "16", "0", "0"]}
							gap="2"
							flexDirection="row"
							mt={["6", "6", "2", "2"]}
						>
							<Button
								w="max-content"
								h="max-content"
								py="3"
								px={["6", "6", "8", "8"]}
								borderRadius="full"
								onClick={() => setButtonId("deposit")}
								bgColor={
									buttonId === "deposit"
										? theme.bg.farmActionsHover
										: "transparent"
								}
								color={
									buttonId === "deposit"
										? theme.text.farmActionsHover
										: theme.text.farmActionsTop
								}
								fontWeight="semibold"
								_hover={{ opacity: "0.9" }}
							>
								Deposit
							</Button>
							<Button
								id="1"
								w="max-content"
								h="max-content"
								py="3"
								px={["6", "6", "8", "8"]}
								borderRadius="full"
								onClick={() => setButtonId("withdraw")}
								bgColor={
									buttonId === "withdraw"
										? theme.bg.farmActionsHover
										: "transparent"
								}
								color={
									buttonId === "withdraw"
										? theme.text.farmActionsHover
										: theme.text.farmActionsTop
								}
								fontWeight="semibold"
								_hover={{ opacity: "0.9" }}
							>
								Withdraw
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
										: theme.text.farmActionsTop
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
								Farms
							</Text>
						</Flex>
					</Flex>
				</ModalHeader>
				<ModalBody
					mb="2	"
					borderBottomRadius={["0", "0", "3xl", "3xl"]}
					background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
				>
					{buttonId === "deposit" && (
						<Flex flexDirection="column">
							<Flex gap="2">
								<Flex>
									<Img src="icons/syscoin-logo.png" w="6" h="6" />
									<Img src="icons/pegasys.png" w="6" h="6" />
								</Flex>
								<Flex>
									<Text fontSize="lg" fontWeight="bold">
										SYS
									</Text>
									<Text fontSize="lg" fontWeight="bold">
										:
									</Text>
									<Text fontSize="lg" fontWeight="bold">
										PSYS
									</Text>
								</Flex>
							</Flex>
							<Flex
								flexDirection="column"
								gap="2"
								mt="6"
								color={theme.text.mono}
							>
								<Text fontWeight="normal">
									Available to deposit: 0.00000000001
								</Text>
								{!confirmDepoist ? (
									<Flex>
										<InputGroup size="lg">
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
												border="1px solid transparent;"
												background={`linear-gradient(${theme.bg.max}, ${theme.bg.max}) padding-box, rgba(1, 219, 243, 0.2) border-box`}
												borderRightRadius="full"
												color={theme.text.max}
												fontSize="lg"
												fontWeight="normal"
												_hover={{}}
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
											<Img src="icons/pegasys.png" w="6" h="6" />
											<Text fontSize="2xl" fontWeight="semibold" pl="2">
												1
											</Text>
										</Flex>
										<Flex flexDirection="row">
											<Text>SYS</Text>
											<Text>:</Text>
											<Text>PSYS</Text>
										</Flex>
									</Flex>
								)}
								<Text fontWeight="normal" pt="1.5rem">
									Weekly Rewards: 0 PSYS / Week
								</Text>
								<Text fontWeight="normal">Extra Reward: 0 PSYS / Week</Text>
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
								_hover={{
									opacity: "1",
									bgColor: theme.bg.bluePurple,
								}}
								_active={{}}
								borderRadius="full"
							>
								Approve
							</Button>
						</Flex>
					)}
					{buttonId === "withdraw" && (
						<Flex flexDirection="column">
							<Text fontWeight="normal" mb="2">
								Deposited PLP Liquidity: 0.000001
							</Text>
							<Flex flexDirection="row">
								<Input
									placeholder="0.0"
									border="1px solid"
									borderColor={theme.border.farmInput}
									bgColor={theme.bg.blackAlpha}
									borderLeftRadius="full"
									p="5"
									w="25rem"
									_focus={{ outline: "none" }}
								/>
								<Button
									border="1px solid"
									borderColor={theme.border.farmInput}
									borderRightRadius="full"
									bgColor={theme.bg.max}
									color={theme.text.max}
									fontSize="lg"
									fontWeight="normal"
									px="4"
									py="5"
									_hover={{
										borderColor: theme.border.farmInput,
										opacity: 0.9,
									}}
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
										bg="teal.500"
										color="white"
										placement="top"
										isOpen={showTooltip}
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
									h="max-content"
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
									_hover={{ opacity: "1", bgColor: theme.bg.bluePurple }}
									_active={{}}
									borderRadius="full"
								>
									Withdraw
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
								_hover={{ opacity: "1", bgColor: theme.bg.bluePurple }}
								_active={{}}
								borderRadius="full"
							>
								Claim PSYS
							</Button>
						</Flex>
					)}
				</ModalBody>
				<Flex>
					{buttonId === "withdraw" && (
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
									Here the text would change explaining the “Exit” mode I
									think... Need to confirm the warning content.
								</Text>
							</Flex>
						</Flex>
					)}
					{buttonId === "claim" && (
						<Flex
							flexDirection="row"
							p="1.5rem"
							background={theme.bg.subModal}
							position={["relative", "relative", "absolute", "absolute"]}
							w="100%"
							top={["unset", "unset", "20rem", "20rem"]}
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
									When you withdraw, your PSYS is claimed and your Pegasys
									Liquidity tokens, PLP, are returned to you. You will no longer
									earn PSYS rewards on this liquidity. Your original token
									liquidity will remain in its liquidity pool.
								</Text>
							</Flex>
						</Flex>
					)}
				</Flex>
			</ModalContent>
		</Modal>
	);
};
