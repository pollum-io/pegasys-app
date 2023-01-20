import { Flex, Text } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { useStakeV2 } from "pegasys-services";
import { useCallback, useState } from "react";
import { MdHelpOutline } from "react-icons/md";

import { ICardItemProps } from "./dto";
import { TooltipComponent } from "../../Tooltip/TooltipComponent";

const CardItem: React.FC<ICardItemProps> = ({
	text,
	value,
	usdValue,
	opacity,
	tooltip,
}) => {
	const theme = usePicasso();
	const { showInUsd } = useStakeV2();

	return (
		<Flex
			width={["100%", "100%", "33%", "33%"]}
			justifyContent="center"
			flexDirection="column"
		>
			<Flex
				gap={1}
				width="fit-content"
				height="fit-content"
				alignItems="center"
			>
				<Text
					width="fit-content"
					fontSize="sm"
					color={theme.text.cyanPurple}
					opacity={opacity ? "0.3" : undefined}
				>
					{text}
				</Text>
				{tooltip && <TooltipComponent label={tooltip} icon={MdHelpOutline} />}
			</Flex>
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
