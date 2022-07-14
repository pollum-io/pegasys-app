import { ITokenBalance, ITokenBalanceWithId } from "./index";

interface IInputValues {
	token: ITokenBalanceWithId | ITokenBalance;
	value: string;
}

export interface ISwapTokenInputValue {
	inputFrom: IInputValues;
	inputTo: IInputValues;
	typedValue: string;
	lastInputTyped: number | undefined;
}
