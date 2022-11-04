import { ChainId } from "@pollum-io/pegasys-sdk";
import { TransactionResponse } from "@ethersproject/providers";
import { children, setType } from "../react";

export interface ITransactionResponse extends TransactionResponse {
	summary?: string;
	approval?: { tokenAddress: string; spender: string };
	claim?: { recipient: string };
	finished?: boolean;
	txType?: string;
}
export interface ITransactionProviderProps {
	children: children;
}

export type ITx = {
	[chainId in ChainId]: { [hash: string]: ITransactionResponse };
};

export enum ApprovalState {
	UNKNOWN,
	NOT_APPROVED,
	PENDING,
	APPROVED,
}
export interface IApprovalState {
	status: ApprovalState;
	type: string;
}

export interface ISubmittedAproval {
	status: boolean;
	tokens: string[];
	currentTokenToApprove?: string;
}

export interface IPersistTxs {
	[hash: string]: ITransactionResponse;
}

export interface ITransactionProviderValue {
	transactions: ITx;
	setTransactions: setType<ITx>;
	approvalState: IApprovalState;
	setApprovalState: setType<IApprovalState>;
	approvalSubmitted: ISubmittedAproval;
	setApprovalSubmitted: setType<ISubmittedAproval>;
	currentTxHash: string;
	setCurrentTxHash: setType<string>;
	currentInputTokenName: string;
	setCurrentInputTokenName: setType<string>;
	pendingTxLength: number;
	setPendingTxLength: setType<number>;
	currentSummary: string;
	setCurrentSummary: setType<string>;
	addTransaction: (response: ITransactionResponse) => void;
}
