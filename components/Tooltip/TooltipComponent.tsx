import { Icon, PlacementWithLogical, Tooltip } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { IconType } from "react-icons/lib";

interface ITooltipComponent {
	label: string;
	icon: IconType;
	placement?: PlacementWithLogical;
	hasArrow?: boolean;
}

export const TooltipComponent: FunctionComponent<ITooltipComponent> = ({
	label,
	icon,
	placement = "right",
	hasArrow = true,
}) => (
	<Tooltip
		hasArrow={hasArrow}
		label={label}
		shouldWrapChildren
		placement={placement}
	>
		<Icon as={icon} />
	</Tooltip>
);
