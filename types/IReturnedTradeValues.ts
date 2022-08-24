import { CurrencyAmount, Token, Trade } from "@pollum-io/pegasys-sdk";
import { ISwapCall } from "./ISwapCall";

export interface IReturnedTradeValues {
	parsedAmount: CurrencyAmount | undefined;
	v2Trade: Trade | undefined;
	bestSwapMethods: ISwapCall[];
	inputErrors: string | undefined;
	v2TradeRoute: Token[] | undefined;
	isExactIn: boolean;
	slippageAdjustedAmounts:
		| 0
		| {
				INPUT?: CurrencyAmount | undefined;
				OUTPUT?: CurrencyAmount | undefined;
		  }
		| null;
}
