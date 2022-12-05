import { BigNumber } from "@ethersproject/bignumber";

// combines the current timestamp with the user setting to give the deadline that should be used for any submitted transaction
export function useTransactionDeadline(
	currentTransactionDeadline: BigNumber | number
): BigNumber | undefined {
	const ttl = currentTransactionDeadline;
	const currentTimestamp = BigNumber.from(new Date().getTime() + 100000);
	if (currentTimestamp && ttl) return currentTimestamp.add(ttl);
	return undefined;
}
