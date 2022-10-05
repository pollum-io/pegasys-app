import {
	Flex,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import { FunctionComponent } from "react";
import { SwitchToSyscoin } from "components/Buttons";
import { IoIosInformationCircle } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const SelectSyscoin: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const { walletError } = useWallet();
	const theme = usePicasso();

	return (
		<Modal blockScrollOnMount isOpen={isOpen || walletError} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="3xl"
				my="40"
				p="1.5rem"
				bgColor={theme.bg.blueNavyLight}
				color={theme.text.mono}
			>
				<Flex alignItems="center" justifyContent="space-between">
					<Text fontSize="lg" fontWeight="semibold">
						Wrong Network
					</Text>
					<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
						<MdOutlineClose
							size={22}
							onClick={onClose}
							color={theme.icon.whiteDarkGray}
						/>
					</Flex>
				</Flex>
				<Flex py="1.5rem">
					<IoIosInformationCircle size={26} color={theme.icon.whiteRed} />
					<Text fontSize="md" fontWeight="normal" pl="1.125rem">
						Please connect to the appropriate Syscoin network.
					</Text>
				</Flex>
				<SwitchToSyscoin />
			</ModalContent>
		</Modal>
	);
};
