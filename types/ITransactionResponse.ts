import { TransactionResponse } from "@ethersproject/providers";

export interface ITransactionResponse extends TransactionResponse {
	summary?: string;
	approval?: { tokenAddress: string; spender: string };
	claim?: { recipient: string };
	finished?: boolean;
	txType?: string;
}

export interface ITx {
	57: {
		[hash: string]: ITransactionResponse;
	};
	5700: {
		[hash: string]: ITransactionResponse;
	};
	2814: {
		[hash: string]: ITransactionResponse;
	};
}

export interface IPersistTxs {
	[hash: string]: ITransactionResponse;
}
