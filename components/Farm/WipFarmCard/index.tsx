import React from "react";
import { Token } from "@pollum-io/pegasys-sdk";

import { useModal } from "hooks";
import { Card } from "components";
import { useEarn, TButtonId } from "pegasys-services";

import Header from "./Header";
import Body from "./Body";
import Buttons from "./Button";
import { IFarmCardsProps } from "./dto";

const FarmCard: React.FC<IFarmCardsProps> = ({ stakeInfo }) => {
	const { setSelectedOpportunity, setButtonId } = useEarn();
	const { onOpenFarmActions } = useModal();

	const onClick = (id: string) => {
		setButtonId(id as TButtonId);
		setSelectedOpportunity(stakeInfo);
		onOpenFarmActions();
	};

	return (
		<Card width="xs" px="6" pb="6" mb="4">
			<Header
				tokenA={stakeInfo.tokenA}
				tokenB={stakeInfo.tokenB as Token}
				extraToken={stakeInfo.extraRewardToken}
			/>
			<Body
				swapFeeApr={stakeInfo.swapFeeApr}
				combinedApr={stakeInfo.combinedApr}
				superFarmApr={stakeInfo.farmApr}
				totalStakedInUsd={stakeInfo.totalStakedInUsd}
				rewardRatePerWeek={stakeInfo.rewardRatePerWeek}
				stakedInUsd={stakeInfo.stakedInUsd}
				unclaimedAmount={stakeInfo.unclaimedAmount}
				symbol={stakeInfo.rewardToken.symbol ?? ""}
			/>
			<Buttons
				unclaimedAmount={stakeInfo.unclaimedAmount}
				stakedAmount={stakeInfo.stakedAmount}
				unstakedAmount={stakeInfo.unstakedAmount}
				tokenA={stakeInfo.tokenA}
				tokenB={stakeInfo.tokenB as Token}
				onClick={onClick}
			/>
		</Card>
	);
};

export default FarmCard;
