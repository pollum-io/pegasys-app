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
				mt="10rem"
				borderRadius="3xl"
				bgColor={theme.bg.blueNavy}
				pt="0"
				pb="6"
				px="6"
				border="1px solid transparent"
				background={
					colorMode === "dark"
						? `linear-gradient(${theme.bg.blackAlpha}, ${theme.bg.blackAlpha}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`
						: undefined
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
					gap="3"
					color={theme.text.mono}
				>
					<Img src="icons/loading.gif" w="35%" h="35%" className="blob" />
					<Flex flexDirection="row" alignItems="baseline" gap="1">
						<Text fontSize="2xl" fontWeight="semibold">
							{translation("transactionConfirmation.waitingConfirmation")}
						</Text>
						<Text className="loading" />
					</Flex>
					<Text>
						{translation("transactionConfirmation.confirmTransaction")}
					</Text>
				</Flex>
			</ModalContent>
		</Modal>
	);
};
