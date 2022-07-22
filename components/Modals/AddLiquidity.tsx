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
	useDisclosure,
} from "@chakra-ui/react";
import { usePicasso, useTokens } from "hooks";
import React, { useEffect, useState } from "react";
import { MdHelpOutline, MdArrowBack, MdAdd } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { SelectCoinModal } from "components";
import { WrappedTokenInfo } from "types";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
	isCreate?: boolean;
	haveValue?: boolean;
}

export const AddLiquidityModal: React.FC<IModal> = props => {
	const { isModalOpen, onModalClose, isCreate, haveValue } = props;

	const { userTokensBalance } = useTokens();

	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [buttonId, setButtonId] = useState<number>(0);

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
				isOpen={isOpen}
				onClose={onClose}
				selectedToken={selectedToken}
				setSelectedToken={setSelectedToken}
				buttonId={buttonId}
			/>
			<ModalOverlay />
			<ModalContent
				mb="20rem"
				h="max-content"
				borderRadius="3xl"
				border="1px solid transparent;"
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
					<Flex alignItems="center" width="100%" justifyContent="center">
						<Flex
							height="20%"
							width="90%"
							borderRadius="2xl"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							textAlign="left"
							p="1.5rem"
							flexDirection="column"
							gap={3}
						>
							<Text
								fontSize="md"
								fontWeight="semibold"
								textAlign="left"
								color={theme.text.cyan}
							>
								You are the first liquidity provider.
							</Text>
							<Text
								fontSize="md"
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
						borderRadius={30}
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
							flexDirection="column"
						>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								color={theme.text.swapInfo}
							/>
							<Flex alignItems="center" justifyContent="space-around">
								<Flex alignItems="center">
									<Flex
										alignItems="center"
										justifyContent="center"
										px="5"
										py="1"
										id="0"
										w="max-content"
										onClick={(event: React.MouseEvent<HTMLInputElement>) => {
											onOpen();
											setButtonId(Number(event.currentTarget.id));
										}}
										borderRadius="2xl"
										cursor="pointer"
										_hover={{
											bgColor: theme.bg.button.swapTokenCurrency,
										}}
									>
										<Img src={selectedToken[0].logoURI} w="6" h="6" />
										<Text fontSize="xl" fontWeight="500" px="3">
											{selectedToken[0].symbol}
										</Text>
										<Icon as={IoIosArrowDown} />
									</Flex>
									<Input
										fontSize="xl"
										border="none"
										placeholder="0.00"
										textAlign="right"
										mt="2"
										px="1.5"
										ml="50"
										type="number"
										_placeholder={{ color: "white" }}
										_active={{ border: "none" }}
									/>
								</Flex>
							</Flex>
						</Flex>
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
							flexDirection="column"
						>
							<Flex
								flexDirection="row"
								justifyContent="space-between"
								color={theme.text.swapInfo}
							/>
							<Flex alignItems="center" justifyContent="space-around">
								<Flex alignItems="center">
									<Flex
										alignItems="center"
										justifyContent="center"
										px="5"
										py="1"
										id="1"
										w="max-content"
										onClick={(event: React.MouseEvent<HTMLInputElement>) => {
											onOpen();
											setButtonId(Number(event.currentTarget.id));
										}}
										borderRadius="2xl"
										cursor="pointer"
										_hover={{
											bgColor: theme.bg.button.swapTokenCurrency,
										}}
									>
										<Img src={selectedToken[1].logoURI} w="6" h="6" />
										<Text fontSize="xl" fontWeight="500" px="3">
											{selectedToken[1].symbol}
										</Text>
										<Icon as={IoIosArrowDown} />
									</Flex>
									<Input
										fontSize="xl"
										border="none"
										placeholder="0.00"
										textAlign="right"
										mt="2"
										px="1.5"
										ml="50"
										type="number"
										_placeholder={{ color: "white" }}
									/>
								</Flex>
							</Flex>
						</Flex>
						{!haveValue && (
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
									flexDirection="row"
									justifyContent="space-between"
									py="1rem"
									px="1rem"
									borderRadius="2xl"
									borderWidth="1px"
									borderColor={theme.text.cyan}
									bgColor={theme.bg.blueNavy}
								>
									<Flex fontSize="sm" flexDirection="column" textAlign="center">
										<Text fontWeight="semibold">1.80806</Text>
										<Text fontWeight="normal">SYS per USDT</Text>
									</Flex>
									<Flex fontSize="sm" flexDirection="column" textAlign="center">
										<Text fontWeight="semibold">0.553078</Text>
										<Text fontWeight="normal">USDT per SYS</Text>
									</Flex>
									<Flex fontSize="sm" flexDirection="column" textAlign="center">
										<Text fontWeight="semibold">1.80806</Text>
										<Text fontWeight="normal">SYS per USDT</Text>
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
				<Flex
					flexDirection="column"
					p="1.5rem"
					background={theme.bg.blueNavy}
					position="absolute"
					w="100%"
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
