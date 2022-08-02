import {
	Button,
	Flex,
	Img,
	Text,
	useDisclosure,
	useToast,
	Box,
	createStandaloneToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	StatHelpText,
} from "@chakra-ui/react";
import React, { FunctionComponent } from "react";
import { usePicasso, useToasty } from "hooks";
import { AddLiquidityModal, RemoveLiquidity } from "components/Modals";
import { MdOutlineTaskAlt } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

export const ToastNotification: React.FC = props => {
	const theme = usePicasso();
	const { toast } = useToasty();

	return (
		<Button
			onClick={() =>
				toast({
					position: "top-right",
					render: ({ onClose }) => (
						<Flex
							h="72px"
							w="356px"
							mt="50px"
							mr="40px"
							p={3}
							bg={theme.bg.blackAlpha}
							borderRadius="0.2rem"
							borderLeftWidth="0.25rem"
							borderLeftColor="#38A169"
							justifyContent="space-between"
						>
							<Flex
								color={theme.text.mono}
								flexDirection="row"
								zIndex="docked"
								px="0.3rem"
								py="0.15rem"
							>
								<Flex pt="0.25rem">
									<BsCheckCircleFill color="#38A169" size={16} />
								</Flex>
								<Flex flexDirection="column" ml="0.8rem">
									<Text font-weight="bold">Title</Text>
									<Text fontSize="sm" font-weight="normal">
										Something Happend!
									</Text>
								</Flex>
							</Flex>
							<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
								<IoMdClose size={16} color={theme.text.mono} />
							</Flex>
						</Flex>
					),
				})
			}
		>
			Show Toast
		</Button>
	);
};
