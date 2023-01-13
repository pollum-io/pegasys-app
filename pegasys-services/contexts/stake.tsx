import React, { useEffect, createContext, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { ContractFramework, RoutesFramework } from "../frameworks";
import { StakeServices } from "../services";
import { useWallet, useEarn, useTransaction, useToasty } from "../hooks";
import { IEarnInfo, IStakeProviderProps, IStakeProviderValue } from "../dto";

export const StakeContext = createContext({} as IStakeProviderValue);

const Provider: React.FC<IStakeProviderProps> = ({ children }) => {
	const [stakeV1Opportunities, setStakeV1Opportunities] = useState<IEarnInfo[]>(
		[]
	);
	const { chainId, address } = useWallet();
	const { pendingTxs } = useTransaction();
	const { toast } = useToasty();
	const { t: translation } = useTranslation();
	const {
		signature,
		onSign,
		getTypedValue,
		selectedOpportunity,
		withdrawPercentage,
		onContractCall,
		setDataLoading,
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
		try {
			setDataLoading(true);
			if (address && chainId && RoutesFramework.getStakeAddress(chainId)) {
				const stakeInfos = await StakeServices.getStakeOpportunities({
					stakeContract,
					chainId,
					walletAddress: address,
				});

				setStakeV1Opportunities(stakeInfos);
			} else {
				setStakeV1Opportunities([]);
			}
		} catch (e) {
			toast({
				id: "toast",
				position: "top-right",
				status: "error",
				title: translation("toasts.errorStake"),
			});
		} finally {
			setDataLoading(false);
		}
	};

	const stakePendingClaim = useMemo(() => {
		if (!chainId) return [];

		return [...pendingTxs.filter(tx => tx.service === "claim-stake")];
	}, [pendingTxs, chainId]);

	const stakePendingDeposit = useMemo(() => {
		if (!chainId) return [];

		return [...pendingTxs.filter(tx => tx.service === "stake-stake")];
	}, [pendingTxs, chainId]);

	const stakePendingWithdraw = useMemo(() => {
		if (!chainId) return [];

		return [...pendingTxs.filter(tx => tx.service === "unstake-stake")];
	}, [pendingTxs, chainId]);

	useEffect(() => {
		getStakes();
	}, [
		address,
		chainId,
		stakePendingClaim.length,
		stakePendingDeposit.length,
		stakePendingWithdraw.length,
	]);

	const providerValue = useMemo(
		() => ({
			claim,
			sign,
			stake,
			unstake,
			stakeV1Opportunities,
		}),
		[sign, claim, stake, unstake, stakeV1Opportunities]
	);

	return (
		<StakeContext.Provider value={providerValue}>
			{children}
		</StakeContext.Provider>
	);
};

export const StakeProvider: React.FC<IStakeProviderProps> = props => (
	<Provider {...props} />
);
