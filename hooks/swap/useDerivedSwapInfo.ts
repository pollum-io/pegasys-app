import { CurrencyAmount, Trade } from "@pollum-io/pegasys-sdk";

import { ISwapTokenInputValue, IWalletHookInfos } from "types";
import { tryParseAmount } from "utils";

import { useTradeExactIn, useTradeExactOut } from "./useTrade";

export async function UseDerivedSwapInfo(
	inputs: ISwapTokenInputValue,
	walletInfos: IWalletHookInfos
): Promise<{
	parsedAmount: CurrencyAmount | undefined;
	v2Trade: Trade | any;
	// currencies: { [ input in string ]?: Currency }
	// parsedAmount: any,
	// inputError?: string
}> {
	const isExactIn: boolean = inputs.lastInputTyped === 0;

	console.log("inputs", inputs);

	const parsedAmount = tryParseAmount(
		inputs.typedValue,
		(isExactIn ? inputs.inputFrom.token : inputs.inputTo.token) ?? undefined
	);

	console.log("parsed amount", parsedAmount);

	const bestTradeExactIn = await useTradeExactIn(
		isExactIn ? parsedAmount : undefined,
		inputs.inputTo.token ?? undefined,
		walletInfos,
		inputs.typedValue
	);
	const bestTradeExactOut = await useTradeExactOut(
		inputs.inputFrom.token ?? undefined,
		!isExactIn ? parsedAmount : undefined,
		walletInfos,
		inputs.typedValue
	);

	const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

	// console.log("trades: ", { bestTradeExactIn, bestTradeExactOut });

	return {
		parsedAmount,
		v2Trade: v2Trade ?? undefined,
	};
}
