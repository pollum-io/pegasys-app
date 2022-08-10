export interface IInputValues {
	value: string;
}

export interface ISwapTokenInputValue {
	inputFrom: IInputValues;
	inputTo: IInputValues;
	typedValue: string;
	currentInputTyped: string;
	lastInputTyped: number | undefined;
}
