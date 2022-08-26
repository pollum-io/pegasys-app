import { Icon, PlacementWithLogical, Theme, Tooltip } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { IconType } from "react-icons/lib";
import { usePicasso } from "hooks";

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
		color="white"
		bgColor="#171923"
		hasArrow={hasArrow}
		label={label}
		shouldWrapChildren
		placement={placement}
	>
		<Icon as={icon} />
	</Tooltip>
);
