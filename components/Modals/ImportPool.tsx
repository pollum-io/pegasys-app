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
} from "@chakra-ui/react";
import { useModal, usePicasso, useTokens } from "hooks";
import React, { useEffect, useState } from "react";
import { MdArrowBack, MdHelpOutline, MdAdd } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { SelectCoinModal } from "components";
import { WrappedTokenInfo } from "types";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
}

export const ImportPoolModal: React.FC<IModal> = props => {
	const { isModalOpen, onModalClose } = props;

	const { userTokensBalance } = useTokens();

	const theme = usePicasso();
	const { isOpenCoin, onCloseCoin, onOpenCoin } = useModal();
	const [selectedToken, setSelectedToken] = useState<WrappedTokenInfo[]>([]);
	const [buttonId, setButtonId] = useState<number>(0);

	useEffect(() => {
		const defaultTokenValues = userTokensBalance.filter(
			tokens =>
				tokens.symbol === "WSYS" ||
				tokens.symbol === "SYS" ||
				tokens.symbol === "PSYS"
		);

		setSelectedToken([defaultTokenValues[0], defaultTokenValues[1]]);
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
				buttonId={buttonId}
				selectedToken={selectedToken}
				setSelectedToken={setSelectedToken}
			/>
			<ModalOverlay />
			<ModalContent
				bottom={["0", "0", "0", "0"]}
				mb={["0"]}
				position={["absolute", "absolute", "relative", "relative"]}
				h={["max-content", "max-content", "max-content", "max-content"]}
				p="1.5rem"
				borderRadius="3xl"
				borderBottomRadius={["0px", "3xl", "3xl", "3xl"]}
				border="1px solid transparent;"
				background={`linear-gradient(${theme.bg.whiteGray}, ${theme.bg.whiteGray}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					display="flex"
					alignItems="baseline"
					justifyContent="space-between"
					p="0"
				>
					<Flex alignItems="center">
						<Flex _hover={{ cursor: "pointer" }} onClick={onModalClose}>
							<MdArrowBack size={24} />
						</Flex>
						<Text fontSize="2xl" fontWeight="medium" textAlign="center" px="4">
							Import Pool
						</Text>
					</Flex>
					<Tooltip
						hasArrow
						label="When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time."
						position="relative"
						bgColor="red"
						border="1px solid"
						borderColor={theme.border.borderSettings}
						color={theme.text.swapInfo}
						borderRadius="md"
					>
						<Text as="span" _hover={{ opacity: 0.8 }}>
							<Icon
								as={MdHelpOutline}
								h="5"
								w="5"
								color="white"
								backgroundColor="gray.800"
								borderRadius="full"
							/>
						</Text>
					</Tooltip>
				</ModalHeader>

				<Flex flexDirection="column" mt="4">
					<Flex
						height="max-content"
						width="100%"
						bgColor={theme.bg.whiteGray}
						margin="0 auto"
						position="relative"
						flexDirection="column"
					>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							bgColor={theme.bg.blueNavy}
							id="0"
							width="100%"
							onClick={(event: React.MouseEvent<HTMLInputElement>) => {
								onOpenCoin();
								setButtonId(Number(event.currentTarget.id));
							}}
							p="4"
							borderRadius="2xl"
							cursor="pointer"
							_hover={{
								bgColor: theme.bg.button.swapTokenCurrency,
							}}
						>
							<Img src={selectedToken[0]?.logoURI} w="6" h="6" />
							<Text
								fontSize="xl"
								fontWeight="500"
								width="100%"
								px="3"
								textAlign="start"
							>
								{selectedToken[0]?.symbol}
							</Text>
							<IoIosArrowDown />
						</Flex>

						<Flex justifyContent="center" my="4">
							<MdAdd size={24} color={theme.text.cyan} />
						</Flex>

						<Flex
							height="max-content"
							width="100%"
							bgColor={theme.bg.whiteGray}
							margin="0 auto"
							position="relative"
							flexDirection="column"
						>
							<Flex
								alignItems="center"
								justifyContent="space-between"
								bgColor={theme.bg.blueNavy}
								id="1"
								width="100%"
								onClick={(event: React.MouseEvent<HTMLInputElement>) => {
									onOpenCoin();
									setButtonId(Number(event.currentTarget.id));
								}}
								p="4"
								borderRadius="2xl"
								cursor="pointer"
								_hover={{
									bgColor: theme.bg.button.swapTokenCurrency,
								}}
							>
								<Img src={selectedToken[1]?.logoURI} w="6" h="6" />
								<Text
									fontSize="xl"
									fontWeight="500"
									width="100%"
									px="3"
									textAlign="start"
								>
									{selectedToken[1]?.symbol}
								</Text>
								<IoIosArrowDown />
							</Flex>
						</Flex>

						<Flex>
							<Button
								w="100%"
								mt="1.5rem"
								py="6"
								px="6"
								borderRadius="67px"
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								fontSize="lg"
								fontWeight="semibold"
							>
								Import pool
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
