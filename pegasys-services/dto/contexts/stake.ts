import { children } from "../react";
import { IEarnInfo } from "./earn";

export interface IStakeProviderProps {
	children: children;
}

export interface IStakeProviderValue {
	claim: () => Promise<void>;
	sign: () => Promise<void>;
	stake: () => Promise<void>;
	unstake: () => Promise<void>;
	stakeV1Opportunities: IEarnInfo[];
}
