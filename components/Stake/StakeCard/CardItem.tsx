import { GridItem, Text } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { useStake } from "pegasys-services";

import { ICardItemProps } from "./dto";

const CardItem: React.FC<ICardItemProps> = ({ text, value, usdValue }) => {
	const theme = usePicasso();
	const { showInUsd } = useStake();

	return (
		<GridItem flexDirection="column">
			<Text fontSize="sm" color={theme.text.cyanPurple}>
				{text}
			</Text>
			<Text fontWeight="medium" fontSize="md" color={theme.text.mono}>
				{!!usdValue && showInUsd ? usdValue : value}
			</Text>
		</GridItem>
	);
};

export default CardItem;
