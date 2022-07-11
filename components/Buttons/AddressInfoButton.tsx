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
import { usePicasso, useWallet, useToasty } from "hooks";
import { FunctionComponent } from "react";
import Jazzicon from "react-jazzicon";
import { MdContentCopy, MdOutlineCallMade } from "react-icons/md";
import { shortAddress, copyToClipboard, openWalletOnExplorer } from "utils";
import { AiOutlineClose } from "react-icons/ai";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const AddressInfoButton: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { walletAddress, connectorSelected } = useWallet();
	const { toast } = useToasty();

	const handleCopyToClipboard = () => {
		copyToClipboard(walletAddress);

		toast({
			status: "success",
			title: "Successfully copied",
			description: "Address sucessfully copied to clipboard!",
		});
	};

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent borderRadius={18} my="40">
				<ModalHeader bgColor={theme.bg.blueNavy} borderTopRadius={18}>
					<Flex alignItems="center" justifyContent="space-between">
						<Text fontSize="lg" fontWeight="semibold">
							Account
						</Text>
						<Flex _hover={{ cursor: "pointer" }}>
							<AiOutlineClose size={22} onClick={onClose} />
						</Flex>
					</Flex>
				</ModalHeader>
				<ModalBody bgColor={theme.bg.blueNavy} pb="6">
					<Flex
						borderRadius={18}
						bgColor={theme.bg.blackAlpha}
						py="4"
						px="4"
						flexDirection="column"
					>
						<Flex
							justifyContent="space-between"
							flexDirection="row"
							align="center"
						>
							<Flex>
								<Text
									fontSize="md"
									fontWeight="semibold"
									color={theme.text.cyan}
								>
									Connected with
								</Text>
							</Flex>
							<Flex>
								<Button
									borderRadius="full"
									border="1px solid"
									borderColor={theme.text.cyan}
									px="2"
									py="0.5"
									w="max-content"
									h="max-content"
									color={theme.text.gray300}
									fontSize="sm"
									fontWeight="bold"
									alignItems="center"
									bgColor="transparent"
								>
									CHANGE
								</Button>
							</Flex>
						</Flex>
						<Flex
							mt="2"
							fontSize="md"
							fontWeight="semibold"
							textTransform="uppercase"
						>
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
								color={theme.text.gray}
								flexDirection="row"
								alignItems="center"
								cursor="pointer"
								onClick={() => handleCopyToClipboard()}
								mr="4"
							>
								<Icon as={MdContentCopy} />
								<Text
									_hover={{ textDecoration: "underline" }}
									color={theme.text.gray300}
									fontSize="sm"
									fontWeight="normal"
									pl="1"
								>
									Copy Address
								</Text>
							</Flex>
							<Flex
								color={theme.text.gray300}
								flexDirection="row"
								alignItems="center"
								cursor="pointer"
								onClick={() => openWalletOnExplorer(walletAddress)}
							>
								<Icon as={MdOutlineCallMade} />
								<Text
									_hover={{ textDecoration: "underline" }}
									fontSize="sm"
									fontWeight="normal"
									pl="1"
								>
									View on the Explorer
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</ModalBody>
				<ModalFooter bgColor={theme.bg.blackAlpha} justifyContent="flex-start">
					<Text fontSize="sm" fontWeight="semibold">
						Your transactions will appear here...
					</Text>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
