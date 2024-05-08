import { useColorMode } from "@chakra-ui/react";
import React from "react";

import { Card } from "components";
import { useModal } from "hooks";
import { IEarnInfo, TButtonId, useEarn } from "pegasys-services";

import Body from "./Body";
import Buttons from "./Button";
import Header from "./Header";
import { IStakeCardsProps } from "./dto";

const StakeCard: React.FC<IStakeCardsProps> = props => {
	const { stakeInfo, v1 } = props;

	const { onOpenStakeActions, onOpenStakeV2Actions } = useModal();

	const { colorMode } = useColorMode();
	const { setSelectedOpportunity, setButtonId } = useEarn();

	const onClick = (id: string) => {
		setButtonId(id as TButtonId);
		setSelectedOpportunity((stakeInfo as IEarnInfo | undefined) ?? null);

		if (v1) {
			onOpenStakeActions();
		} else {
			onOpenStakeV2Actions();
		}
	};

	if (!stakeInfo) {
		return null;
	}

	return (
		<Card
			width={["20rem", "xs", "2xl", "2xl"]}
			alignItems="center"
			borderRadius="2xl"
			boxShadow={
				colorMode === "light"
					? "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05);"
					: "none"
			}
		>
			<Header
				symbol={stakeInfo.stakeToken.symbol ?? ""}
				stakedAmount={stakeInfo.stakedAmount}
				onClick={onClick}
			/>
			<Body
				symbol={stakeInfo.stakeToken.symbol ?? ""}
				apr="0"
				totalStakedInUsd={stakeInfo.totalStakedInUsd}
				totalStakedAmount={stakeInfo.totalStakedAmount}
				// eslint-disable-next-line
				// @ts-ignore
				rewardRatePerWeekInUsd={stakeInfo.rewardRatePerWeekInUsd}
				rewardRatePerWeek={stakeInfo.rewardRatePerWeek}
				stakedInUsd={stakeInfo.stakedInUsd}
				stakedAmount={stakeInfo.stakedAmount}
				unclaimedInUsd={stakeInfo.unclaimedInUsd}
				unclaimedAmount={stakeInfo.unclaimedAmount}
				// eslint-disable-next-line
				// @ts-ignore
				depositFee={stakeInfo.depositFee}
				// eslint-disable-next-line
				// @ts-ignore
				isPeriodFinish={stakeInfo.isPeriodFinished}
			/>
			<Buttons
				unstakedAmount={stakeInfo.unstakedAmount}
				stakedAmount={stakeInfo.stakedAmount}
				unclaimedAmount={stakeInfo.unclaimedAmount}
				symbol={stakeInfo.stakeToken.symbol ?? ""}
				onClick={onClick}
				// eslint-disable-next-line
				// @ts-ignore
				isPeriodFinish
			/>
		</Card>
	);
};

export default StakeCard;
