import {
	Flex,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
	Img,
	useColorMode,
} from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import { WalletOptions } from "components/WalletOptions";
import { MdOutlineClose } from "react-icons/md";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const SelectWallets: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { colorMode } = useColorMode();
	const { connecting, connectorSelected } = useWallet();

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="1.875rem"
				my={["0", "0", "40", "40"]}
				bgColor={theme.bg.blueNavy}
				w={["100vw", "100vw", "50%", "sm"]}
				h="max-content"
				p="6"
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				position={["absolute", "absolute", "unset", "unset"]}
				bottom={["0", "0", "unset", "unset"]}
			>
				{!connecting && (
					<Flex flexDirection="column" justifyContent="center">
						<Flex justifyContent="space-between" align="center" pb="5">
							<Text fontSize={["lg", "lg", "xl", "xl"]} fontWeight="semibold">
								Connect to a Wallet
							</Text>
							<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
								<MdOutlineClose size={23} color={theme.icon.whiteDarkGray} />
							</Flex>
						</Flex>
						<Flex flexDirection="column" pb="5">
							<WalletOptions />
						</Flex>

						<Flex
							flexDirection="column"
							fontSize="sm"
							pb={["3.75rem", "3.75rem", "0", "0"]}
						>
							<Text
								textAlign="center"
								fontWeight="normal"
								color={theme.text.mono}
							>
								New to Syscoin?
							</Text>
							<Text
								textColor={theme.text.cyanPurple}
								fontWeight="semibold"
								textAlign="center"
								_hover={{ cursor: "pointer" }}
							>
								Learn more about setting up a wallet
							</Text>
						</Flex>
					</Flex>
				)}
				{connecting && connectorSelected && (
					<Flex
						flexDirection="column"
						justifyContent="center"
						color={theme.text.mono}
					>
						<Flex justifyContent="flex-end" gap="3" align="center" pb="5">
							<Flex _hover={{ cursor: "pointer" }}>
								<MdOutlineClose
									size={23}
									onClick={onClose}
									color={theme.icon.whiteDarkGray}
								/>
							</Flex>
						</Flex>
						<Flex
							justifyContent="center"
							flexDirection="row"
							pl="2"
							pb="1.5rem"
						>
							<Flex pt="0.4">
								<Flex
									mb="5px"
									className="circleLoading"
									id={
										colorMode === "dark"
											? "walletLoadingDark"
											: "walletLoadingLight"
									}
								/>
							</Flex>
							<Text pb="2" pl="3" fontSize="18px" fontWeight="600">
								Initializing...
							</Text>
						</Flex>
						<Flex justifyContent="center" align="center">
							<Flex
								pt="2"
								py="0"
								bgColor="transparent"
								h="48px"
								justifyContent="space-between"
								w="290px"
								mx="0"
								my="2"
								p="4"
								border="1px solid"
								borderRadius="full"
								fontSize="md"
								borderColor={theme.border.smoothGray}
								fontWeight={500}
								fontFamily="inter"
								alignItems="center"
							>
								<Text>{connectorSelected.name}</Text>
								<Img w="6" h="6" src={`icons/${connectorSelected.iconName}`} />
							</Flex>
						</Flex>
					</Flex>
				)}
			</ModalContent>
		</Modal>
	);
};
