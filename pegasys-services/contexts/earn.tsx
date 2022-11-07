import React, { useEffect, createContext, useState, useMemo } from "react";
import { ChainId, JSBI } from "@pollum-io/pegasys-sdk";

import { tryParseAmount, addTransaction } from "utils";
import { useModal } from "hooks";
import {
	ApprovalState,
	IEarnProviderProps,
	IEarnProviderValue,
	IEarnInfo,
	TContract,
	TSignature,
	TButtonId,
} from "../dto";

import { BIG_INT_ZERO } from "../constants";
import {
	useWallet as psUseWallet,
	useToasty,
	usePegasys,
	useTransaction,
} from "../hooks";
import { WalletFramework } from "../frameworks";
import { onlyNumbers } from "../utils";

export const EarnContext = createContext({} as IEarnProviderValue);

export const EarnProvider: React.FC<IEarnProviderProps> = ({ children }) => {
	const [earnOpportunities, setEarnOpportunities] = useState<IEarnInfo[]>([]);
	const [withdrawTypedValue, setWithdrawTypedValue] = useState<string>("");
	const [depositTypedValue, setDepositTypedValue] = useState<string>("");
	const [signature, setSignature] = useState<TSignature>(null);
	const [signatureLoading, setSignatureLoading] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [dataLoading, setDataLoading] = useState<boolean>(false);
	const [buttonId, setButtonId] = useState<TButtonId>(null);
	const [selectedOpportunity, setSelectedOpportunity] =
		useState<IEarnInfo | null>(null);

	const { setTransactions, transactions, setCurrentTxHash, setApprovalState } =
		useTransaction();
	const { onCloseStakeActions, onCloseFarmActions } = useModal();

	const { chainId, address, provider } = psUseWallet();
	const { userTransactionDeadlineValue } = usePegasys();
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
						parsedAmount,
						selectedOpportunity.unstakedAmount.raw
					)) ||
					(!isDeposit &&
						JSBI.greaterThan(
							parsedAmount,
							selectedOpportunity.stakedAmount.raw
						))
					? JSBI.BigInt(101)
					: (isDeposit &&
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
				chainId: ChainId.NEVM,
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
				title: `Error on ${summary}`,
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

	const withdrawValues = useMemo(() => {
		const value = getTypedValue();

		if (!value) {
			return { percentage: 0, typed: BIG_INT_ZERO };
		}

		return { percentage: value.percentage, typed: value.value };
	}, [
		selectedOpportunity,
		selectedOpportunity?.stakedAmount,
		withdrawTypedValue,
	]);

	const depositValues = useMemo(() => {
		const value = getTypedValue(true);

		if (!value) {
			return { percentage: 0, typed: BIG_INT_ZERO };
		}

		return { percentage: value.percentage, typed: value.value };
	}, [
		selectedOpportunity,
		selectedOpportunity?.stakedAmount,
		depositTypedValue,
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
			withdrawPercentage: withdrawValues.percentage,
			reset,
			signatureLoading,
			loading,
			setLoading,
			onContractCall,
			depositPercentage: depositValues.percentage,
			depositValue: depositValues.typed,
			withdrawValue: withdrawValues.typed,
			dataLoading,
			setDataLoading,
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
			withdrawValues,
			reset,
			signatureLoading,
			loading,
			setLoading,
			onContractCall,
			depositValues,
			dataLoading,
			setDataLoading,
		]
	);

	return (
		<EarnContext.Provider value={providerValue}>
			{children}
		</EarnContext.Provider>
	);
};
