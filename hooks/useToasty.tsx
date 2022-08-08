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
		if (state.status === "success") {
			console.log("success");
			return "#38A169";
		}
		if (state.status === "error") {
			console.log("error");
			return "#E53E3E";
		}
		if (state.status === "warning") {
			console.log("warning");
			return "yellow";
		}
		if (state.status === "info") {
			console.log("info");
			return "#2B6CB0";
		}
		return "white";
	}, [state.status]);

	const toastIcon = useMemo(() => {
		if (state.status === "success") {
			return (
				<Flex pt="0.12rem">
					<RiCheckboxCircleFill color={toastStatus} size={19} />
				</Flex>
			);
		}
		if (state.status === "error") {
			return (
				<Flex pt="0.12">
					<AiFillExclamationCircle color={toastStatus} size={18} />
				</Flex>
			);
		}
		if (state.status === "warning") {
			return (
				<Flex pt="0.12">
					<AiFillExclamationCircle color={toastStatus} size={18} />
				</Flex>
			);
		}
		if (state.status === "info") {
			return (
				<Flex pt="0.12">
					<IoIosInformationCircle color={toastStatus} size={20} />
				</Flex>
			);
		}
		return <Flex />;
	}, [state.status]);

	useEffect(() => {
		if (!state || !(Object.keys(state).length !== 0)) return;

		toast({
			...state,
			duration: 5000,
			position: `${
				(state?.position as ToastPositionWithLogical) || "top-right"
			}`,
			isClosable: true,
			status: `${(state?.status as AlertStatus) || ("success" as AlertStatus)}`,
			title: `${state?.title as React.ReactNode}`,
			description: `${state?.description as React.ReactNode}`,

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
					borderLeftColor={toastStatus}
					justifyContent="space-between"
				>
					<Flex
						color={theme.text.mono}
						flexDirection="row"
						zIndex="docked"
						px="0.3rem"
						py="0.15rem"
					>
						{toastIcon}

						<Flex flexDirection="column" ml="0.8rem">
							<Text font-weight="bold">{`${state?.title}`}</Text>
							<Text fontSize="sm" font-weight="normal">
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
	}, [state, toast]);

	return { toastState: state, toast: setState };
};

export { useToasty };
