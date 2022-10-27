import React from "react";
import { Flex } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { CardProps } from "./dto";

const Card: React.FC<CardProps> = props => {
	const theme = usePicasso();

	return (
		<Flex
			gap="8"
			zIndex="1"
			borderRadius="2xl"
			flexDirection="column"
			border="1px solid transparent"
			background={`linear-gradient(${theme.bg.blueNavy}, ${theme.bg.blueNavy}) padding-box, linear-gradient(312.16deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			{...props}
		/>
	);
};

export default Card;
