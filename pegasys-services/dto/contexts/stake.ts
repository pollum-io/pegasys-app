import { children, setType } from "../react";
import { IStakeInfo } from "../services";

export interface IStakeProviderProps {
	children: children;
}

export interface IStakeProviderValue {
	allStakes: IStakeInfo[];
	selectedStake?: IStakeInfo;
	setSelectedStake: setType<IStakeInfo | undefined>;
	unstakeTypedValue: string;
	setUnstakeTypedValue: (newValue: string) => void;
	stakeTypedValue: string;
	setStakeTypedValue: (newValue: string) => void;
	claim: () => Promise<void>;
	unstake: () => Promise<void>;
	stake: () => Promise<void>;
}
