import { TransactionResponse } from "@ethersproject/providers";
import { ITx, IWalletHookInfos } from "types";

export const addTransaction = (
	response: TransactionResponse,
	walletInfo: IWalletHookInfos,
	setTransaction: React.Dispatch<React.SetStateAction<ITx>>,
	transactions: ITx,
	customData?: {
		summary?: string;
		approval?: { tokenAddress: string; spender: string };
		claim?: { recipient: string };
	}
) => {
	const { chainId, walletAddress } = walletInfo;
	if (!walletAddress || !chainId) return;

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
