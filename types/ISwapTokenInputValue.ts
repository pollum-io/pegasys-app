import { WrappedTokenInfo } from "./index";

interface IInputValues {
	token: WrappedTokenInfo;
	value: string;
}

export interface ISwapTokenInputValue {
	inputFrom: IInputValues;
	inputTo: IInputValues;
	typedValue: string;
	lastInputTyped: number | undefined;
}
