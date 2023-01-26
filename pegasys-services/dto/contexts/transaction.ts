import { ChainId } from "@pollum-io/pegasys-sdk";
import { children } from "../react";

export interface ITransactionProviderProps {
	children: children;
}

export enum ApprovalState {
	UNKNOWN,
	NOT_APPROVED,
	PENDING,
	APPROVED,
}

export interface IPendingTx {
	summary: string;
	hash: string;
	service: string;
}

export interface IPersistentPendingTx extends IPendingTx {
	walletAddress: string;
	chainId: ChainId;
}

export type IPendingTxs = IPendingTx[];

export interface IFinishedTx {
	summary: string;
	hash: string;
	success: boolean;
	service: string;
}

export interface IPersistentFinishedTx extends IFinishedTx {
	walletAddress: string;
	chainId: ChainId;
}

export type IFinishedTxs = IFinishedTx[];

export interface ITransactionProviderValue {
	addTransactions: (tx: IPendingTx | IFinishedTx, pending?: boolean) => void;
	pendingTxs: IPendingTxs;
	finishedTxs: IFinishedTxs;
	clearAll: () => void;
}
