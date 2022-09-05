import { Contract } from "ethers";

// type MethodParams = string | number | BigNumber;

export const singleCall = async (contract: Contract, methodName: string) => {
	try {
		const contractCall = await contract[methodName];
		return contractCall;
	} catch (error) {
		return error;
	}
};
