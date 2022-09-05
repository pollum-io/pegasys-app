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
import { AiOutlineClose } from "react-icons/ai";

import { RiInformationFill } from "react-icons/ri";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const ConfirmList: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent borderRadius="3xl" bgColor={theme.bg.blueNavyLight}>
				<ModalHeader
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					bgColor={theme.bg.blackAlpha}
					borderTopRadius="3xl"
				>
					<Flex gap="3">
						<Flex>
							<RiInformationFill size={24} color={theme.icon.infoWhiteRed} />
						</Flex>
						<Text
							fontSize="lg"
							fontWeight="semibold"
							color={theme.icon.infoWhiteRed}
						>
							Confirm List
						</Text>
					</Flex>
					<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
						<AiOutlineClose size={22} onClick={onClose} />
					</Flex>
				</ModalHeader>
				<ModalBody py="6" bgColor={theme.bg.blueNavyLight}>
					<Flex gap="5" flexDirection="column">
						<Text>Please be careful when adding custom token lists.</Text>
						<Text>
							Anyone can create fake or scam tokens, so take caution and do your
							research. If you purchase an arbitrary token you may be unable to
							sell it back.
						</Text>
						<Text fontWeight="semibold">
							Are you sure you want to import this token list?
						</Text>
					</Flex>
				</ModalBody>
				<ModalFooter
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					bgColor={theme.bg.blackAlpha}
					borderBottomRadius="3xl"
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
					>
						Add List
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
