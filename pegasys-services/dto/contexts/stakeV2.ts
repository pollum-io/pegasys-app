import { children, setType } from "../react";
import { IEarnInfo } from "./earn";

export interface IStakeV2ProviderProps {
	children: children;
}

export interface IStakeV2ProviderValue {
	claim: () => Promise<void>;
	stake: () => Promise<void>;
	unstake: () => Promise<void>;
	showInUsd: boolean;
	setShowInUsd: setType<boolean>;
	stakeV2Opportunities: IEarnInfo[];
	// sign: () => Promise<void>;
}
