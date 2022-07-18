import { Trade } from "@pollum-io/pegasys-sdk";

import { ISwapTokenInputValue, IWalletHookInfos } from "types";
import { tryParseAmount } from "utils";

import { useTradeExactIn, useTradeExactOut } from "./useTrade";

export function useDerivedSwapInfo(
	inputs: ISwapTokenInputValue,
	walletInfos: IWalletHookInfos
): {
	parsedAmount: any;
	v2Trade: Trade | any;
	// currencies: { [ input in string ]?: Currency }
	// parsedAmount: any,
	// inputError?: string
} {
	const isExactIn: boolean = inputs.lastInputTyped === 0;

	const parsedAmount = tryParseAmount(
		inputs.typedValue,
		(isExactIn ? inputs.inputFrom.token : inputs.inputTo.token) ?? undefined
	);

	const bestTradeExactIn = useTradeExactIn(
		isExactIn ? parsedAmount : undefined,
		inputs.inputTo.token ?? undefined,
		walletInfos
	);
	const bestTradeExactOut = useTradeExactOut(
		inputs.inputFrom.token ?? undefined,
		!isExactIn ? parsedAmount : undefined,
		walletInfos
	);

	const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

	return {
		parsedAmount,
		v2Trade: v2Trade ?? undefined,
	};
}
