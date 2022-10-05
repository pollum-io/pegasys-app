import { UseToastOptions } from "@chakra-ui/react";

import { children, setType } from "../react";

export interface IToastyProviderProps {
	children: children;
	bg: string;
	text: string;
}

export type TToastState = UseToastOptions;

export interface IToastyProviderValue {
	toast: setType<TToastState>;
	state: TToastState;
}
