import React from "react";
import { Button } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";

interface IEarnButtonProps {
	id?: string;
	solid?: boolean;
	onClick: (id: string) => void;
	children: string;
	height?: string | string[];
	width: string | string[];
	px?: string;
	py?: string | string[];
	amount?: TokenAmount;
	mt?: string;
	ml?: string;
	my?: string;
	mb?: string;
	fontSize?: "xs";
	disabled?: boolean;
}

const EarnButton: React.FC<IEarnButtonProps> = ({
	solid,
	onClick,
	amount,
	fontSize,
	...props
}) => {
	const theme = usePicasso();
	if (amount && JSBI.lessThanOrEqual(amount.raw, JSBI.BigInt(0))) {
		return null;
	}

	return (
		<Button
			{...props}
			fontSize={fontSize ?? "sm"}
			fontWeight="semibold"
			borderRadius="full"
			bgColor={solid ? theme.bg.blueNavyLightness : "transparent"}
			color={solid ? theme.text.cyan : theme.text.whitePurple}
			border={solid ? undefined : "1px solid"}
			borderColor={solid ? undefined : theme.text.cyanPurple}
			_hover={
				solid
					? {
							opacity: "1",
							bgColor: theme.bg.bluePurple,
					  }
					: {
							borderColor: theme.text.cyanLightPurple,
							color: theme.text.cyanLightPurple,
					  }
			}
			_active={{}}
			onClick={event => onClick(event.currentTarget.id)}
		/>
	);
};

export default EarnButton;
