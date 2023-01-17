import { UseToastOptions } from "@chakra-ui/react";
import { ChainId } from "@pollum-io/pegasys-sdk";

import { children, setType } from "../react";

export interface IToastyProviderProps {
	children: children;
	bg: string;
	text: string;
}
export interface IToastOptions extends UseToastOptions {
	txHash?: string;
	chainId?: ChainId | null;
}

export type TToastState = IToastOptions;

export interface IToastyProviderValue {
	toast: setType<TToastState>;
	state: TToastState;
}
