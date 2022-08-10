import {
	Button,
	Flex,
	Icon,
	Modal,
	ModalContent,
	ModalHeader,
	Img,
	ModalOverlay,
	Text,
	ModalBody,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import React from "react";
import { MdArrowDownward } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const ConfirmSwap: React.FC<IModal> = props => {
	const { onClose, isOpen } = props;
	const theme = usePicasso();

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="3xl"
				border="1px solid transparent;"
				background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					p="1.5rem"
				>
					<Flex alignItems="center">
						<Text fontSize="lg" fontWeight="medium" textAlign="center">
							Confirm Swap
						</Text>
					</Flex>
					<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
						<AiOutlineClose size={24} />
					</Flex>
				</ModalHeader>
				<ModalBody mb="4">
					<Flex flexDirection="column" alignItems="center" mb="6">
						<Flex flexDirection="row" gap="2">
							<Text>0.312311</Text>
							<Img src="icons/syscoin-logo.png" w="5" h="5" />
							<Text>SYS</Text>
						</Flex>
						<Icon
							as={MdArrowDownward}
							bg="transparent"
							color={theme.text.cyan}
							w="6"
							h="6"
							borderRadius="full"
						/>
						<Flex flexDirection="row" gap="2">
							<Text>0.312311</Text>
							<Img src="icons/syscoin-logo.png" w="5" h="5" />
							<Text>SYS</Text>
						</Flex>
					</Flex>
					<Text fontSize="sm">
						Output is estimated. You will receive at least 17.4592 PSYS or the
						transaction will revert.
					</Text>
				</ModalBody>
				<Flex
					bgColor={theme.bg.whiteGray}
					borderBottomRadius="3xl"
					flexDirection="column"
					p="1.5rem"
				>
					<Flex flexDirection="column" gap="2">
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>Price</Text>
							<Text fontWeight="medium">46.264 PSYS/SYS</Text>
						</Flex>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>Minmum Received</Text>
							<Text fontWeight="medium">6.264 PSYS</Text>
						</Flex>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>Price Impact</Text>
							<Text fontWeight="medium" color={theme.text.green400}>
								0.01%
							</Text>
						</Flex>
						<Flex flexDirection="row" justifyContent="space-between">
							<Text>Liquidity Provider Fee</Text>
							<Text fontWeight="medium">0.005991 SYS</Text>
						</Flex>
					</Flex>
					<Flex>
						<Button
							w="100%"
							mt="1.5rem"
							py="6"
							px="6"
							borderRadius="67px"
							bgColor={theme.bg.button.connectWalletSwap}
							color={theme.text.cyan}
							fontSize="lg"
							fontWeight="semibold"
						>
							Confirm Swap
						</Button>
					</Flex>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
