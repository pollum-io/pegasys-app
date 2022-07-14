import {
	Button,
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
import { usePicasso, useWallet } from "hooks";
import { FunctionComponent } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	psysValue?: string;
	psysBalance?: string;
	psysUnclaimed?: string;
	psysPriceSys?: string;
	totalSuply?: string;
}

export const PsysBreakdown: FunctionComponent<IModal> = props => {
	const {
		isOpen,
		onClose,
		psysValue,
		psysBalance,
		psysUnclaimed,
		psysPriceSys,
		totalSuply,
	} = props;
	const theme = usePicasso();

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent borderRadius={18} my="40" w="xs" h="md">
				<ModalHeader
					borderTopRadius={18}
					bgRepeat="no-repeat"
					w="100%"
					p="8"
					bgImage="linear-gradient(to bottom, transparent 0%, rgba(11, 23, 44, 1) 99%), url('images/backgrounds/PsysReward.png')"
				>
					<Flex
						flexDirection="row"
						alignItems="baseline"
						justifyContent="space-between"
					>
						<Text textAlign="left" w="60%" fontSize="2xl">
							Your PSYS Breakdown
						</Text>
						<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
							<AiOutlineClose size={22} />
						</Flex>
					</Flex>
				</ModalHeader>
				<ModalBody bgColor={theme.bg.blueNavy}>
					<Flex alignItems="center" justifyContent="center">
						<Img
							src="icons/pegasys.png"
							w="8"
							h="8"
							filter="drop-shadow(0px 4px 7px rgba(0, 217, 239, 0.25))"
						/>
						<Text fontSize="2xl" fontWeight="semibold" ml="2">
							{psysValue}
						</Text>
					</Flex>
					<Flex flexDirection="column" gap="4" mt="8">
						<Flex
							alignItems="center"
							justifyContent="space-between"
							flexDirection="row"
						>
							<Text fontSize="sm" fontWeight="semibold">
								Balance:
							</Text>
							<Text fontSize="sm">{psysBalance}</Text>
						</Flex>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							flexDirection="row"
						>
							<Text fontSize="sm" fontWeight="semibold">
								Unclaimed:
							</Text>
							<Text fontSize="sm">{psysUnclaimed}</Text>
						</Flex>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							flexDirection="row"
						>
							<Text fontSize="sm" fontWeight="semibold">
								PSYS price:
							</Text>
							<Text fontSize="sm">{psysPriceSys} SYS</Text>
						</Flex>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							flexDirection="row"
						>
							<Text fontSize="sm" fontWeight="semibold">
								Total Supply:
							</Text>
							<Text fontSize="sm">{totalSuply}</Text>
						</Flex>
					</Flex>
				</ModalBody>
				<ModalFooter bgColor={theme.bg.blueNavy} justifyContent="flex-start">
					<Button
						w="100%"
						py="2"
						px="6"
						borderRadius="67px"
						bgColor={theme.bg.button.connectWalletSwap}
						color={theme.text.cyan}
						fontSize="sm"
						fontWeight="semibold"
					>
						Add PSYS to MetaMask
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
