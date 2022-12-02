import { children, setType } from "../react";

export interface ISwapProviderProps {
	children: children;
}

export interface ISwapProviderValue {
	currentInputTokenName: string;
	setCurrentInputTokenName: setType<string>;
}
