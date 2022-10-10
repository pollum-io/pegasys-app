import { children, setType } from "../react";

export interface IStakeProviderProps {
	children: children;
}

export interface IStakeProviderValue {
	claim: () => Promise<void>;
	sign: () => Promise<void>;
	stake: () => Promise<void>;
	unstake: () => Promise<void>;
	showInUsd: boolean;
	setShowInUsd: setType<boolean>;
}
