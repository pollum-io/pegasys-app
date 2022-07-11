import {
	Flex,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { WalletOptions } from "components/WalletOptions";
import { AiOutlineClose } from "react-icons/ai";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const SelectWallets: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="1.875rem"
				my="40"
				bgColor={theme.bg.blueNavy}
				w="max-content"
				h="max-content"
				p="8"
			>
				<Flex flexDirection="column" justifyContent="center">
					<Flex justifyContent="space-between" align="center" pb="5">
						<Text fontSize="xl" fontWeight="semibold">
							Connect to a Wallet
						</Text>
						<Flex _hover={{ cursor: "pointer" }}>
							<AiOutlineClose size={22} onClick={onClose} />
						</Flex>
					</Flex>
					<Flex flexDirection="column" pb="5">
						<WalletOptions />
					</Flex>
					<Flex flexDirection="column" fontSize="sm	">
						<Text textAlign="center" fontWeight="normal">
							New to Syscoin?{" "}
						</Text>
						<Text textColor={theme.text.cyan} fontWeight="semibold">
							Learn more about setting up a wallet
						</Text>
					</Flex>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
