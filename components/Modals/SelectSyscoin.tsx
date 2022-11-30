import {
	Flex,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { SwitchToSyscoin } from "components/Buttons";
import { IoIosInformationCircle } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const SelectSyscoin: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { t: translation } = useTranslation();
	const { colorMode } = useColorMode();

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderTopRadius="30px"
				borderBottomRadius={["none", "30px", "30px", "30px"]}
				mt={["0", "8rem", "8rem", "8rem"]}
				p="1.5rem"
				mb={["0", "unset", "unset", "unset"]}
				bottom={["0", "unset", "unset", "unset"]}
				position={["absolute", "relative", "relative", "relative"]}
				borderTop={
					colorMode === "dark"
						? ["1px solid transparent", "none", "none", "none"]
						: ["none", "none", "none", "none"]
				}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(270.16deg, rgba(24,54,61, 0.8) 90.76%, rgba(24,54,61, 0) 97.76%) border-box`}
				color={theme.text.mono}
				w={["100vw", "376px", "376px", "376px"]}
				boxShadow={
					colorMode === "dark"
						? "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4)"
						: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
				}
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
				<SwitchToSyscoin mb={["3rem", "0", "0", "0"]} />
			</ModalContent>
		</Modal>
	);
};
