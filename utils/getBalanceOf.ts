import { BigNumber, ethers, Signer } from "ethers";
import abi20 from "./abis/erc20.json";
import { createContractUsingAbi } from "./contractInstance";
import { singleCall } from "./singleCall";
import { multiCall } from "./multiCall";
import { formatBigNumberValues } from "./formatBigNumberValues";

export const getBalanceOfSingleCall = async (
	tokenAddress: string,
	walletAddress: string,
	signerOrProvider:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
		| undefined,
	decimals: number
) => {
	if (!signerOrProvider) return "0";
	try {
		const contract = createContractUsingAbi(
			String(tokenAddress),
			abi20,
			signerOrProvider
		);

		const contractCall = await singleCall(contract, "balanceOf", walletAddress);

		const formattedBalance = String(
			ethers.utils.formatUnits(contractCall, decimals)
		);

		return formattedBalance;
	} catch (err) {
		return "0";
	}
};

export const getBalanceOfMultiCall = async (
	tokenAddress: string[],
	walletAddress: string,
	signerOrProvider:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
		| undefined,
	decimals: number
) => {
	try {
		const contracts = tokenAddress.map((address: string) =>
			createContractUsingAbi(address, abi20, signerOrProvider)
		);

		const contractCall = await multiCall(contracts, "balanceOf", walletAddress);

		const formattedBalances = formatBigNumberValues(
			contractCall as BigNumber[],
			decimals
		);

		return formattedBalances;
	} catch (error) {
		return "0";
	}
};
