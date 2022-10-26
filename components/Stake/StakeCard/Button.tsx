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
	symbol,
	onClick,
}) => {
	const router = useRouter();

	const buttons: Array<[TokenAmount, string, string]> = useMemo(
		() => [
			[stakedAmount, "Unstake", "withdraw"],
			[unstakedAmount, "Stake", "deposit"],
		],
		[stakedAmount, unstakedAmount]
	);

	const getStakeToken: boolean = useMemo(
		() =>
			JSBI.greaterThanOrEqual(BIG_INT_ZERO, stakedAmount.raw) &&
			JSBI.greaterThanOrEqual(BIG_INT_ZERO, unstakedAmount.raw) &&
			JSBI.greaterThanOrEqual(BIG_INT_ZERO, unclaimedAmount.raw),
		[stakedAmount, unstakedAmount, unclaimedAmount]
	);

	const btnProps = {
		py: ["0.2rem", "0.2rem", "1", "1"],
		px: "0.75rem",
		width: ["6.5rem", "8rem", "11.5rem", "11.5rem"],
	};

	return (
		<Flex gap={["2", "2", "6", "6"]} mb="6" height="2.2rem">
			{getStakeToken ? (
				<EarnButton {...btnProps} onClick={() => router.push("/farms")} solid>
					{`Get ${symbol}`}
				</EarnButton>
			) : (
				buttons.map(([amount, text, id], index) => (
					<EarnButton
						{...btnProps}
						key={text}
						id={id}
						onClick={onClick}
						amount={amount}
						solid={!!index}
					>
						{text}
					</EarnButton>
				))
			)}
		</Flex>
	);
};

export default Buttons;
