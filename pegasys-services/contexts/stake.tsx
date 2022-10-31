import React, { useEffect, createContext, useMemo, useState } from "react";

import { ApprovalState, useWallet } from "hooks";
import { PegasysContracts } from "../constants";
import { ContractFramework, RoutesFramework } from "../frameworks";
import { StakeServices } from "../services";
import { useWallet as psUseWallet, useEarn } from "../hooks";
import { IStakeProviderProps, IStakeProviderValue } from "../dto";
import { EarnProvider } from "./earn";

export const StakeContext = createContext({} as IStakeProviderValue);

const Provider: React.FC<IStakeProviderProps> = ({ children }) => {
	const [showInUsd, setShowInUsd] = useState<boolean>(false);
	const { chainId, address } = psUseWallet();
	const { approvalState } = useWallet();
	const {
		signature,
		onSign,
		getTypedValue,
		selectedOpportunity,
		setEarnOpportunities,
		withdrawPercentage,
		onContractCall,
	} = useEarn();

	const stakeContract = useMemo(
		() =>
			ContractFramework.StakeContract({
				chainId,
			}),
		[chainId]
	);

	const unstake = async () => {
		await onContractCall(
			async () => {
				const typedValue = getTypedValue();

				if (selectedOpportunity && typedValue) {
					if (withdrawPercentage === 100) {
						const res = await StakeServices.unstakeAndClaim({ stakeContract });
						return res;
					}

					const res = await StakeServices.unstake({
						stakeContract,
						amount: typedValue.value.toString(16),
					});

					return res;
				}

				return undefined;
			},
			"Withdraw deposited liquidity",
			"unstake-stake"
		);
	};

	const claim = async () => {
		await onContractCall(
			async () => {
				if (selectedOpportunity) {
					const res = await StakeServices.claim({ stakeContract });
					return res;
				}
				return undefined;
			},
			"Claim accumulated PSYS rewards",
			"claim-stake"
		);
	};

	const stake = async () => {
		await onContractCall(
			async () => {
				const typedValue = getTypedValue(true);

				if (selectedOpportunity && typedValue && signature) {
					const res = await StakeServices.stake({
						stakeContract,
						amount: typedValue.value.toString(16),
						signatureData: signature,
					});

					return res;
				}

				return undefined;
			},
			"Stake PSYS tokens",
			"stake-stake"
		);
	};

	const sign = async () => {
		if (selectedOpportunity) {
			const contract = ContractFramework.PSYSContract({ chainId });

			await onSign(
				contract,
				"Pegasys",
				RoutesFramework.getStakeAddress(chainId),
				RoutesFramework.getPsysAddress(chainId)
			);
		}
	};

	const getStakes = async () => {
		if (address && chainId && PegasysContracts[chainId].STAKE_ADDRESS) {
			const stakeInfos = await StakeServices.getStakeOpportunities({
				stakeContract,
				chainId,
				walletAddress: address,
			});

			setEarnOpportunities(stakeInfos);
		}
	};

	useEffect(() => {
		if (
			approvalState.status === ApprovalState.APPROVED &&
			(approvalState.type === "stake-stake" ||
				approvalState.type === "claim-stake" ||
				approvalState.type === "unstake-stake")
		) {
			getStakes();
		}
	}, [approvalState]);

	useEffect(() => {
		getStakes();
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
