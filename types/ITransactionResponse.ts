import { TransactionResponse } from "@ethersproject/providers";

export interface ITransactionResponse extends TransactionResponse {
	summary?: string;
	approval?: { tokenAddress: string; spender: string };
	claim?: { recipient: string };
}

export interface ITx {
	57: {
		[hash: string]: ITransactionResponse;
	};
	5700: {
		[hash: string]: ITransactionResponse;
	};
}
