import { ethers, Signer } from "ethers";
import { createContractUsingAbi } from "./contractInstance";

export const getContract = async (
	tokenAddress: string,
	signerOrProvider:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider,
	abi: object
	// eslint-disable-next-line
) => {
	try {
		const contract = createContractUsingAbi(
			String(tokenAddress),
			abi,
			signerOrProvider
		);

		return contract;
	} catch (err) {
		// eslint-disable-next-line
		console.log(err);
	}
};
