import React from "react";
import { Flex, Text } from "@chakra-ui/react";

import { usePicasso } from "hooks";

import { IStatusProps } from "./dto";

const Status: React.FC<IStatusProps> = ({ status, date }) => {
	const theme = usePicasso();

	return (
		<Flex
			borderBottomLeftRadius={["xl", "xl", "0", "0"]}
			borderTopRightRadius={["0", "0", "xl", "xl"]}
			borderBottomRightRadius="xl"
			zIndex="99"
			bgColor={theme.bg.neutralGray}
			w={["100%", "100%", "7.125rem", "7.125rem"]}
			h={["25%", "25%", "100%", "100%"]}
			justifyContent="center"
			flexDirection={["row", "row", "column", "column"]}
			_hover={{ cursor: "auto" }}
			alignItems="center"
			py={["1", "0", "0", "0"]}
			px={["0.9rem", "0.9rem", "1rem", "1rem"]}
			gap={["3", "3", "0", "0"]}
		>
			<Text
				fontWeight="bold"
				color={status === "EXECUTED" ? "#68D391" : "#FC8181"}
				fontSize={["0.75rem", "0.813rem", "0.813rem", "0.813rem"]}
			>
				{status}
			</Text>

			<Text
				fontWeight="normal"
				color={theme.text.softGray}
				fontSize={["0.75rem", "0.813rem", "0.813rem", "0.813rem"]}
			>
				{date}
			</Text>
		</Flex>
	);
};

export default Status;
