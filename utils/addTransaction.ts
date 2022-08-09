import { TransactionResponse } from "@ethersproject/providers";
import { IWalletHookInfos } from "types";

export const addTransaction = (
	response: TransactionResponse,
	customData?: {
		summary?: string;
		approval?: { tokenAddress: string; spender: string };
		claim?: { recipient: string };
	},
	walletInfo: IWalletHookInfos,
	setTransaction: React.Dispatch<React.SetStateAction<object>>,
	transactions: object
) => {
	const { chainId, walletAddress } = walletInfo;
	if (!walletAddress) return;
	if (!chainId) return;

	const { hash } = response;
	if (!hash) {
		throw Error("No transaction hash found.");
	}
	setTransaction({
		...transactions,
		[chainId]: {
			...transactions[chainId],
			[hash]: { ...response, ...customData },
		},
	});
};
