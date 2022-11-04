import { children, setType } from "../react";

export interface IGovernanceProviderProps {
	children: children;
}

export interface IGovernanceProviderValue {
	votesLocked: boolean;
	setVotesLocked: setType<boolean>;
	delegatedTo: string;
	setDelegatedTo: setType<string>;
	votersType: string;
	setVotersType: setType<string>;
	showCancelled: boolean;
	setShowCancelled: setType<boolean>;
	isGovernance: boolean;
	setIsGovernance: setType<boolean>;
}
