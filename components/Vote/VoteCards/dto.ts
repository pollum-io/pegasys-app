import { IFormattedProposal } from "pegasys-services";

export interface IStatusProps {
	status?: string;
	statusColor?: string;
	date?: string;
}

export interface IBodyProps {
	title?: string;
	version?: string;
}

export interface IVoteCardsProps {
	proposal: IFormattedProposal;
}
