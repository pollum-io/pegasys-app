import {
	Flex,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { SwitchToSyscoin } from "components/Buttons";
import { IoIosInformationCircle } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { useWallet } from "pegasys-services";
import { useTranslation } from "react-i18next";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const SelectSyscoin: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const { walletError } = useWallet();
	const theme = usePicasso();
	const { t: translation } = useTranslation();

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
						{translation("walletModal.wrongNetwork")}
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
						{translation("walletModal.pleaseConnectSyscoin")}
					</Text>
				</Flex>
				<SwitchToSyscoin />
			</ModalContent>
		</Modal>
	);
};
