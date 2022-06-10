import { ethers, Signer } from "ethers";
import abi20 from "./abis/erc20.json";
import { createContractUsingAbi } from "./contractInstance";

export const getBalanceOf = async (
	tokenAddress: string,
	walletAddress: string,
	signerOrProvider:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
		| undefined
) => {
	if (!signerOrProvider) return "0";
	try {
		const contract = await createContractUsingAbi(
			tokenAddress,
			abi20,
			signerOrProvider
		);
		const balance: string = await contract.methods
			.balanceOf(walletAddress)
			.call();
		return balance;
	} catch (err) {
		return "0";
	}
};
