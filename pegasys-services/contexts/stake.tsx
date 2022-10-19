import React, { useEffect, createContext, useMemo, useState } from "react";
import { ChainId } from "@pollum-io/pegasys-sdk";

import { PSYS, STAKE_ADDRESS } from "pegasys-services/constants";
import { ContractFramework } from "pegasys-services/frameworks";
import { StakeServices } from "../services";
import { useWallet as psUseWallet, useEarn } from "../hooks";
import { IStakeProviderProps, IStakeProviderValue } from "../dto";
import { EarnProvider } from "./earn";

export const StakeContext = createContext({} as IStakeProviderValue);

const Provider: React.FC<IStakeProviderProps> = ({ children }) => {
	const [showInUsd, setShowInUsd] = useState<boolean>(false);
	const { chainId, address } = psUseWallet();
	const {
		signature,
		onSign,
		getTypedValue,
		selectedOpportunity,
		setEarnOpportunities,
		withdrawPercentage,
		onContractCall,
	} = useEarn();

	const unstake = async () => {
		await onContractCall(
			async () => {
				const typedValue = getTypedValue();

				if (selectedOpportunity && typedValue) {
					let method = StakeServices.unstake;

					if (withdrawPercentage === 100) {
						method = StakeServices.unstakeAndClaim;
					}

					const res = await method(typedValue.value.toString(16));

					return res;
				}

				return undefined;
			},
			"Withdraw deposited liquidity",
			"unstake"
		);
	};

	const claim = async () => {
		await onContractCall(
			async () => {
				if (selectedOpportunity) {
					const res = await StakeServices.claim();
					return res;
				}
				return undefined;
			},
			"Claim accumulated PSYS rewards",
			"claim"
		);
	};

	const stake = async () => {
		await onContractCall(
			async () => {
				const typedValue = getTypedValue(true);

				if (selectedOpportunity && typedValue && signature) {
					const res = await StakeServices.stake(
						typedValue.value.toString(16),
						signature
					);

					return res;
				}

				return undefined;
			},
			"Stake PSYS tokens",
			"stake"
		);
	};

	const sign = async () => {
		if (selectedOpportunity) {
			const contract = ContractFramework.PSYSContract(chainId);

			await onSign(
				contract,
				"Pegasys",
				STAKE_ADDRESS,
				PSYS[chainId as ChainId].address
			);
		}
	};

	useEffect(() => {
		if (address && chainId) {
			const getStakes = async () => {
				const stakeInfos = await StakeServices.getStakeOpportunities(
					address,
					chainId
				);

				setEarnOpportunities(stakeInfos);
			};

			getStakes();
		}
	}, [address, chainId]);

	const providerValue = useMemo(
		() => ({
			claim,
			sign,
			stake,
			unstake,
			showInUsd,
			setShowInUsd,
		}),
		[sign, claim, stake, unstake, showInUsd, setShowInUsd]
	);

	return (
		<StakeContext.Provider value={providerValue}>
			{children}
		</StakeContext.Provider>
	);
};

export const StakeProvider: React.FC<IStakeProviderProps> = props => (
	<EarnProvider>
		<Provider {...props} />
	</EarnProvider>
);
