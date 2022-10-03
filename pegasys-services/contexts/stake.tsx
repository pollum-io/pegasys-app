import React, { useEffect, createContext, useState, useMemo } from "react";
import { JSBI, NSYS, Token, TokenAmount } from "@pollum-io/pegasys-sdk";

import { getTokenPairs, tryParseAmount } from "utils";
import { WrappedTokenInfo } from "types";
import { useTokens, useWallet } from "hooks";

import { MINICHEF_ADDRESS } from "pegasys-services/constants";
import { ApprovalState } from "contexts";
import { ContractFramework } from "pegasys-services/frameworks";
import { StakeServices } from "../services";
import { useWallet as psUseWallet } from "../hooks";
import { IStakeProviderProps, IStakeProviderValue, IStakeInfo } from "../dto";

export const StakeContext = createContext({} as IStakeProviderValue);

export const StakeProvider: React.FC<IStakeProviderProps> = ({ children }) => {
	const [unstakeTypedValue, setUnstakeTypedValue] = useState<string>("0");
	const [stakeTypedValue, setStakeTypedValue] = useState<string>("0");
	const [selectedStake, setSelectedStake] = useState<IStakeInfo>();
	const [allStakes, setAllStakes] = useState<IStakeInfo[]>([]);
	const { chainId, address } = psUseWallet();
	const { userTransactionDeadlineValue } = useWallet();

	const stake = async () => {};

	const unstake = async () => {
		await StakeServices.unstake();
	};

	const claim = async () => {
		await StakeServices.claim();
	};

	useEffect(() => {
		if (address && chainId) {
			const getStakes = async () => {
				const stakeInfos = await StakeServices.getStakeInfos(address, chainId);

				setAllStakes(stakeInfos);
			};

			getStakes();
		}
	}, [address, chainId]);

	const providerValue = useMemo(
		() => ({
			unstakeTypedValue,
			setUnstakeTypedValue,
			stakeTypedValue,
			setStakeTypedValue,
			selectedStake,
			setSelectedStake,
			allStakes,
			claim,
			stake,
			unstake,
		}),
		[unstakeTypedValue, stakeTypedValue, selectedStake, allStakes]
	);

	return (
		<StakeContext.Provider value={providerValue}>
			{children}
		</StakeContext.Provider>
	);
};
