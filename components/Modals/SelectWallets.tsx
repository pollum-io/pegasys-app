import {
	Flex,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
	Img,
} from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import { WalletOptions } from "components/WalletOptions";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

import { IWalletInfo } from "types/index";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const SelectWallets: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { connecting, connectorSelected } = useWallet();

	return (
		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="1.875rem"
				my={["0", "0", "40", "40"]}
				bgColor={theme.bg.blueNavy}
				w={["100vw", "100vw", "50%", "md"]}
				h="max-content"
				p="8"
				borderTopRadius={["3xl", "3xl", "3xl", "3xl"]}
				borderBottomRadius={["0px", "0", "3xl", "3xl"]}
				position={["absolute", "absolute", "unset", "unset"]}
				bottom={["0", "0", "unset", "unset"]}
			>
				{!connecting && (
					<Flex flexDirection="column" justifyContent="center">
						<Flex justifyContent="space-between" align="center" pb="5">
							<Text fontSize="xl" fontWeight="semibold">
								Connect to a Wallet
							</Text>
							<Flex _hover={{ cursor: "pointer" }}>
								<AiOutlineClose size={22} onClick={onClose} />
							</Flex>
						</Flex>
						<Flex flexDirection="column" pb="5">
							<WalletOptions />
						</Flex>

						<Flex flexDirection="column" fontSize="sm">
							<Text textAlign="center" fontWeight="normal">
								New to Syscoin?
							</Text>
							<Text textColor={theme.text.cyan} fontWeight="semibold">
								Learn more about setting up a wallet
							</Text>
						</Flex>
					</Flex>
				)}
				{connecting && connectorSelected && (
					<Flex flexDirection="column" justifyContent="center">
						<Flex justifyContent="flex-end" gap="3" align="center" pb="5">
							<Flex _hover={{ cursor: "pointer" }}>
								<AiOutlineClose size={22} onClick={onClose} />
							</Flex>
						</Flex>
						<Flex justifyContent="center" flexDirection="row">
							<Flex className="circleLoading" id="walletLoading" />
							<Text pb="2" pl="10" fontSize="20px" fontWeight="600">
								Initializing...
							</Text>
						</Flex>

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
							borderColor={theme.border.wallets}
							fontWeight={500}
							fontFamily="inter"
							alignItems="center"
						>
							<Text>{connectorSelected.name}</Text>
							<Img w="6" h="6" src={`icons/${connectorSelected.iconName}`} />
						</Flex>
					</Flex>
				)}
			</ModalContent>
		</Modal>
	);
};
