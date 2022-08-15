import { ChainId } from "@pollum-io/pegasys-sdk";

export function hasPendingApproval(
	tokenAddress: string | undefined,
	spender: string | undefined,
	transactions: object,
	chainId: ChainId
): boolean {
	return (
		typeof tokenAddress === "string" &&
		typeof spender === "string" &&
		transactions[chainId] &&
		Object.keys(transactions[chainId]).some(hash => {
			const tx = transactions[chainId][hash];
			if (!tx) return false;
			if (tx?.receipt) {
				return false;
			}
			const { approval } = tx;
			if (!approval) return false;
			return (
				approval.spender === spender && approval.tokenAddress === tokenAddress
			);
		})
	);
}
