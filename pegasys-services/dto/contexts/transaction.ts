import { ChainId } from "@pollum-io/pegasys-sdk";
import { TransactionResponse } from "@ethersproject/providers";
import { children, setType } from "../react";

// export interface ITransactionResponse extends TransactionResponse {
// 	summary?: string;
// 	approval?: { tokenAddress: string; spender: string };
// 	claim?: { recipient: string };
// 	finished?: boolean;
// 	txType?: string;
// }

export interface ITransactionProviderProps {
	children: children;
}

// export type ITx = {
// 	[chainId in ChainId]: { [hash: string]: ITransactionResponse };
// };

export enum ApprovalState {
	UNKNOWN,
	NOT_APPROVED,
	PENDING,
	APPROVED,
}

// export interface IApprovalState {
// 	status: ApprovalState;
// 	type: string;
// }

// export interface ISubmittedAproval {
// 	status: boolean;
// 	tokens: string[];
// 	currentTokenToApprove?: string;
// }

// export interface IPersistTxs {
// 	[hash: string]: ITransactionResponse;
// }

export interface IPendingTx {
	summary: string;
	hash: string;
	service: string;
}

export interface IPersistentPendingTx extends IPendingTx {
	walletAddress: string;
	chainId: ChainId;
}

export type IPendingTxs = {
	[chainId in ChainId]: IPendingTx[];
};

export interface IFinishedTx {
	summary: string;
	hash: string;
	success: boolean;
}

export interface IPersistentFinishedTx extends IFinishedTx {
	walletAddress: string;
	chainId: ChainId;
}

export type IFinishedTxs = {
	[chainId in ChainId]: IFinishedTx[];
};

export interface ITransactionProviderValue {
	// transactions: ITx;
	// setTransactions: setType<ITx>;
	// approvalState: IApprovalState;
	// setApprovalState: setType<IApprovalState>;
	// approvalSubmitted: ISubmittedAproval;
	// setApprovalSubmitted: setType<ISubmittedAproval>;
	// currentTxHash: string;
	// setCurrentTxHash: setType<string>;
	// currentInputTokenName: string;
	// setCurrentInputTokenName: setType<string>;
	// pendingTxLength: number;
	// setPendingTxLength: setType<number>;
	// currentSummary: string;
	// setCurrentSummary: setType<string>;
	// addTransaction: (response: ITransactionResponse) => void;
	// addPendingTransactions: (pendingTx: IPendingTx) => void;
	addTransactions: (tx: IPendingTx | IFinishedTx, pending?: boolean) => void;
	removeTransactions: (hash: string, pending?: boolean) => void;
	pendingTxs: IPendingTxs;
	finishedTxs: IFinishedTxs;
	clearAll: () => void;
}
