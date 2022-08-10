import {
	CurrencyAmount,
	Trade,
	ChainId,
	FACTORY_ADDRESS,
} from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { ROUTER_ADDRESS } from "helpers/consts";
import { TFunction } from "react-i18next";

import {
	ISwapTokenInputValue,
	IWalletHookInfos,
	WrappedTokenInfo,
	ISwapCall,
} from "types";
import {
	computeSlippageAdjustedAmounts,
	isAddress,
	tryParseAmount,
	Field,
} from "utils";
import { involvesAddress } from "utils/involvesAddress";

import { UseBestSwapMethod } from "./useBestSwapMethod";
import { useTradeExactIn, useTradeExactOut } from "./useTrade";

const BAD_RECIPIENT_ADDRESSES: string[] = [
	FACTORY_ADDRESS[ChainId.NEVM], // v2 factory
	ROUTER_ADDRESS[ChainId.NEVM], // v2 router 02
];

export async function UseDerivedSwapInfo(
	tradeTokens: WrappedTokenInfo[],
	inputValues: ISwapTokenInputValue,
	walletInfos: IWalletHookInfos,
	translation: TFunction<"translation", undefined>,
	userAllowedSlippage: number,
	signer: Signer,
	recipient?: string
): Promise<{
	parsedAmount: CurrencyAmount | undefined;
	v2Trade: Trade | undefined;
	bestSwapMethods: ISwapCall[];
	inputErrors: string | undefined;
}> {
	const isExactIn: boolean = inputValues.lastInputTyped === 0;

	const recipientAddress: string | undefined =
		recipient && isAddress(recipient as string);
	const to: string | null =
		(recipientAddress || walletInfos.walletAddress) ?? null;
	const formattedTo = isAddress(to) ?? null;

	const currencyBalances: { [field in Field]?: CurrencyAmount } = {
		[Field.INPUT]: tryParseAmount(
			tradeTokens[0]?.balance,
			tradeTokens[0]
		) as CurrencyAmount,
		[Field.OUTPUT]: tryParseAmount(
			tradeTokens[1]?.balance,
			tradeTokens[1]
		) as CurrencyAmount,
	};

	const parsedAmount = tryParseAmount(
		inputValues.typedValue,
		(isExactIn ? tradeTokens[0] : tradeTokens[1]) ?? undefined
	);

	const bestTradeExactIn = await useTradeExactIn(
		isExactIn ? parsedAmount : undefined,
		tradeTokens[1] ?? undefined,
		walletInfos
	);
	const bestTradeExactOut = await useTradeExactOut(
		tradeTokens[0] ?? undefined,
		!isExactIn ? parsedAmount : undefined,
		walletInfos
	);

	const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

	let inputError: string | undefined;

	if (!parsedAmount) {
		inputError = inputError ?? translation("swapHooks.enterAmount");
	}

	if (!to || !formattedTo) {
		inputError = inputError ?? translation("swapHooks.enterRecipient");
	}

	if (
		BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
		(bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
		(bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
	) {
		inputError = inputError ?? translation("swapHooks.invalidRecipient");
	}

	const slippageAdjustedAmounts =
		v2Trade &&
		userAllowedSlippage &&
		computeSlippageAdjustedAmounts(v2Trade, userAllowedSlippage);

	const [balanceIn, amountIn] = [
		currencyBalances[Field.INPUT] as CurrencyAmount,
		slippageAdjustedAmounts
			? (slippageAdjustedAmounts[Field.INPUT] as CurrencyAmount)
			: null,
	];

	if (balanceIn && amountIn && balanceIn?.lessThan(amountIn)) {
		inputError =
			translation("swapHooks.insufficient") +
			amountIn.currency.symbol +
			translation("swapHooks.balance");
	}

	const bestSwapMethods = UseBestSwapMethod(
		v2Trade as Trade,
		walletInfos.walletAddress,
		signer as Signer
	);

	return {
		parsedAmount,
		v2Trade: v2Trade ?? undefined,
		bestSwapMethods,
		inputErrors: inputError ?? undefined,
	};
}
