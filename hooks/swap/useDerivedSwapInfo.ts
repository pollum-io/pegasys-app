import {
	CurrencyAmount,
	Trade,
	JSBI,
	Percent,
	Router,
	TradeType,
} from "@pollum-io/pegasys-sdk";

import { ISwapTokenInputValue, IWalletHookInfos } from "types";
import { tryParseAmount } from "utils";

import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from "helpers/consts";
import { BigNumber } from "@ethersproject/bignumber";
import { useTradeExactIn, useTradeExactOut } from "./useTrade";
import { useTransactionDeadline } from "./useTransactionDeadline";

export async function UseDerivedSwapInfo(
	inputs: ISwapTokenInputValue,
	walletInfos: IWalletHookInfos
): Promise<{
	parsedAmount: CurrencyAmount | undefined;
	v2Trade: Trade | undefined;
}> {
	const isExactIn: boolean = inputs.lastInputTyped === 0;

	const parsedAmount = tryParseAmount(
		inputs.typedValue,
		(isExactIn ? inputs.inputFrom.token : inputs.inputTo.token) ?? undefined
	);

	const bestTradeExactIn = await useTradeExactIn(
		isExactIn ? parsedAmount : undefined,
		inputs.inputTo.token ?? undefined,
		walletInfos
	);
	const bestTradeExactOut = await useTradeExactOut(
		inputs.inputFrom.token ?? undefined,
		!isExactIn ? parsedAmount : undefined,
		walletInfos
	);

	const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

	let deadline = useTransactionDeadline();

	const currentTime = BigNumber.from(new Date().getTime());

	if (deadline && deadline < currentTime.add(10)) {
		deadline = currentTime.add(10);
	}

	const swapMethods = [] as any;

	if (v2Trade?.tradeType === TradeType.EXACT_INPUT) {
		swapMethods.push(
			Router.swapCallParameters(v2Trade, {
				feeOnTransfer: true,
				allowedSlippage: new Percent(
					JSBI.BigInt(INITIAL_ALLOWED_SLIPPAGE),
					BIPS_BASE
				),
				recipient: walletInfos.walletAddress,
				deadline: deadline?.toNumber() as number,
			})
		);
	}

	if (v2Trade) {
		swapMethods.push(
			Router.swapCallParameters(v2Trade as Trade, {
				feeOnTransfer: false,
				allowedSlippage: new Percent(
					JSBI.BigInt(INITIAL_ALLOWED_SLIPPAGE),
					BIPS_BASE
				),
				recipient: walletInfos.walletAddress,
				deadline: deadline?.toNumber() as number,
			})
		);
	}

	return {
		parsedAmount,
		v2Trade: v2Trade ?? undefined,
	};
}
