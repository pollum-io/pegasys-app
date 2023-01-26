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
	handleCacheExportMode: () => void;
	userTransactionDeadlineValue: BigNumber | number;
	setUserTransactionDeadlineValue: setType<BigNumber | number>;
	userSlippageTolerance: number;
	setUserSlippageTolerance: setType<number>;
}
