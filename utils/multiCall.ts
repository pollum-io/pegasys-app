import { Contract } from "ethers";

export const multiCall = async (
	contract: Contract[],
	methodName: string,
	parameters?: string
) => {
	try {
		const contractCalls = Promise.all(
			contract.map(call => call[methodName](parameters ?? null))
		);
		console.log("CONTRACTCALLS: ", contractCalls);
		return contractCalls;
	} catch (error) {
		return error;
	}
};
