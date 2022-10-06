import {
	ToastPositionWithLogical,
	useToast,
	UseToastOptions,
	Flex,
	Text,
	AlertStatus,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { usePicasso } from "hooks";
import { IoMdClose, IoIosInformationCircle } from "react-icons/io";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { AiFillExclamationCircle } from "react-icons/ai";

const useToasty = () => {
	const [state, setState] = useState({} as UseToastOptions);
	const toast = useToast();
	const theme = usePicasso();

	const toastStatus = useMemo(() => {
		switch (state.status) {
			case "success":
				return "#38A169";

			case "error":
				return "#E53E3E";

			case "warning":
				return "yellow";

			case "info":
				return "#2B6CB0";

			default:
				return "white";
		}
	}, [state.status]);

	const toastIcon = useMemo(() => {
		switch (state.status) {
			case "success":
				return (
					<Flex pt="0.12rem">
						<RiCheckboxCircleFill color={toastStatus} size={19} />
					</Flex>
				);

			case "error":
				return (
					<Flex pt="0.12">
						<AiFillExclamationCircle color={toastStatus} size={18} />
					</Flex>
				);

			case "warning":
				return (
					<Flex pt="0.12">
						<AiFillExclamationCircle color={toastStatus} size={18} />
					</Flex>
				);

			case "info":
				return (
					<Flex pt="0.12">
						<IoIosInformationCircle color={toastStatus} size={20} />
					</Flex>
				);

			default:
				return <Flex />;
		}
	}, [state.status]);

	useEffect(() => {
		if (!state || !(Object.keys(state).length !== 0)) return;

		if (!toast.isActive(`${state?.id}`)) {
			toast({
				...state,
				id: `${state?.id}`,
				duration: 5000,
				position: `${
					(state?.position as ToastPositionWithLogical) || "top-right"
				}`,
				isClosable: true,
				status: `${state?.status as AlertStatus}`,
				title: `${state?.title as React.ReactNode}`,
				description: `${state?.description as React.ReactNode}`,

				render: ({ onClose }) => (
					<Flex
						h="fit-content"
						w="356px"
						mt="50px"
						mr="40px"
						p={3}
						bg={theme.bg.blackAlpha}
						borderRadius="0.2rem"
						borderLeftWidth="0.25rem"
						borderLeftColor={toastStatus}
						justifyContent="space-between"
					>
						<Flex
							w="100%"
							color={theme.text.mono}
							flexDirection="row"
							zIndex="docked"
							px="0.3rem"
							py="0.15rem"
						>
							{toastIcon}
							<Flex w="100%" flexDirection="column" ml="0.8rem">
								<Text font-weight="bold">{`${state?.title}`}</Text>
								<Text
									w="100%"
									fontSize="sm"
									fontWeight="normal"
									flexWrap="wrap"
								>
									{state.description}
								</Text>
							</Flex>
						</Flex>
						<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
							<IoMdClose size={16} color={theme.text.mono} />
						</Flex>
					</Flex>
				),
			});
		}
	}, [state]);

	return { toastState: state, toast: setState };
};

export { useToasty };
