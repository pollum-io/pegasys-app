import {
	Button,
	Flex,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import { FunctionComponent } from "react";
import Jazzicon from "react-jazzicon";
import { MdOutlineContentCopy } from "react-icons/md";
import { HiExternalLink } from "react-icons/hi";
import { shortAddress, copyToClipboard, openWalletOnExplorer } from "utils";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const AddressInfoButton: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { walletAddress } = useWallet();

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent borderRadius={18} my="40">
				<ModalHeader bgColor={theme.bg.whiteGray} borderTopRadius={18}>
					<Text fontSize="md" fontWeight={600}>
						Account
					</Text>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody bgColor={theme.bg.whiteGray}>
					<Flex
						borderStyle="solid"
						borderWidth="1px"
						borderRadius={18}
						borderColor={theme.border.borderSettings}
						py="4"
						px="5"
						flexDirection="column"
					>
						<Flex justifyContent="space-between" flexDirection="row">
							<Flex>
								<Text fontSize="sm" fontWeight={500}>
									Connected with MetaMask
								</Text>
							</Flex>
							<Flex>
								<Button
									bgColor={theme.bg.iceGray}
									borderRadius={18}
									px="3"
									py="2"
									w="max-content"
									h="max-content"
									color={theme.text.mono}
									fontSize="sm"
									alignItems="center"
								>
									Change
								</Button>
							</Flex>
						</Flex>
						<Flex mt="2" fontSize="lg" fontWeight={500}>
							<Flex pr="2" alignItems="center">
								<Jazzicon
									diameter={15}
									seed={Math.round(Math.random() * 10000000)}
								/>
							</Flex>
							{walletAddress && shortAddress(walletAddress)}
						</Flex>
						<Flex flexDirection="row" mt="4">
							<Flex
								fontSize="sm"
								color={theme.text.gray}
								pr="4"
								flexDirection="row"
								alignItems="center"
								gap="2"
								cursor="pointer"
								onClick={() => copyToClipboard(walletAddress)}
							>
								<Icon as={MdOutlineContentCopy} />
								<Text _hover={{ textDecoration: "underline" }}>
									Copy Address
								</Text>
							</Flex>
							<Flex
								fontSize="sm"
								color={theme.text.gray}
								flexDirection="row"
								alignItems="center"
								gap="2"
								cursor="pointer"
								onClick={() => openWalletOnExplorer(walletAddress)}
							>
								<Icon as={HiExternalLink} />
								<Text _hover={{ textDecoration: "underline" }}>
									View on the Explorer
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</ModalBody>
				<ModalFooter
					bgColor={theme.bg.iceGray}
					borderRadius={18}
					justifyContent="flex-start"
				>
					<Text>Your transactions will appear here...</Text>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
