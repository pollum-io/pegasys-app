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
import { WrappedTokenInfo } from "types";
import { addTokenToWallet } from "utils";
import { useTranslation } from "react-i18next";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
	psysBalance?: string;
	psysUnclaimed?: string;
	psysPriceSys?: string;
	totalSuply?: string;
	psys?: WrappedTokenInfo;
}

export const PsysBreakdown: FunctionComponent<IModal> = props => {
	const {
		isOpen,
		onClose,
		psysBalance,
		psysUnclaimed,
		psysPriceSys,
		totalSuply,
		psys,
	} = props;

	const theme = usePicasso();
	const { t: translation } = useTranslation();

	const { colorMode } = useColorMode();

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderTopRadius="30px"
				borderBottomRadius={["none", "30px", "30px", "30px"]}
				bgColor="transparent"
				mt={["0", "6rem", "6rem", "6rem"]}
				mb={["0", "unset", "unset", "unset"]}
				w={["100vw", "21.125rem", "21.125rem", "21.125rem"]}
				h="md"
				position={["absolute", "relative", "relative", "relative"]}
				bottom={["0", "unset", "unset", "unset"]}
				boxShadow={
					colorMode === "dark"
						? "0px 0px 0px 1px rgba(0, 0, 0, 0.1)"
						: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
				}
				filter={
					colorMode === "dark"
						? "drop-shadow(0px 5px 10px rgba(0, 0, 0, 0.2)) drop-shadow(0px 15px 40px rgba(0, 0, 0, 0.4))"
						: "none"
				}
			>
				<Flex
					w="100%"
					px="6"
					py="10"
					flexDirection="column"
					zIndex="docked"
					position="relative"
				>
					<Img
						src={theme.bg.psysReward}
						position="absolute"
						zIndex="base"
						w="100%"
						h="100%"
						right="0"
						top="0"
						borderTop="30px"
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
							{translation("header.psysBreakDown")}
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
							w="8"
							h="8"
							filter="drop-shadow(0px 4px 7px rgba(0, 217, 239, 0.25))"
							className="blob"
						/>
						<Text
							fontSize="2xl"
							fontWeight="semibold"
							ml="2"
							color={theme.text.mono}
						>
							{psysBalance} PSYS
						</Text>
					</Flex>
					<Flex flexDirection="column" gap="4" mt="8" color={theme.text.mono}>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							flexDirection="row"
						>
							<Text fontSize="sm" fontWeight="semibold">
								{translation("header.unclaimed")}
							</Text>
							<Text fontSize="sm">{psysUnclaimed} PSYS</Text>
						</Flex>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							flexDirection="row"
						>
							<Text fontSize="sm" fontWeight="semibold">
								{translation("header.psysPrice")}
							</Text>
							<Text fontSize="sm">{psysPriceSys} SYS</Text>
						</Flex>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							flexDirection="row"
						>
							<Text fontSize="sm" fontWeight="semibold">
								{translation("header.totalSupply")}
							</Text>
							<Text fontSize="sm">{totalSuply}</Text>
						</Flex>
					</Flex>
				</ModalBody>
				<ModalFooter
					bgColor={theme.bg.blueNavyLight}
					justifyContent="flex-start"
					pb={["3rem", "6", "6", "6"]}
					borderBottomRadius={["none", "30px", "30px", "30px"]}
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
						onClick={() => addTokenToWallet(psys as WrappedTokenInfo)}
					>
						{translation("header.addMetamask")}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
