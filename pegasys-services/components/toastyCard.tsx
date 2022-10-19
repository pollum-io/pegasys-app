import React, { useMemo } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { IoMdClose, IoIosInformationCircle } from "react-icons/io";
import { AiFillExclamationCircle } from "react-icons/ai";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { IconType } from "react-icons";

import { IToastyCardProps } from "../dto";

const cards: { [k: string]: [string, IconType, number] } = {
	success: ["#38A169", RiCheckboxCircleFill, 19],
	error: ["#E53E3E", AiFillExclamationCircle, 18],
	warning: ["yellow", AiFillExclamationCircle, 18],
	info: ["#2B6CB0", IoIosInformationCircle, 20],
};

const ToastyCard: React.FC<IToastyCardProps> = ({
	bg,
	text,
	state,
	onClose,
}) => {
	const toastData = useMemo(() => {
		const card = cards[state.status ?? "info"];

		const color = card[0];
		const Icon = card[1];

		return {
			color,
			icon: <Icon color={color} size={card[2]} />,
		};
	}, [state.status]);

	return (
		<Flex
			h="72px"
			w="356px"
			mt="50px"
			mr="40px"
			p={3}
			bg={bg}
			borderRadius="0.2rem"
			borderLeftWidth="0.25rem"
			borderLeftColor={toastData.color}
			justifyContent="space-between"
		>
			<Flex
				color={text}
				flexDirection="row"
				zIndex="docked"
				px="0.3rem"
				py="0.15rem"
			>
				{toastData.icon}

				<Flex flexDirection="column" ml="0.8rem">
					<Text font-weight="bold"> {`${state?.title}`}</Text>
					<Text fontSize="sm" font-weight="normal">
						{state.description}
					</Text>
				</Flex>
				<Flex _hover={{ cursor: "pointer" }} onClick={onClose}>
					<IoMdClose size={16} color={text} />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default ToastyCard;
