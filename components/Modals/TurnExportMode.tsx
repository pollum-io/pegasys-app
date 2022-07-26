import {
	Button,
	Flex,
	Icon,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

import { RiInformationFill } from "react-icons/ri";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const TurnExportMode: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				mt="10rem"
				borderRadius="3xl"
				bgColor={theme.bg.blueNavy}
				border="1px solid transparent;"
				background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					backgroundColor={theme.bg.whiteGray}
					borderTopRadius="3xl"
					alignItems="baseline"
				>
					<Flex
						flexDirection="row"
						justifyContent="space-between"
						alignItems="center"
					>
						<Flex gap="2" alignItems="center">
							<Icon as={RiInformationFill} w="6" h="6" />
							<Text fontSize="lg" fontWeight="semibold">
								Are you sure?
							</Text>
						</Flex>
						<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
							<AiOutlineClose size={20} />
						</Flex>
					</Flex>
				</ModalHeader>
				<ModalBody>
					<Flex flexDirection="column" gap="4">
						<Text lineHeight="base">
							Please note that export mode turns off the confirm transaction
							prompt and allows high slippage trades that often result in bad
							rates and lost funds.
						</Text>
						<Text>Only use this mode if you know what you are doing.</Text>
					</Flex>
				</ModalBody>
				<ModalFooter
					backgroundColor={theme.bg.whiteGray}
					borderBottomRadius="3xl"
					justifyContent="space-between"
					alignItems="center"
					flexDirection="row"
					mt="5"
				>
					<Button
						w="100%"
						py="2"
						px="2"
						borderRadius="67px"
						bgColor={theme.text.red500}
						color={theme.text.mono}
						fontWeight="semibold"
					>
						Turn on Expert Mode
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
