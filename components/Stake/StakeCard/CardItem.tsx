import { Flex, Text } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { useStake } from "pegasys-services";

import { ICardItemProps } from "./dto";

const CardItem: React.FC<ICardItemProps> = ({
	text,
	value,
	usdValue,
	opacity,
}) => {
	const theme = usePicasso();
	const { showInUsd } = useStake();

	return (
		<Flex
			width={["100%", "100%", "33%", "33%"]}
			justifyContent="center"
			flexDirection="column"
		>
			<Text
				fontSize="sm"
				color={theme.text.cyanPurple}
				opacity={opacity ? "0.3" : undefined}
			>
				{text}
			</Text>
			<Text
				fontWeight="medium"
				fontSize="md"
				color={theme.text.mono}
				opacity={opacity ? "0.3" : undefined}
			>
				{!!usdValue && showInUsd ? usdValue : value}
			</Text>
			<Flex />
		</Flex>
	);
};

export default CardItem;
