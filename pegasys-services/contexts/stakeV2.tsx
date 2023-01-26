import React, { useEffect, createContext, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { ContractFramework, RoutesFramework } from "../frameworks";
import { StakeV2Services } from "../services";
import { useWallet, useEarn, useTransaction, useToasty } from "../hooks";
import { IStakeV2ProviderProps, IStakeV2ProviderValue } from "../dto";
import { EarnProvider } from "./earn";
import { StakeProvider } from "./stake";

export const StakeV2Context = createContext({} as IStakeV2ProviderValue);

const Provider: React.FC<IStakeV2ProviderProps> = ({ children }) => {
	const [showInUsd, setShowInUsd] = useState<boolean>(false);
	const { chainId, address } = useWallet();
	const { finishedTxs } = useTransaction();
	const { toast } = useToasty();
	const { t: translation } = useTranslation();
	const {
		getTypedValue,
		selectedOpportunity,
		setEarnOpportunities,
		onContractCall,
		setDataLoading,
		onSign,
		signature,
	} = useEarn();

	const stakeContract = useMemo(
		() =>
			ContractFramework.StakeV2Contract({
				chainId,
			}),
		[chainId]
	);

	const unstake = async () => {
		const typedValue = getTypedValue();
		if (selectedOpportunity && typedValue) {
			await onContractCall(
				async () => {
					const unstakeRes = await StakeV2Services.unstake({
						stakeContract,
						amount: typedValue.value.toString(16),
					});

					return unstakeRes;
				},
				`Withdraw ${typedValue.tokenAmount?.toFixed(5) ?? ""} PSYS tokens`,
				"stakeV2-unstake"
			);
		}
	};

	const claim = async () => {
		await onContractCall(
			async () => {
				if (selectedOpportunity) {
					const res = await StakeV2Services.claim({ stakeContract });
					return res;
				}
				return undefined;
			},
			"Claim accumulated PSYS rewards",
			"stakeV2-claim"
		);
	};

	const stake = async () => {
		const typedValue = getTypedValue(true);

		if (!selectedOpportunity || !typedValue || !signature) return;

		await onContractCall(
			async () => {
				const res = await StakeV2Services.stake({
					stakeContract,
					amount: typedValue.value.toString(16),
					signatureData: signature,
				});

				return res;
			},
			`Stake ${typedValue.tokenAmount?.toFixed(5)} PSYS tokens`,
			"stakeV2-stake"
		);
	};

	const getStakes = async () => {
		try {
			setDataLoading(true);
			if (address && chainId && RoutesFramework.getStakeV2Address(chainId)) {
				const stakeInfos = await StakeV2Services.getStakeOpportunities({
					stakeContract,
					chainId,
					walletAddress: address,
				});

				setEarnOpportunities(stakeInfos);
			} else {
				setEarnOpportunities([]);
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

	const sign = async () => {
		if (!selectedOpportunity) return;

		const contract = ContractFramework.PSYSContract({ chainId });

		await onSign(
			contract,
			"Pegasys",
			RoutesFramework.getStakeV2Address(chainId),
			RoutesFramework.getPsysAddress(chainId)
		);
	};

	const stakeFinishedClaim = useMemo(() => {
		if (!chainId) return [];

		return [...finishedTxs.filter(tx => tx.service === "stakeV2-claim")];
	}, [finishedTxs, chainId]);

	const stakeFinishedDeposit = useMemo(() => {
		if (!chainId) return [];

		return [...finishedTxs.filter(tx => tx.service === "stakeV2-stake")];
	}, [finishedTxs, chainId]);

	const stakeFinishedWithdraw = useMemo(() => {
		if (!chainId) return [];

		return [...finishedTxs.filter(tx => tx.service === "stakeV2-unstake")];
	}, [finishedTxs, chainId]);

	useEffect(() => {
		getStakes();
	}, [
		address,
		chainId,
		stakeFinishedClaim.length,
		stakeFinishedDeposit.length,
		stakeFinishedWithdraw.length,
	]);

	const providerValue = useMemo(
		() => ({
			claim,
			stake,
			unstake,
			showInUsd,
			setShowInUsd,
			sign,
		}),
		[claim, stake, unstake, showInUsd, setShowInUsd, sign]
	);

	return (
		<StakeV2Context.Provider value={providerValue}>
			{children}
		</StakeV2Context.Provider>
	);
};

export const StakeV2Provider: React.FC<IStakeV2ProviderProps> = props => (
	<EarnProvider>
		<StakeProvider>
			<Provider {...props} />
		</StakeProvider>
	</EarnProvider>
);
