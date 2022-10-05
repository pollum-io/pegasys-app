import React, { useEffect, createContext, useState, useMemo } from "react";
import { ChainId, JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";

import { tryParseAmount } from "utils";
import { useWallet } from "hooks";

import { BIG_INT_SECONDS_IN_WEEK, PSYS } from "pegasys-services/constants";
import { onlyNumbers } from "pegasys-services/utils";
import { StakeServices } from "../services";
import { useWallet as psUseWallet } from "../hooks";
import { IStakeProviderProps, IStakeProviderValue, IStakeInfo } from "../dto";

export const StakeContext = createContext({} as IStakeProviderValue);

export const StakeProvider: React.FC<IStakeProviderProps> = ({ children }) => {
	const [unstakeTypedValue, setUnstakeTypedValue] = useState<string>("");
	const [stakeTypedValue, setStakeTypedValue] = useState<string>("");
	const [selectedStake, setSelectedStake] = useState<IStakeInfo>();
	const { chainId, address } = psUseWallet();
	const { userTransactionDeadlineValue } = useWallet();

	const parsedStakeInput = useMemo(
		() => tryParseAmount(stakeTypedValue, PSYS[ChainId.NEVM]),
		[stakeTypedValue]
	);

	const stake = async () => {
		if (selectedStake) {
			const parsedAmount =
				parsedStakeInput &&
				selectedStake.unstakedPsysAmount &&
				JSBI.lessThanOrEqual(
					parsedStakeInput.raw,
					selectedStake.unstakedPsysAmount.raw
				)
					? parsedStakeInput.raw
					: JSBI.BigInt(0);

			const signature = await StakeServices.getSignature({
				address,
				chainId,
				value: parsedAmount.toString(),
				deadline: userTransactionDeadlineValue,
			});

			await StakeServices.stake(parsedAmount.toString(16), signature);
		}
	};

	const unstake = async () => {
		if (selectedStake) {
			const parsedInput = tryParseAmount(unstakeTypedValue, PSYS[ChainId.NEVM]);

			const parsedAmount =
				parsedInput &&
				selectedStake.stakedAmount &&
				JSBI.lessThanOrEqual(parsedInput.raw, selectedStake.stakedAmount.raw)
					? parsedInput.raw
					: JSBI.BigInt(0);

			if (JSBI.equal(parsedAmount, selectedStake.stakedAmount.raw)) {
				await StakeServices.unstakeAndClaim();
			} else {
				await StakeServices.unstake(parsedAmount.toString(16));
			}
		}
	};

	const claim = async () => {
		await StakeServices.claim();
	};

	useEffect(() => {
		if (address && chainId) {
			const getStakes = async () => {
				const stakeInfo = await StakeServices.getStakeInfos(address, chainId);

				setSelectedStake(stakeInfo);
			};

			getStakes();
		}
	}, [address, chainId]);

	const liveRewardWeek = useMemo(
		() =>
			new TokenAmount(
				PSYS[ChainId.NEVM],
				parsedStakeInput &&
				selectedStake &&
				JSBI.greaterThan(selectedStake.totalStakedAmount.raw, JSBI.BigInt(0))
					? JSBI.divide(
							JSBI.multiply(
								JSBI.multiply(
									selectedStake.totalRewardRatePerSecond.raw,
									parsedStakeInput.raw
								),
								BIG_INT_SECONDS_IN_WEEK
							),
							selectedStake.totalStakedAmount.raw
					  )
					: JSBI.BigInt(0)
			),
		[selectedStake, parsedStakeInput]
	);

	const providerValue = useMemo(
		() => ({
			unstakeTypedValue,
			setUnstakeTypedValue: (value: string) => {
				const newVal = onlyNumbers(value);
				setUnstakeTypedValue(newVal);
			},
			stakeTypedValue,
			setStakeTypedValue: (value: string) => {
				const newVal = onlyNumbers(value);
				setStakeTypedValue(newVal);
			},
			selectedStake,
			setSelectedStake,
			claim,
			stake,
			unstake,
			liveRewardWeek,
		}),
		[unstakeTypedValue, stakeTypedValue, selectedStake, liveRewardWeek]
	);

	return (
		<StakeContext.Provider value={providerValue}>
			{children}
		</StakeContext.Provider>
	);
};
