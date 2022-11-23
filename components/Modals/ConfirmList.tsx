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

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="3xl"
				bgColor="transparent"
				m={["0", "0", "10", "10"]}
				bottom={["0", "0", "unset", "unset"]}
				position={["absolute", "absolute", "relative", "relative"]}
				borderBottomRadius={["0", "0", "3xl", "3xl"]}
				border={["none", "1px solid transparent"]}
				borderTop="1px solid transparent"
			>
				<ModalHeader
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					bgColor={theme.bg.blackAlpha}
					borderTopRadius="3xl"
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
					borderBottomRadius={["0", "0", "3xl", "3xl"]}
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
