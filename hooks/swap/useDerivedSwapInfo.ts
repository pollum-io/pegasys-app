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
}> {
	const isExactIn: boolean = inputs.lastInputTyped === 0;

	const parsedAmount = tryParseAmount(
		inputs.typedValue,
		(isExactIn ? inputs.inputFrom.token : inputs.inputTo.token) ?? undefined
	);

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

	return {
		parsedAmount,
		v2Trade: v2Trade ?? undefined,
	};
}
