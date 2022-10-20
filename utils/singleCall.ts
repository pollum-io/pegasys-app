import { Contract } from "ethers";

// type MethodParams = string | number | BigNumber;

export const singleCall = async (
	contract: Contract,
	methodName: string,
	parameters?: string
) => {
	try {
		const contractCall = await contract[methodName](parameters);
		return contractCall;
	} catch (error) {
		return "0";
	}
};
