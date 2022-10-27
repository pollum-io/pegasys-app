import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { Flex } from "@chakra-ui/react";
import { JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";

import { BIG_INT_ZERO } from "pegasys-services";
import { EarnButton } from "../../Earn";
import { IButtonsProps } from "./dto";

const Buttons: React.FC<IButtonsProps> = ({
	stakedAmount,
	unstakedAmount,
	unclaimedAmount,
	tokenA,
	tokenB,
	onClick,
}) => {
	const router = useRouter();

	const buttons: Array<[TokenAmount, string, string]> = useMemo(
		() => [
			[stakedAmount, "Withdraw", "withdraw"],
			[unstakedAmount, "Deposit", "deposit"],
		],
		[stakedAmount, unstakedAmount]
	);

	const getLpToken: boolean = useMemo(
		() =>
			JSBI.greaterThanOrEqual(BIG_INT_ZERO, stakedAmount.raw) &&
			JSBI.greaterThanOrEqual(BIG_INT_ZERO, unstakedAmount.raw) &&
			JSBI.greaterThanOrEqual(BIG_INT_ZERO, unclaimedAmount.raw),
		[stakedAmount, unstakedAmount, unclaimedAmount]
	);

	const btnProps = {
		py: "0.625rem",
		height: "max-content",
		px: "1.5rem",
	};

	if (getLpToken) {
		return (
			<EarnButton {...btnProps} mt="1rem" onClick={() => router.push("pools")}>
				{`Add ${tokenA.symbol}-${tokenB?.symbol} Liquidity`}
			</EarnButton>
		);
	}

	return (
		<Flex alignItems="center" flexDirection="column" width="100%">
			<Flex gap="2" py="1">
				{buttons.map(([amount, text, id]) => (
					<EarnButton
						{...btnProps}
						key={text}
						id={id}
						onClick={onClick}
						amount={amount}
						solid
					>
						{text}
					</EarnButton>
				))}
			</Flex>
			<EarnButton
				{...btnProps}
				id="claim"
				mt="1rem"
				onClick={onClick}
				amount={unclaimedAmount}
			>
				Claim
			</EarnButton>
		</Flex>
	);
};

export default Buttons;
