import React, { useEffect, createContext, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { TokenAmount } from "@pollum-io/pegasys-sdk";
import {
	ContractFramework,
	PersistentFramework,
	RoutesFramework,
} from "../frameworks";
import { StakeV2Services } from "../services";
import { useWallet, useEarn, useTransaction, useToasty } from "../hooks";
import {
	IEarnInfo,
	IStakeV2ProviderProps,
	IStakeV2ProviderValue,
} from "../dto";
import { EarnProvider } from "./earn";
import { StakeProvider } from "./stake";

export const StakeV2Context = createContext({} as IStakeV2ProviderValue);

const Provider: React.FC<IStakeV2ProviderProps> = ({ children }) => {
	const [stakeV2Opportunities, setStakeV2Opportunities] = useState<IEarnInfo[]>(
		[]
	);
	const [showInUsd, setShowInUsd] = useState<boolean>(false);
	const [approveHash, setApproveHash] = useState<string>("");
	const [approved, setApproved] = useState<boolean>(false);
	const { chainId, address } = useWallet();
	const { pendingTxs, finishedTxs } = useTransaction();
	const { toast } = useToasty();
	const { t: translation } = useTranslation();
	const {
		getTypedValue,
		selectedOpportunity,
		// setEarnOpportunities,
		withdrawPercentage,
		onContractCall,
		setDataLoading,
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
					let claimRes:
						| {
								hash: string;
								response: any;
						  }
						| undefined;

					const unstakeRes = await StakeV2Services.unstake({
						stakeContract,
						amount: typedValue.value.toString(16),
					});

					if (withdrawPercentage === 100) {
						claimRes = await StakeV2Services.claim({
							stakeContract,
						});
					}

					return claimRes ? [unstakeRes, claimRes] : unstakeRes;
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

		if (selectedOpportunity && typedValue) {
			await onContractCall(
				async () => {
					const res = await StakeV2Services.stake({
						stakeContract,
						amount: typedValue.value.toString(16),
					});

					return res;
				},
				`Stake ${typedValue.tokenAmount?.toFixed(5)} PSYS tokens`,
				"stakeV2-stake"
			);
		}
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

				// setEarnOpportunities(stakeInfos);
				setStakeV2Opportunities(stakeInfos);
			} else {
				// setEarnOpportunities([]);
				setStakeV2Opportunities([]);
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

	const approve = async () => {
		if (approved) return;

		const typedValue = getTypedValue(true);

		if (!selectedOpportunity || !typedValue?.tokenAmount) return;

		await onContractCall(
			async () => {
				const res = await StakeV2Services.approve({
					amountToApprove: typedValue.tokenAmount as TokenAmount,
					chainId,
				});

				setApproveHash(res?.hash ?? "");

				return res;
			},
			`Approve stake tokens`,
			"stakeV2-approve"
		);
	};

	const stakePendingClaim = useMemo(() => {
		if (!chainId) return [];

		return [...pendingTxs.filter(tx => tx.service === "stakeV2-claim")];
	}, [pendingTxs, chainId]);

	const stakePendingDeposit = useMemo(() => {
		if (!chainId) return [];

		return [...pendingTxs.filter(tx => tx.service === "stakeV2-stake")];
	}, [pendingTxs, chainId]);

	const stakePendingWithdraw = useMemo(() => {
		if (!chainId) return [];

		return [...pendingTxs.filter(tx => tx.service === "stakeV2-unstake")];
	}, [pendingTxs, chainId]);

	const stakeFinishedApprove = useMemo(() => {
		if (!chainId) return [];

		return [...finishedTxs.filter(tx => tx.service === "stakeV2-approve")];
	}, [finishedTxs, chainId]);

	useEffect(() => {
		getStakes();
	}, [
		address,
		chainId,
		stakePendingClaim.length,
		stakePendingDeposit.length,
		stakePendingWithdraw.length,
	]);

	useEffect(() => {
		const persist = PersistentFramework.get("stakeV2Approve") as {
			[k: string]: boolean;
		};

		if (persist && persist.approved) setApproved(persist.approved);
	}, []);

	useEffect(() => {
		const tx = stakeFinishedApprove.find(
			approveTx => approveTx.hash === approveHash
		);

		if (tx?.success) {
			setApproved(true);
			PersistentFramework.add("stakeV2Approve", { approved: true });
		} else {
			setApproved(false);
			PersistentFramework.add("stakeV2Approve", { approved: false });
		}
	}, [stakeFinishedApprove]);

	const providerValue = useMemo(
		() => ({
			claim,
			stake,
			unstake,
			showInUsd,
			setShowInUsd,
			stakeV2Opportunities,
			approve,
			isApproved: approved,
		}),
		[
			claim,
			stake,
			unstake,
			showInUsd,
			setShowInUsd,
			stakeV2Opportunities,
			approve,
			approved,
		]
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
