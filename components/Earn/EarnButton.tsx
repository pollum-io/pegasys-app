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
	width?: string | string[];
	px?: string;
	py?: string | string[];
	amount?: TokenAmount;
	mt?: string;
	ml?: string;
	my?: string;
	mb?: string | string[];
	fontSize?: string | number;
	disabled?: boolean;
	display?: string[];
}

const EarnButton: React.FC<IEarnButtonProps> = ({
	solid,
	onClick,
	amount,
	fontSize,
	width,
	height,
	...props
}) => {
	const theme = usePicasso();
	if (amount && JSBI.lessThanOrEqual(amount.raw, JSBI.BigInt(0))) {
		return null;
	}

	return (
		<Button
			width={width ?? "100%"}
			height={height ?? "100%"}
			fontSize={
				fontSize
					? typeof fontSize === "string"
						? fontSize
						: `${fontSize}px`
					: "sm"
			}
			fontWeight="semibold"
			borderRadius="full"
			bgColor={solid ? theme.bg.blueNavyLightness : "transparent"}
			color={solid ? theme.text.cyan : theme.text.whitePurple}
			border={solid ? undefined : "1px solid"}
			borderColor={solid ? undefined : theme.text.cyanPurple}
			_hover={
				props.disabled
					? { opacity: "0.3" }
					: solid
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
			{...props}
		/>
	);
};

export default EarnButton;
