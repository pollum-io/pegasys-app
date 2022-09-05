import {
	Flex,
	Img,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const LoadingTransition: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				mt="10rem"
				borderRadius="3xl"
				bgColor={theme.bg.blueNavy}
				p="6"
				border="1px solid transparent"
				background={`linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<Flex
					bgColor="transparent"
					_hover={{ cursor: "pointer" }}
					onClick={onClose}
					p="0"
					justifyContent="flex-end"
					flexDirection="row"
					alignItems="center"
				>
					<AiOutlineClose size={24} />
				</Flex>
				<Flex
					flexDirection="column"
					justifyContent="center"
					align="center"
					gap="3"
					color={theme.text.mono}
				>
					<Img src={theme.icon.pegasysLogo} w="35%" h="35%" />
					<Flex flexDirection="row">
						<Text fontSize="2xl" fontWeight="semibold">
							Waiting for confirmation
						</Text>
						<Text className="loading" />
					</Flex>
					<Text>Confirm this transaction in your wallet</Text>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
