import { BigNumber, Contract } from "ethers";

type MethodParams = string | number | BigNumber;

type MethodsParamsArray = (MethodParams | MethodParams[])[];

export const multiCall = async (
	contract: Contract[],
	methodName: string[],
	parameters?: MethodsParamsArray
) => {
	try {
		const contractCalls = Promise.all(
			contract.map(async (call, index) => {
				await call[methodName[index]](parameters && parameters[index]);
			})
		);
		return contractCalls;
	} catch (error) {
		console.log(error);
		return error;
	}
};
