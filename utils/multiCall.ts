import { Contract } from "ethers";

export const multiCall = async (
	contract: Contract[],
	methodName: string,
	parameters?: string
) => {
	try {
		console.log("contract", contract);

		const contractCalls = await Promise.all(
			contract.map((call: Contract) => {
				if (call instanceof Contract) {
					return call[methodName](parameters ?? null);
				}

				return undefined;
			})
		);

		return contractCalls;
	} catch (error) {
		return error;
	}
};
