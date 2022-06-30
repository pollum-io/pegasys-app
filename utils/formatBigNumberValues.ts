import { BigNumber, ethers } from "ethers";

export const formatBigNumberValues = (values: BigNumber[], decimals: number) =>
	values.map(value => ethers.utils.formatUnits(value, decimals));
