import {
	Button,
	Flex,
	Icon,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	Img,
	ModalOverlay,
	Text,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import React, { useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import { FcInfo } from "react-icons/fc";
import { IoIosArrowDown } from "react-icons/io";
import { BiPlus } from "react-icons/bi";
import { SelectCoinModal } from "components";

interface IModal {
	isModalOpen: boolean;
	onModalClose: () => void;
}

interface IToken {
	logoURI: string;
	symbol: string;
	id?: number;
}

export const ImportPoolModal: React.FC<IModal> = props => {
	const { isModalOpen, onModalClose } = props;
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
	const [selectedToken] = useState<IToken[]>([
		{ logoURI: "icons/syscoin-logo.png", symbol: "SYS", id: 0 },
		{ logoURI: "icons/pegasys.png", symbol: "PSYS", id: 1 },
	]);
	const [buttonId, setButtonId] = useState<number>(0);

	return (
		<Modal
			blockScrollOnMount={false}
			isOpen={isModalOpen}
			onClose={onModalClose}
		>
			<SelectCoinModal
				isOpen={isOpen}
				onClose={onClose}
				buttonId={buttonId}
				selectedToken={selectedToken}
			/>
			<ModalOverlay />
			<ModalContent borderRadius="xl" bgColor={theme.bg.whiteGray}>
				<ModalHeader display="flex" alignItems="center">
					<Tooltip
						label="Use this tool to find pairs that don't automatically appear in the interface."
						position="relative"
						bgColor={theme.bg.whiteGray}
						border="1px solid"
						borderColor={theme.border.borderSettings}
						color={theme.text.swapInfo}
						borderRadius="md"
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
					<Text
						fontSize="lg"
						fontWeight="medium"
						textAlign="center"
						margin="0 auto"
					>
						Import Pool
					</Text>
				</ModalHeader>
				<ModalCloseButton top="4" size="md" _focus={{}} />

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
							alignItems="center"
							justifyContent="space-between"
							border="1px solid"
							borderColor={theme.border.swapInput}
							id="0"
							width="100%"
							onClick={event => {
								onOpen();
								setButtonId(Number(event.currentTarget.id));
							}}
							p="5"
							ml="2"
							borderRadius={12}
							cursor="pointer"
							_hover={{
								bgColor: theme.bg.button.swapTokenCurrency,
							}}
						>
							<Img src={selectedToken[0].logoURI} w="6" h="6" />
							<Text
								fontSize="xl"
								fontWeight="500"
								width="100%"
								px="3"
								textAlign="start"
							>
								{selectedToken[0].symbol}
							</Text>
							<IoIosArrowDown />
						</Flex>

						<Flex margin="0 auto" py="4">
							<BiPlus />
						</Flex>

						<Flex
							alignItems="center"
							justifyContent="space-between"
							border="1px solid"
							id="1"
							borderColor={theme.border.swapInput}
							onClick={event => {
								onOpen();
								setButtonId(Number(event.currentTarget.id));
							}}
							width="100%"
							p="5"
							ml="2"
							borderRadius={12}
							cursor="pointer"
							_hover={{
								bgColor: theme.bg.button.swapTokenCurrency,
							}}
						>
							<Img src={selectedToken[1].logoURI} w="6" h="6" />
							<Text
								fontSize="xl"
								fontWeight="500"
								width="100%"
								px="3"
								textAlign="start"
							>
								{selectedToken[1].symbol}
							</Text>
							<IoIosArrowDown />
						</Flex>
						<Flex mt="7">
							<Button w="100%" p="8" borderRadius="12" fontSize="xl">
								Import Pool
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
