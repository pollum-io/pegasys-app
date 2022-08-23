import { currencyEquals, NSYS, WSYS } from "@pollum-io/pegasys-sdk";
import { useMemo } from "react";
import { Signer } from "ethers";
import { tryParseAmount, addTransaction, createContractUsingAbi } from "utils";
import {
	WrappedTokenInfo,
	ISwapTokenInputValue,
	IWalletHookInfos,
} from "types";
import { ApprovalState, IApprovalState } from "contexts";
import WETH_ABI from "utils/abis/weth.json";

export enum WrapType {
	NOT_APPLICABLE,
	WRAP,
	UNWRAP,
}

export function UseWrapCallback(
	tradeTokens: WrappedTokenInfo[],
	inputValues: ISwapTokenInputValue,
	walletInfos: IWalletHookInfos,
	setTransaction: React.Dispatch<React.SetStateAction<object>>,
	transactions: object,
	setApprovalState: React.Dispatch<React.SetStateAction<IApprovalState>>,
	signer: Signer
): {
	wrapType: WrapType;
	execute?: undefined | (() => Promise<void>);
	inputError?: string;
} {
	const { chainId } = walletInfos;
	const { typedValue } = inputValues;
	const wethContract =
		chainId && createContractUsingAbi(WSYS[chainId]?.address, WETH_ABI, signer);
	const inputCurrency =
		tradeTokens[0]?.symbol === "SYS" ? NSYS : tradeTokens[0];
	const outputCurrency =
		tradeTokens[1]?.symbol === "SYS" ? NSYS : tradeTokens[1];

	const balance = tradeTokens[0]?.balance;
	// we can always parse the amount typed as the input currency, since wrapping is 1:1
	const inputAmount = useMemo(
		() => tryParseAmount(typedValue, inputCurrency),
		[inputCurrency, typedValue]
	);

	if (!wethContract || !chainId || !inputCurrency || !outputCurrency)
		return WrapType.NOT_APPLICABLE;

	// eslint-disable-next-line
	const sufficientBalance = parseInt(typedValue) <= parseInt(balance);

	if (inputCurrency === NSYS && currencyEquals(WSYS[chainId], outputCurrency)) {
		return {
			wrapType: WrapType.WRAP,
			execute:
				sufficientBalance && inputAmount
					? async () => {
							try {
								const txReceipt = await wethContract.deposit({
									value: `0x${inputAmount.raw.toString(16)}`,
								});
								addTransaction(
									txReceipt,
									walletInfos,
									setTransaction,
									transactions,
									{
										summary: `Wrap ${inputAmount.toSignificant(6)} SYS to WSYS`,
									}
								);
								setApprovalState({
									status: ApprovalState.PENDING,
									type: "wrap",
								});
							} catch (error) {
								console.error("Could not deposit", error);
							}
					  }
					: undefined,
			inputError: sufficientBalance ? undefined : "Insufficient SYS balance",
		};
	}
	if (currencyEquals(WSYS[chainId], inputCurrency) && outputCurrency === NSYS) {
		return {
			wrapType: WrapType.UNWRAP,
			execute:
				sufficientBalance && inputAmount
					? async () => {
							try {
								const txReceipt = await wethContract.withdraw(
									`0x${inputAmount.raw.toString(16)}`
								);
								addTransaction(
									txReceipt,
									walletInfos,
									setTransaction,
									transactions,
									{
										summary: `Unwrap ${inputAmount.toSignificant(
											6
										)} WSYS to SYS`,
									}
								);
								setApprovalState(ApprovalState.PENDING);
							} catch (error) {
								console.error("Could not withdraw", error);
							}
					  }
					: undefined,
			inputError: sufficientBalance ? undefined : "Insufficient WSYSbalance",
		};
	}
	return WrapType.NOT_APPLICABLE;
}
