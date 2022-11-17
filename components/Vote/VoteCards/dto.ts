import { IFormattedProposal } from "pegasys-services";

export interface IStatusProps {
	status?: string;
	date?: string;
}

export interface IBodyProps {
	title?: string;
	version?: string;
}

export interface IVoteCardsProps {
	proposal: IFormattedProposal;
}
