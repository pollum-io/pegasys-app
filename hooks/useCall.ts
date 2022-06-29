import { BigNumber, Contract } from "ethers";
import { useState } from "react";

interface IResults {
	name: string;
	result: string;
}

type MethodParams = string | number | BigNumber;

const useCall = () => {
	const singleCall = async (
		contract: Contract,
		methodName: string,
		parameters?: MethodParams | MethodParams[]
	) => {
		try {
			const contractCall = await contract[methodName](parameters);
			return contractCall;
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	return { singleCall };
};

export { useCall };
