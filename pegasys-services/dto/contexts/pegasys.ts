import { BigNumber } from "ethers";
import { children, setType } from "../react";
import { IToastyProviderProps } from "./toasty";

export interface IPegasysProviderProps {
	children: children;
	toasty: Omit<IToastyProviderProps, "children">;
}

export interface IPegasysProviderValue {
	expert: boolean;
	setExpert: setType<boolean>;
	userTransactionDeadlineValue: BigNumber | number;
	setUserTransactionDeadlineValue: setType<BigNumber | number>;
	userSlippageTolerance: number;
	setUserSlippageTolerance: setType<number>;
}
