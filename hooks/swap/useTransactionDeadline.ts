import { BigNumber } from "@ethersproject/bignumber";
import { DEFAULT_DEADLINE_FROM_NOW } from "helpers/consts";

export function useTransactionDeadline(): BigNumber | undefined {
	const ttl = DEFAULT_DEADLINE_FROM_NOW;
	const currentTimestamp = BigNumber.from(new Date().getTime() + 100000);
	if (currentTimestamp && ttl) return currentTimestamp.add(ttl);
	return undefined;
}
