import {
	Flex,
	Img,
	Modal,
	ModalContent,
	ModalOverlay,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import React from "react";
import { MdOutlineClose } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface IModal {
	isOpen: boolean;
	onClose?: () => void;
}

export const LoadingTransition: React.FC<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const { t: translation } = useTranslation();
	const { colorMode } = useColorMode();

	return (
		<Modal
			blockScrollOnMount={false}
			isOpen={isOpen}
			onClose={() => {
				if (onClose) {
					onClose();
				}
			}}
		>
			<ModalOverlay />
			<ModalContent
				mt={["unset", "10rem", "10rem", "10rem"]}
				borderRadius="3xl"
				borderBottomRadius={["none", "3xl", "3xl", "3xl"]}
				bgColor={theme.bg.blueNavy}
				pt="0"
				pb="6"
				px="6"
				bottom={["0", "unset", "unset", "unset"]}
				m="0"
				border={[
					"none",
					"1px solid transparent",
					"1px solid transparent",
					"1px solid transparent",
				]}
				borderTop="1px solid transparent"
				background={
					colorMode === "dark"
						? `linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`
						: undefined
				}
				position={["absolute", "relative", "relative", "relative"]}
				boxShadow={
					colorMode === "dark"
						? "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4)"
						: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
				}
			>
				{onClose && (
					<Flex
						bgColor="transparent"
						_hover={{ cursor: "pointer" }}
						onClick={onClose}
						pt="0"
						justifyContent="flex-end"
						flexDirection="row"
						alignItems="center"
						position="relative"
						top="8"
						right="2"
					>
						<MdOutlineClose
							size={22}
							onClick={onClose}
							color={theme.text.mono}
						/>
					</Flex>
				)}
				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					gap="4"
					color={theme.text.mono}
				>
					<Img src="icons/loading.gif" w="7rem" h="7rem" className="blob" />
					<Flex
						flexDirection={["column", "row", "row", "row"]}
						alignItems={["center", "baseline", "baseline", "baseline"]}
						gap="1"
					>
						<Text fontSize="2xl" fontWeight="semibold" textAlign="center">
							{translation("transactionConfirmation.waitingConfirmation")}
						</Text>
						<Text className="loading" />
					</Flex>
					<Text textAlign="center">
						{translation("transactionConfirmation.confirmTransaction")}
					</Text>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
