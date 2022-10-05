/*eslint-disable */
// @ts-nocheck
import { BigNumber, ethers } from "ethers";

export const formatBigNumberValues = (
	values: BigNumber[],
	decimals: number[]
) =>
	values.map((value, index: number) =>
		ethers.utils.formatUnits(value, decimals[index])
	);
