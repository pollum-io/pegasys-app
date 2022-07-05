import { BigNumber, Contract } from "ethers";

type MethodParams = string | number | BigNumber;

export const singleCall = async (
	contract: Contract,
	methodName: string,
	parameters?: MethodParams | MethodParams[]
) => {
	try {
		const contractCall = await contract[methodName](parameters);
		return contractCall;
	} catch (error) {
		return error;
	}
};
