import { ChainId, JSBI } from "@pollum-io/pegasys-sdk";
import { TContract, TProvider } from "../framework";

export interface IGovernaceServicesGetProposalCount {
	chainId?: ChainId | null;
	provider?: TProvider | null;
	contract?: TContract;
}

export interface IGovernaceServicesGetProposalVotes {
	chainId?: ChainId | null;
	provider?: TProvider | null;
	contract?: TContract;
	proposalIndex: number;
}

export interface IGovernaceServicesGetProposal {
	proposalCount: number;
}

export interface IGovernaceServicesCastVote {
	chainId?: ChainId | null;
	provider?: TProvider;
	contract?: TContract;
	proposalIndex: number;
	support?: boolean;
}

export interface IGovernaceServicesDelegate {
	chainId?: ChainId | null;
	contract?: TContract;
	delegatee?: string;
}

export interface IGovernaceServicesGetDelegatee {
	chainId?: ChainId | null;
	provider?: TProvider;
	contract?: TContract;
	walletAddress?: string;
}

export interface IGovernaceServicesGetCurrentVotes {
	chainId?: ChainId | null;
	provider?: TProvider;
	contract?: TContract;
	walletAddress?: string;
}

export interface IProposal {
	calldatas: [string];
	description: string;
	endBlock: string;
	id: string;
	proposer: { id: string };
	signatures: [string];
	startBlock: string;
	status: string;
	votes: Array<{
		support: boolean;
		votes: string;
		voter: {
			id: string;
		};
	}>;
}

export interface IProposalVote {
	voter: string;
	votes: number;
}

export interface IFormattedProposal {
	id: string;
	title: string;
	description: string[];
	proposer: string;
	status: string;
	forVotes: number;
	againstVotes: number;
	totalVotes: number;
	startBlock: string;
	endBlock: string;
	date: Date;
	details: {
		functionSig: string;
		callData: string;
	};
	supportVotes: IProposalVote[];
	notSupportVotes: IProposalVote[];
}
