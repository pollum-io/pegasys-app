import { BigNumber, ethers, Signer } from "ethers";
import abi20 from "./abis/erc20.json";
import { createContractUsingAbi } from "./contractInstance";
import { singleCall } from "./singleCall";

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
		const contract = createContractUsingAbi(
			tokenAddress,
			abi20,
			signerOrProvider
		);
		const contractCall = await singleCall(contract, "balanceOf", walletAddress);
		// const balance: string = await contract
		// 	.balanceOf(walletAddress)
		// 	.then((result: number | BigNumber) => result.toString());
		// const formattedValue = ethers.utils.formatEther(balance);
		// return formattedValue;
		return "0";
	} catch (err) {
		return "0";
	}
};
