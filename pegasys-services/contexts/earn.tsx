import React, { useEffect, createContext, useState, useMemo } from "react";
import { JSBI } from "@pollum-io/pegasys-sdk";

import { tryParseAmount, addTransaction } from "utils";
import { ApprovalState } from "contexts";
import { useWallet, useModal } from "hooks";

import { BIG_INT_ZERO } from "pegasys-services/constants";
import { useWallet as psUseWallet, useToasty } from "../hooks";
import { WalletFramework } from "../frameworks";
import { onlyNumbers } from "../utils";
import {
	IEarnProviderProps,
	IEarnProviderValue,
	IEarnInfo,
	TContract,
	TSignature,
	TButtonId,
} from "../dto";

export const EarnContext = createContext({} as IEarnProviderValue);

export const EarnProvider: React.FC<IEarnProviderProps> = ({ children }) => {
	const [earnOpportunities, setEarnOpportunities] = useState<IEarnInfo[]>([]);
	const [withdrawTypedValue, setWithdrawTypedValue] = useState<string>("");
	const [depositTypedValue, setDepositTypedValue] = useState<string>("");
	const [signature, setSignature] = useState<TSignature>(null);
	const [signatureLoading, setSignatureLoading] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [buttonId, setButtonId] = useState<TButtonId>(null);
	const [selectedOpportunity, setSelectedOpportunity] =
		useState<IEarnInfo | null>(null);

	const {
		provider,
		userTransactionDeadlineValue,
		setTransactions,
		transactions,
		setCurrentTxHash,
		setApprovalState,
	} = useWallet();
	const { onCloseStakeActions, onCloseFarmActions } = useModal();

	const { chainId, address } = psUseWallet();
	const { toast } = useToasty();

	const reset = () => {
		setWithdrawTypedValue("");
		setDepositTypedValue("");
	};

	const getTypedValue = (isDeposit?: boolean) => {
		if (selectedOpportunity) {
			const parsedInput = tryParseAmount(
				isDeposit ? depositTypedValue : withdrawTypedValue,
				selectedOpportunity.stakeToken
			);

			const parsedAmount =
				parsedInput &&
				JSBI.lessThanOrEqual(
					parsedInput.raw,
					isDeposit
						? selectedOpportunity.unstakedAmount.raw
						: selectedOpportunity.stakedAmount.raw
				)
					? parsedInput.raw
					: JSBI.BigInt(0);

			const percentage = JSBI.toNumber(
				(isDeposit &&
					JSBI.greaterThan(
						selectedOpportunity.unstakedAmount.raw,
						BIG_INT_ZERO
					)) ||
					(!isDeposit &&
						JSBI.greaterThan(
							selectedOpportunity.stakedAmount.raw,
							BIG_INT_ZERO
						))
					? JSBI.divide(
							JSBI.multiply(parsedAmount, JSBI.BigInt(100)),
							isDeposit
								? selectedOpportunity.unstakedAmount.raw
								: selectedOpportunity.stakedAmount.raw
					  )
					: BIG_INT_ZERO
			);

			return {
				percentage,
				value: parsedAmount,
			};
		}

		return undefined;
	};

	const onContractCall = async (
		promise: () => Promise<{ hash: string; response: any } | undefined>,
		summary: string,
		type: string
	) => {
		try {
			setLoading(true);

			const walletInfo = {
				walletAddress: address,
				chainId,
				provider,
			};

			const res = await promise();

			if (res) {
				const { response, hash } = res;

				addTransaction(response, walletInfo, setTransactions, transactions, {
					summary,
					finished: false,
				});
				setCurrentTxHash(hash);

				setApprovalState({
					type,
					status: ApprovalState.PENDING,
				});
			}
		} catch (e) {
			toast({
				id: `${type}Toast`,
				position: "top-right",
				status: "error",
				title: `Error on ${type}`,
				description: `Error on ${summary}`,
			});
		} finally {
			setLoading(false);
			reset();
			onCloseFarmActions();
			onCloseStakeActions();
		}
	};

	const onSign = async (
		contract: TContract,
		name: string,
		spender: string,
		verifyingContract: string,
		version?: string
	) => {
		try {
			setSignatureLoading(true);

			if (selectedOpportunity) {
				const typedValue = getTypedValue(true);

				const s = await WalletFramework.getSignature({
					address,
					chainId,
					userDeadline: userTransactionDeadlineValue,
					contract,
					name,
					spender,
					verifyingContract,
					value: typedValue?.value.toString() ?? "",
					version,
				});

				setSignature(s);
			}
		} finally {
			setSignatureLoading(false);
		}
	};

	useEffect(() => {
		setSignature(null);
	}, [depositTypedValue]);

	const withdrawPercentage = useMemo(() => {
		const value = getTypedValue();

		if (!value) {
			return 0;
		}

		return value.percentage;
	}, [
		selectedOpportunity,
		selectedOpportunity?.stakedAmount,
		withdrawTypedValue,
	]);

	const providerValue = useMemo(
		() => ({
			withdrawTypedValue,
			setWithdrawTypedValue: (value: string) => {
				const newVal = onlyNumbers(value);
				setWithdrawTypedValue(newVal);
			},
			depositTypedValue,
			setDepositTypedValue: (value: string) => {
				const newVal = onlyNumbers(value);
				setDepositTypedValue(newVal);
			},
			buttonId,
			setButtonId,
			signature,
			getTypedValue,
			onSign,
			earnOpportunities,
			setEarnOpportunities,
			selectedOpportunity,
			setSelectedOpportunity,
			withdrawPercentage,
			reset,
			signatureLoading,
			loading,
			setLoading,
			onContractCall,
		}),
		[
			withdrawTypedValue,
			setWithdrawTypedValue,
			depositTypedValue,
			setDepositTypedValue,
			buttonId,
			setButtonId,
			getTypedValue,
			onSign,
			signature,
			earnOpportunities,
			setEarnOpportunities,
			selectedOpportunity,
			setSelectedOpportunity,
			withdrawPercentage,
			reset,
			signatureLoading,
			loading,
			setLoading,
			onContractCall,
		]
	);

	return (
		<EarnContext.Provider value={providerValue}>
			{children}
		</EarnContext.Provider>
	);
};
