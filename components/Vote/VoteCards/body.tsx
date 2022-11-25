import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { usePicasso } from "hooks";
import { IBodyProps } from "./dto";

const Body: React.FC<IBodyProps> = ({ title, version }) => {
	const theme = usePicasso();

	return (
		<Flex
			gap="3"
			alignItems={["flex-start", "flex-start", "flex-start", "flex-start"]}
			py={["3", "3", "1", "1"]}
		>
			<Text
				color={theme.text.softGray}
				pl="3"
				fontSize={["14.5px", "14.5px", "14.5px", "14.5px"]}
			>
				{version}
			</Text>
			<Text
				color={theme.text.mono}
				fontSize={["14.5px", "14.5px", "14.5px", "14.5px"]}
				pr={["2", "2", "0", "0"]}
			>
				{title}
			</Text>
		</Flex>
	);
};

export default Body;
