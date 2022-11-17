import { children, setType } from "../react";
import { IFormattedProposal } from "../services";

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
	// isGovernance: boolean;
	// setIsGovernance: setType<boolean>;
	proposals: IFormattedProposal[];
	selectedProposals: IFormattedProposal | null;
	setSelectedProposals: setType<IFormattedProposal | null>;
	vote: (id: string, support?: boolean) => Promise<void>;
	onDelegate: (delegatee?: string) => Promise<void>;
	loading: boolean;
}
