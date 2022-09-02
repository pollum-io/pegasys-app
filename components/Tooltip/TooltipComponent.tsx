import { Flex, Icon, PlacementWithLogical, Tooltip } from "@chakra-ui/react";
import React, { FunctionComponent, useState } from "react";
import { IconType } from "react-icons/lib";
import { usePicasso } from "hooks";

interface ITooltipComponent {
	label: string;
	icon: IconType;
	defaultIsOpen?: boolean;
	placement?: PlacementWithLogical;
	hasArrow?: boolean;
}

export const TooltipComponent: FunctionComponent<ITooltipComponent> = props => {
	const {
		label,
		icon,
		placement = "right",
		hasArrow = true,
		defaultIsOpen = false,
	} = props;

	const theme = usePicasso();
	const [isLabelOpen, setIsLabelOpen] = useState(false);

	return (
		<Tooltip
			defaultIsOpen={defaultIsOpen}
			isOpen={isLabelOpen}
			filter="drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.1)) drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.06))"
			color={theme.text.mono}
			bgColor={theme.bg.secondary}
			hasArrow={hasArrow}
			label={label}
			shouldWrapChildren
			placement={placement}
			alignItems="center"
		>
			<Icon
				as={icon}
				color={theme.icon.helpIcon}
				onMouseEnter={() => setIsLabelOpen(true)}
				onMouseLeave={() => setIsLabelOpen(false)}
				onClick={() => setIsLabelOpen(true)}
			/>
		</Tooltip>
	);
};
