import { ChainId } from "@pollum-io/pegasys-sdk";
import { TContract, TProvider } from "../framework";

export interface IGovernaceServicesGetProposalCount {
	chainId?: ChainId | null;
	provider?: TProvider | null;
	contract?: TContract;
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
		id: string;
		support: boolean;
		votes: string;
	}>;
}

export interface IFormattedProposal {
	id: string;
	title: string;
	description: string;
	proposer: string;
	status: string;
	forCount: number;
	againstCount: number;
	startBlock: string;
	endBlock: string;
	details: {
		functionSig: string;
		callData: string;
	};
}
