import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { MdOutlineClose } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { RiInformationFill } from "react-icons/ri";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	handleAddList: () => void;
}

export const ConfirmList: React.FC<IModal> = props => {
	const { isOpen, onClose, handleAddList } = props;
	const theme = usePicasso();
	const { t: translation } = useTranslation();
	const { colorMode } = useColorMode();

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="30px"
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(270.16deg, rgba(24,54,61, 0.8) 90.76%, rgba(24,54,61, 0) 97.76%) border-box`}
				mb={["0", "5rem", "5rem", "5rem"]}
				bottom={["0", "unset", "unset", "unset"]}
				position={["absolute", "relative", "relative", "relative"]}
				borderBottomRadius={["0", "30px", "30px", "30px"]}
				borderTop={
					colorMode === "dark"
						? ["1px solid transparent", "none", "none", "none"]
						: ["none", "none", "none", "none"]
				}
			>
				<ModalHeader
					pt="1.3rem"
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					bgColor={theme.bg.blackAlpha}
					borderTopRadius="30px"
				>
					<Flex gap="3">
						<Flex>
							<RiInformationFill size={24} color={theme.icon.whiteRed} />
						</Flex>
						<Text
							fontSize="lg"
							fontWeight="semibold"
							color={theme.icon.whiteRed}
						>
							{translation("searchModal.confirmList")}
						</Text>
					</Flex>
					<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
						<MdOutlineClose
							size={24}
							onClick={onClose}
							color={theme.icon.whiteDarkGray}
						/>
					</Flex>
				</ModalHeader>
				<ModalBody py="6" bgColor={theme.bg.blueNavyLight}>
					<Flex gap="5" flexDirection="column" textAlign="justify">
						<Text>{translation("searchModal.beCareful")}</Text>
						<Text>{translation("searchModal.anyoneCan")}</Text>
						<Text fontWeight="semibold">
							{translation("searchModal.areYouSure")}
						</Text>
					</Flex>
				</ModalBody>
				<ModalFooter
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					bgColor={theme.bg.blackAlpha}
					borderBottomRadius={["0", "30px", "30px", "30px"]}
				>
					<Button
						py="3"
						px="6"
						my="2"
						w="100%"
						h="max-content"
						borderRadius="67px"
						bgColor={theme.bg.blueNavyLightness}
						color={theme.text.cyan}
						fontSize="md"
						fontWeight="semibold"
						_hover={{
							bgColor: theme.bg.bluePurple,
						}}
						onClick={() => handleAddList()}
					>
						Add List
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
