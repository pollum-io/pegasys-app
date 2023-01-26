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
	isPeriodFinish,
}) => {
	const router = useRouter();
	const { t } = useTranslation();

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
		<Flex
			gap={["4", "4", "6", "6"]}
			mb="6"
			height="2.2rem"
			w={["85%", "85%", "60%", "60%"]}
			justifyContent="space-around"
		>
			{getStakeToken ? (
				<EarnButton {...btnProps} onClick={() => router.push("/")} solid>
					{`${t("earnPages.get")} ${symbol}`}
				</EarnButton>
			) : (
				<>
					<EarnButton
						{...btnProps}
						id="withdraw"
						onClick={onClick}
						amount={stakedAmount}
						width={["100%", "100%", "100%", ""]}
					>
						{t("earnPages.unstake")}
					</EarnButton>
					<EarnButton
						{...btnProps}
						id="deposit"
						onClick={onClick}
						amount={unstakedAmount}
						solid
						width={["50%", "50%", "50%", ""]}
						disabled={isPeriodFinish}
					>
						{t("earnPages.stake")}
					</EarnButton>
				</>
			)}
		</Flex>
	);
};

export default Buttons;
