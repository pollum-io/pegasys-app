import {
	Button,
	Flex,
	Img,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { MdOutlineClose } from "react-icons/md";

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

	const { colorMode } = useColorMode();

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderTopRadius="3xl"
				borderBottomRadius={["none", "none", "3xl", "3xl"]}
				bgColor="transparent"
				my={["0", "0", "40", "40"]}
				w={["100vw", "100vw", "21.125", "21.125rem"]}
				h="md"
				position={["absolute", "absolute", "unset", "unset"]}
				bottom={["0.8rem", "2.9rem", "", ""]}
			>
				<Flex
					w="100%"
					px="6"
					py="10"
					flexDirection="column"
					zIndex="docked"
					position="relative"
					bgColor="transparent"
				>
					<Img
						src={theme.bg.psysReward}
						position="absolute"
						zIndex="base"
						w="100%"
						h="100%"
						right="0"
						top="0"
					/>
					<Flex
						flexDirection="row"
						alignItems="baseline"
						justifyContent="space-between"
						zIndex="docked"
					>
						<Text
							textAlign="left"
							w="60%"
							fontSize="2xl"
							fontWeight="500"
							color="white"
						>
							Your PSYS Breakdown
						</Text>
						<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
							<MdOutlineClose size={23} onClick={onClose} color="white" />
						</Flex>
					</Flex>
				</Flex>
				<ModalBody bgColor={theme.bg.blueNavyLight}>
					<Flex alignItems="center" justifyContent="center">
						<Img
							src={
								colorMode === "dark"
									? "icons/loading.gif"
									: "icons/lightLoading.gif"
							}
							w="10"
							h="10"
							filter="drop-shadow(0px 4px 7px rgba(0, 217, 239, 0.25))"
							className="blob"
						/>
						<Text
							fontSize="2xl"
							fontWeight="semibold"
							ml="2"
							color={theme.text.mono}
						>
							{psysValue}
						</Text>
					</Flex>
					<Flex flexDirection="column" gap="4" mt="8" color={theme.text.mono}>
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
				<ModalFooter
					bgColor={theme.bg.blueNavyLight}
					justifyContent="flex-start"
					pb={["2rem", "2rem", "6", "6"]}
					mt={["2", "10", "0", "0"]}
					borderBottomRadius={["none", "none", "3xl", "2xl"]}
				>
					<Button
						w="100%"
						py="2"
						px="6"
						borderRadius="67px"
						bgColor={theme.bg.blueNavyLightness}
						color={theme.text.cyan}
						fontSize="sm"
						fontWeight="semibold"
						_hover={{
							bgColor: theme.bg.bluePurple,
						}}
					>
						Add PSYS to MetaMask
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
