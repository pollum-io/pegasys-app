import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { Flex } from "@chakra-ui/react";
import { JSBI } from "@pollum-io/pegasys-sdk";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();

	// const buttons: Array<[TokenAmount, string, string]> = useMemo(
	// 	() => [
	// 		[stakedAmount, t("earnPages.unstake"), "withdraw"],
	// 		[unstakedAmount, t("earnPages.stake"), "deposit"],
	// 	],
	// 	[stakedAmount, unstakedAmount]
	// );

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
					{`${t("earnPages.get")} ${symbol}`}
				</EarnButton>
			) : (
				<>
					<EarnButton
						{...btnProps}
						id="withdraw"
						onClick={onClick}
						amount={stakedAmount}
					>
						{t("earnPages.unstake")}
					</EarnButton>
					<EarnButton
						{...btnProps}
						id="deposit"
						onClick={onClick}
						amount={unstakedAmount}
						solid
					>
						{t("earnPages.stake")}
					</EarnButton>
				</>
				// buttons.map(([amount, text, id], index) => (
				// 	<EarnButton
				// 		{...btnProps}
				// 		key={text}
				// 		id={id}
				// 		onClick={onClick}
				// 		amount={amount}
				// 		solid={!!index}
				// 	>
				// 		{text}
				// 	</EarnButton>
				// ))
			)}
		</Flex>
	);
};

export default Buttons;
