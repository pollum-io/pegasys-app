import { TransactionResponse } from "@ethersproject/providers";

export interface ITransactionResponse extends TransactionResponse {
	summary?: string;
	approval?: { tokenAddress: string; spender: string };
	claim?: { recipient: string };
}
