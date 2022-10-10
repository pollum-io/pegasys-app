import React, { useEffect, createContext, useState, useMemo } from "react";
import { JSBI } from "@pollum-io/pegasys-sdk";

import { tryParseAmount } from "utils";
import { useWallet } from "hooks";

import { useWallet as psUseWallet } from "../hooks";
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
	const [buttonId, setButtonId] = useState<TButtonId>(null);
	const [selectedOpportunity, setSelectedOpportunity] =
		useState<IEarnInfo | null>(null);

	const { userTransactionDeadlineValue } = useWallet();
	const { chainId, address } = psUseWallet();

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

			const isAllIn = JSBI.equal(
				parsedAmount,
				isDeposit
					? selectedOpportunity.unstakedAmount.raw
					: selectedOpportunity.stakedAmount.raw
			);

			return {
				isAllIn,
				value: parsedAmount,
			};
		}

		return undefined;
	};

	const onSign = async (
		contract: TContract,
		name: string,
		spender: string,
		verifyingContract: string,
		version?: string
	) => {
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
	};

	useEffect(() => {
		setSignature(null);
	}, [depositTypedValue]);

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
		}),
		[
			withdrawTypedValue,
			depositTypedValue,
			buttonId,
			signature,
			earnOpportunities,
			selectedOpportunity,
		]
	);

	return (
		<EarnContext.Provider value={providerValue}>
			{children}
		</EarnContext.Provider>
	);
};
