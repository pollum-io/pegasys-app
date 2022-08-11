import {
	Button,
	Flex,
	Icon,
	Input,
	Modal,
	ModalContent,
	ModalHeader,
	Img,
	ModalOverlay,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { useModal, usePicasso } from "hooks";
import React, { useState } from "react";
import {
	MdHelpOutline,
	MdArrowBack,
	MdAdd,
	MdOutlineInfo,
} from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { SelectCoinModal } from "components";
import { WrappedTokenInfo } from "types";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
	isCreate?: boolean;
	haveValue?: boolean;
}
interface ITokenInputValue {
	inputFrom: string;
	inputTo: string;
}

export const AddLiquidityModal: React.FC<IModal> = props => {
	const { isModalOpen, onModalClose, isCreate, haveValue } = props;

	const { userTokensBalance } = useTokens();

	const theme = usePicasso();
	const { onOpenCoin, isOpenCoin, onCloseCoin } = useModal();
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [buttonId, setButtonId] = useState<number>(0);
	const [tokenInputValue, setTokenInputValue] = useState<ITokenInputValue>({
		inputFrom: "",
		inputTo: "",
	});

	const handleOnChangeTokenInputs = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const regexPreventLetters = /^(?!,$)[\d,.]+$/;

		const inputValue = event?.target?.value;

		if (inputValue === "" || regexPreventLetters.test(inputValue)) {
			setTokenInputValue(prevState => ({
				...prevState,
				[event.target.name]: inputValue,
			}));
		}
	};

	useEffect(() => {
		setSelectedToken([userTokensBalance[0], userTokensBalance[1]]);
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
				mb={["0", "0", "20rem", "20rem"]}
				top={["1rem", "2rem", "0", "0"]}
				position={["absolute", "absolute", "relative", "relative"]}
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				h={["100%", "100%", "max-content", "max-content"]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				border={["none", "1px solid transparent"]}
				background={`linear-gradient(${theme.bg.whiteGray}, ${theme.bg.whiteGray}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					display="flex"
					alignItems="baseline"
					justifyContent="space-between"
					pt="4"
				>
					<Flex alignItems="center">
						<Flex _hover={{ cursor: "pointer" }} onClick={onModalClose}>
							<MdArrowBack size={24} />
						</Flex>
						<Text fontSize="2xl" fontWeight="medium" textAlign="center" px="4">
							{isCreate ? "Create a pair" : "Add Liquidity"}
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
				{isCreate && (
					<Flex alignItems="center" w="100%" justifyContent="center">
						<Flex
							w={["90%", "90%", "90%", "90%"]}
							h={["100%", "max-content", "90%", "100%"]}
							borderRadius="2xl"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							p="1.5rem"
							flexDirection="column"
							gap={3}
						>
							<Text
								fontSize={["sm", "sm", "md", "md"]}
								fontWeight="semibold"
								textAlign="left"
								color={theme.text.cyan}
							>
								You are the first liquidity provider.
							</Text>
							<Text
								fontSize={["sm", "sm", "md", "md"]}
								fontWeight="normal"
								textAlign="left"
								lineHeight="base"
								color={theme.text.cyan}
							>
								The ratio of tokens you add will set the price of this pool.
								Once you are happy with the rate click supply to review.
							</Text>
						</Flex>
					</Flex>
				)}

				<Flex flexDirection="column">
					<Flex
						height="max-content"
						width="100%"
						bgColor={theme.bg.whiteGray}
						margin="0 auto"
						position="relative"
						borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
						h="100%"
						borderBottomRadius={["0px", "0", "3xl", "3xl"]}
						p="5"
						flexDirection="column"
					>
						<Flex
							borderRadius={18}
							width="100%"
							height="max-content"
							px="4"
							py="2"
							bgColor={theme.bg.blueNavy}
							flexDirection="row"
							justifyContent="space-between"
							border="1px solid"
							borderColor={
								tokenInputValue.inputFrom > selectedToken[0]?.balance
									? theme.text.red400
									: "#ff000000"
							}
						>
							<Flex flexDirection="column" color={theme.text.swapInfo}>
								<Text fontSize="sm">Input</Text>
								<Flex
									alignItems="center"
									justifyContent="center"
									py="1"
									mt="1"
									id="0"
									w="max-content"
									onClick={(event: React.MouseEvent<HTMLInputElement>) => {
										onOpen();
										setButtonId(Number(event.currentTarget.id));
									}}
									borderRadius="2xl"
									cursor="pointer"
									_hover={{}}
								>
									<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
									<Text
										fontSize="xl"
										fontWeight="500"
										px="3"
										_hover={{ opacity: "0.9" }}
									>
										{selectedToken[0]?.symbol}
									</Text>
									<Icon as={IoIosArrowDown} />
								</Flex>
							</Flex>
							<Flex
								flexDirection="column"
								color={theme.text.swapInfo}
								alignItems="flex-end"
							>
								<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
									Balance: {selectedToken[0]?.balance}
								</Text>
								<Input
									fontSize="xl"
									border="none"
									w="85%"
									placeholder="0.00"
									textAlign="right"
									mt="2"
									px="1.5"
									type="number"
									_placeholder={{ color: "white" }}
									_active={{ border: "none" }}
									name="inputFrom"
									onChange={handleOnChangeTokenInputs}
									value={tokenInputValue.inputFrom}
								/>
							</Flex>
						</Flex>
						{tokenInputValue.inputFrom > selectedToken[0]?.balance && (
							<Flex flexDirection="row" gap="1" justifyContent="center">
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
									fontWeight="semibold"
								>
									Insufficient {selectedToken[0]?.symbol} balance.
								</Text>
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
								>
									Please insert a valid amount.
								</Text>
							</Flex>
						)}
						<Flex justifyContent="center" my="4">
							<MdAdd size={24} color={theme.text.cyan} />
						</Flex>
						<Flex
							borderRadius={18}
							width="100%"
							height="max-content"
							px="4"
							py="2"
							bgColor={theme.bg.blueNavy}
							flexDirection="row"
							justifyContent="space-between"
							border="1px solid"
							borderColor={
								tokenInputValue.inputTo > selectedToken[1]?.balance
									? theme.text.red400
									: "#ff000000"
							}
						>
							<Flex flexDirection="column" color={theme.text.swapInfo}>
								<Text fontSize="sm">Input</Text>
								<Flex
									alignItems="center"
									justifyContent="center"
									py="1"
									mt="1"
									id="1"
									w="max-content"
									onClick={(event: React.MouseEvent<HTMLInputElement>) => {
										onOpen();
										setButtonId(Number(event.currentTarget.id));
									}}
									borderRadius="2xl"
									cursor="pointer"
									_hover={{}}
								>
									<Img src={selectedToken[1]?.logoURI} w="6" h="6" />
									<Text
										fontSize="xl"
										fontWeight="500"
										px="3"
										_hover={{ opacity: "0.9" }}
									>
										{selectedToken[1]?.symbol}
									</Text>
									<Icon as={IoIosArrowDown} />
								</Flex>
							</Flex>
							<Flex
								flexDirection="column"
								color={theme.text.swapInfo}
								alignItems="flex-end"
							>
								<Text fontSize="md" fontWeight="400" color={theme.text.gray500}>
									Balance: {selectedToken[1]?.balance}
								</Text>
								<Input
									fontSize="xl"
									border="none"
									w="85%"
									placeholder="0.00"
									textAlign="right"
									mt="2"
									px="1.5"
									type="number"
									_placeholder={{ color: "white" }}
									_active={{ border: "none" }}
									name="inputTo"
									value={tokenInputValue.inputTo}
									onChange={handleOnChangeTokenInputs}
								/>
							</Flex>
						</Flex>
						{tokenInputValue.inputTo > selectedToken[1]?.balance && (
							<Flex flexDirection="row" gap="1" justifyContent="center">
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
									fontWeight="semibold"
								>
									Insufficient {selectedToken[1]?.symbol} balance.
								</Text>
								<Text
									fontSize="sm"
									pt="2"
									textAlign="center"
									color={theme.text.red400}
								>
									Please insert a valid amount.
								</Text>
							</Flex>
						)}
						{tokenInputValue.inputTo && tokenInputValue.inputFrom && (
							<Flex
								flexDirection="column"
								borderRadius="2xl"
								bgColor="transparent"
								borderWidth="1px"
								borderColor={theme.text.cyan}
								mt="1.5rem"
							>
								<Text fontSize="md" fontWeight="medium" px="1.375rem" py="1rem">
									Prices and pool share
								</Text>
								<Flex
									flexDirection={["column", "row", "row", "row"]}
									justifyContent="space-between"
									py="1rem"
									px="1rem"
									borderRadius="2xl"
									borderWidth="1px"
									borderColor={theme.text.cyan}
									bgColor={theme.bg.blueNavy}
								>
									<Flex
										fontSize="sm"
										flexDirection={["row", "column", "column", "column"]}
										gap={["2", "0", "0", "0"]}
										textAlign="center"
									>
										<Text fontWeight="semibold">-</Text>
										<Text fontWeight="normal">
											{selectedToken[0]?.symbol} per {selectedToken[1]?.symbol}{" "}
										</Text>
									</Flex>
									<Flex
										fontSize="sm"
										flexDirection={["row", "column", "column", "column"]}
										gap={["2", "0", "0", "0"]}
										textAlign="center"
									>
										<Text fontWeight="semibold">-</Text>
										<Text fontWeight="normal">
											{selectedToken[1]?.symbol} per {selectedToken[0]?.symbol}
										</Text>
									</Flex>
									<Flex
										fontSize="sm"
										gap={["2", "0", "0", "0"]}
										flexDirection={["row", "column", "column", "column"]}
										textAlign="center"
									>
										<Text fontWeight="semibold">-</Text>
										<Text fontWeight="normal">Share of Pool</Text>
									</Flex>
								</Flex>
							</Flex>
						)}
						<Flex>
							<Button
								w="100%"
								mt="1.5rem"
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
					</Flex>
				</Flex>
				{tokenInputValue.inputTo && tokenInputValue.inputFrom ? (
					<Flex
						flexDirection="column"
						p="1.5rem"
						background={theme.bg.blueGray}
						position={["relative", "relative", "absolute", "absolute"]}
						bottom={["0", "0", "-280", "-280"]}
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
								<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
								<Img src={selectedToken[1]?.logoURI} w="6" h="6" />
								<Text pl="2">
									{selectedToken[0]?.symbol}/{selectedToken[1]?.symbol}
								</Text>
							</Flex>
							<Text fontSize="lg" fontWeight="bold">
								-
							</Text>
						</Flex>
						<Flex flexDirection="column">
							<Flex flexDirection="row" justifyContent="space-between">
								<Text fontWeight="semibold">Your pool share:</Text>
								<Text fontWeight="normal">-%</Text>
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Text fontWeight="semibold">{selectedToken[0]?.symbol}</Text>
								<Text fontWeight="normal">-</Text>
							</Flex>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								pt="0.75rem"
							>
								<Text fontWeight="semibold">{selectedToken[1]?.symbol}</Text>
								<Text fontWeight="normal">-</Text>
							</Flex>
						</Flex>
					</Flex>
				) : (
					<Flex
						flexDirection="row"
						p="1.5rem"
						background={theme.bg.blueGray}
						position={["relative", "relative", "absolute", "absolute"]}
						w="100%"
						bottom={["0", "0", "-250", "-250"]}
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
								By adding liquidity you’ll earn 0.25% of all trades on this pair
								proportional to your share of the pool.
							</Text>
							<Text>
								Fees are added to the pool, accrue in real time and can be
								claimed by withdrawing your liquidity.
							</Text>
						</Flex>
					</Flex>
				)}
			</ModalContent>
		</Modal>
	);
};
