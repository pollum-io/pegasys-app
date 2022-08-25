import { CurrencyAmount, Token, Trade } from "@pollum-io/pegasys-sdk";
import { Field } from "utils";
import { ISwapCall } from "./ISwapCall";

export interface IReturnedTradeValues {
	parsedAmount: CurrencyAmount | undefined;
	v2Trade: Trade | undefined;
	bestSwapMethods: ISwapCall[];
	inputErrors: string | undefined;
	v2TradeRoute: Token[] | undefined;
	currencyBalances: { [field in Field]?: CurrencyAmount };
}
