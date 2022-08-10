import {
	Button,
	Flex,
	Icon,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Switch,
	Text,
} from "@chakra-ui/react";
import { useModal, usePicasso } from "hooks";
import { MdArrowBack, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { ConfirmList } from "./ConfirmList";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const ManageToken: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { onOpenConfirmList, isOpenConfirmList, onCloseConfirmList } =
		useModal();

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ConfirmList isOpen={isOpenConfirmList} onClose={onCloseConfirmList} />
			<ModalOverlay />
			<ModalContent
				borderRadius="3xl"
				bgColor={theme.bg.blueNavy}
				px="1"
				py="2"
			>
				<ModalHeader display="flex" alignItems="center" gap="3">
					<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
						<MdArrowBack size={24} />
					</Flex>
					<Text fontSize="lg" fontWeight="semibold">
						Manage Lists
					</Text>
				</ModalHeader>
				<ModalBody>
					<Text fontSize="sm" fontWeight="semibold">
						Add a List
					</Text>
					<Flex flexDirection="row" alignItems="baseline" gap="4" mt="3">
						<Input
							borderRadius="full"
							borderColor="rgba(21, 61, 111, 1)"
							_placeholder={{ color: theme.text.cyan, opacity: "0.6" }}
							placeholder="https:// or ipfs://"
							h="max-content"
							py="1"
							px="6"
						/>
						<Button
							py="2"
							px="6"
							h="max-content"
							borderRadius="67px"
							bgColor={theme.bg.button.connectWalletSwap}
							color={theme.text.cyan}
							fontSize="sm"
							fontWeight="semibold"
							onClick={onOpenConfirmList}
						>
							Add
						</Button>
					</Flex>
					<Flex
						flexDirection="row"
						mt="4"
						justifyContent="space-between"
						alignItems="center"
					>
						<Flex gap="4" alignItems="center">
							<Img src="icons/syscoin-logo.png" w="5" h="5" />
							<Flex flexDirection="column">
								<Text fontWeight="semibold">Pegasys Default</Text>
								<Text>raw.githubuserconten...</Text>
							</Flex>
						</Flex>
						<Flex gap="4" pr="6">
							<Icon as={MdOutlineKeyboardArrowDown} w="5" h="5" />
							<Switch size="md" colorScheme="cyan" />
						</Flex>
					</Flex>
					<Flex
						flexDirection="row"
						mt="4"
						justifyContent="space-between"
						alignItems="center"
					>
						<Flex gap="4" alignItems="center">
							<Img src="icons/syscoin-logo.png" w="5" h="5" />
							<Flex flexDirection="column">
								<Text fontWeight="semibold">Pegasys Default</Text>
								<Text>raw.githubuserconten...</Text>
							</Flex>
						</Flex>
						<Flex gap="4" pr="6">
							<Icon as={MdOutlineKeyboardArrowDown} w="5" h="5" />
							<Switch size="md" colorScheme="cyan" />
						</Flex>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
