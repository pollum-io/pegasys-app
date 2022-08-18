import { BigNumber } from "@ethersproject/bignumber";

export function calculateGasMargin(value: BigNumber): BigNumber {
	return value.mul(BigNumber.from(4));
}
