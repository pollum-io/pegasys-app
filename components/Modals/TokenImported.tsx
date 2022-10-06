import {
	Button,
	Checkbox,
	Flex,
	Icon,
	Img,
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
import {
	MdContentCopy,
	MdOutlineCallMade,
	MdOutlineClose,
} from "react-icons/md";
import { RiInformationFill } from "react-icons/ri";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const TokenImported: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				mt="10rem"
				borderRadius="3xl"
				bgColor={theme.bg.blueNavyLight}
				border="1px solid transparent"
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<ModalHeader
					bgColor={theme.bg.blackAlpha}
					borderTopRadius="3xl"
					alignItems="baseline"
				>
					<Flex
						flexDirection="row"
						justifyContent="space-between"
						alignItems="center"
					>
						<Flex>
							<RiInformationFill size={24} color={theme.icon.whiteRed} />
						</Flex>
						<Text
							fontSize="lg"
							fontWeight="semibold"
							color={theme.icon.whiteRed}
						>
							Token Imported
						</Text>
						<Button
							bgColor="transparent"
							_hover={{ cursor: "pointer" }}
							onClick={onClose}
							p="0"
						>
							<MdOutlineClose
								size={22}
								onClick={onClose}
								color={theme.icon.whiteDarkGray}
							/>
						</Button>
					</Flex>
				</ModalHeader>
				<ModalBody>
					<Flex flexDirection="column" gap="4" color={theme.text.mono}>
						<Text>This token is not on the active token list(s).</Text>
						<Text lineHeight="base">
							Pegasys can load arbitrary tokens by token addresses. Please be
							aware that anyone can create fake or scam tokens, so take caution
							and do your research. If you purchase an arbitrary token you may
							be unable to sell it back.
						</Text>
						<Text>Are you sure you want to import this token?</Text>
					</Flex>
					<Flex
						flexDirection="row"
						bg="rgba(255, 255, 255, 0.04)"
						p="4"
						my="6"
						justifyContent="space-between"
						borderRadius="2xl"
					>
						<Flex flexDirection="column" gap="4">
							<Flex gap="2">
								<Img src="icons/pegasys.png" w="6" h="6" />
								<Text fontWeight="semibold">PSYS</Text>
							</Flex>
							<Flex
								gap="2"
								_hover={{ cursor: "pointer", textDecoration: "underline" }}
							>
								<Icon as={MdContentCopy} w="5" h="5" />
								<Text fontSize="sm">Copy Address</Text>
							</Flex>
						</Flex>
						<Flex
							alignItems="flex-end"
							gap="2"
							_hover={{ cursor: "pointer", textDecoration: "underline" }}
						>
							<Icon as={MdOutlineCallMade} w="5" h="5" />
							<Text fontSize="sm">View on the Explorer</Text>
						</Flex>
					</Flex>
				</ModalBody>
				<ModalFooter
					backgroundColor={theme.bg.blackAlpha}
					borderBottomRadius="3xl"
					justifyContent="space-between"
					alignItems="center"
					flexDirection="row"
				>
					<Flex>
						<Checkbox fontSize="sm" fontWeight="semibold">
							I Understand
						</Checkbox>
					</Flex>
					<Button
						w="40%"
						py="2"
						px="2"
						borderRadius="full"
						bgColor={theme.bg.blueNavyLightness}
						color={theme.text.cyan}
						fontWeight="semibold"
					>
						Continue
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
