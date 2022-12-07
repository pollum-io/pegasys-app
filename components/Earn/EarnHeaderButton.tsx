import React from "react";
import { Button } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { TButtonId, useEarn } from "pegasys-services";
import { JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";

interface IEarnHeaderButtonProps {
	id: string;
	amount: TokenAmount;
	children: string;
}

const EarnHeaderButton: React.FC<IEarnHeaderButtonProps> = ({
	id,
	amount,
	...props
}) => {
	const theme = usePicasso();
	const { setButtonId, buttonId } = useEarn();

	return (
		<Button
			{...props}
			w="100%"
			h="max-content"
			py="0.7rem"
			px={["4", "0", "0", "0"]}
			borderRadius="full"
			onClick={() => setButtonId(id as TButtonId)}
			bgColor={buttonId === id ? theme.bg.babyBluePurple : "transparent"}
			color={buttonId === id ? theme.text.darkBluePurple : theme.text.lightGray}
			fontWeight="semibold"
			_hover={
				JSBI.lessThanOrEqual(amount.raw, JSBI.BigInt(0))
					? { opacity: "0.3" }
					: { opacity: "0.9" }
			}
			disabled={JSBI.lessThanOrEqual(amount.raw, JSBI.BigInt(0))}
		/>
	);
};

export default EarnHeaderButton;
