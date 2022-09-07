import { children } from "../react";
import { IToastyProviderProps } from "./toasty";

export interface IPegasysProviderProps {
	children: children;
	toasty: Omit<IToastyProviderProps, "children">;
}

export interface IPegasysProviderValue {}
