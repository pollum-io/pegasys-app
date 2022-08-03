import { ethers, Signer } from "ethers";
import { createContractUsingAbi } from "./contractInstance";
import abi20 from "./abis/erc20.json";

export const getContract = async (
	tokenAddress: string,
	signerOrProvider:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
	// eslint-disable-next-line
) => {
	try {
		const contract = createContractUsingAbi(
			String(tokenAddress),
			abi20,
			signerOrProvider
		);

		return contract;
	} catch (err) {
		// eslint-disable-next-line
		console.log(err);
	}
};
