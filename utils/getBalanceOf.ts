import { BigNumber, Contract, ethers, Signer } from "ethers";
// import pegasysAbi from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";
import pairPegasysAbi from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/PegasysPair.sol/PegasysPair.json";
import { Interface } from "@ethersproject/abi";
import abi20 from "./abis/erc20.json";
import { createContractUsingAbi } from "./contractInstance";
import { singleCall } from "./singleCall";
import { multiCall } from "./multiCall";
import { formatBigNumberValues } from "./formatBigNumberValues";

const PAIR_INTERFACE = new Interface(pairPegasysAbi.abi);

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

interface IAddressessAndBalances {
	address: string;
	balance: string;
}

export const getBalanceOfMultiCall = async (
	tokenAddress: string[],
	walletAddress: string,
	signerOrProvider:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
		| ethers.providers.Provider
		| undefined,
	decimals: number[]
) => {
	if (!signerOrProvider) return [];
	try {
		const contracts = tokenAddress.map((address: string) =>
			createContractUsingAbi(address, abi20, signerOrProvider)
		);

		const contractCall = await multiCall(contracts, "balanceOf", walletAddress);

		const formattedBalances = formatBigNumberValues(
			contractCall as BigNumber[],
			decimals
		);

		const addressessAndBalances = tokenAddress.map((token, tokenIndex) => {
			const tokenBalance = formattedBalances.find(
				(_, balanceIndex) => tokenIndex === balanceIndex
			);

			return {
				address: token,
				balance: tokenBalance,
			};
		});

		return addressessAndBalances as IAddressessAndBalances[];
	} catch (error) {
		return [];
	}
};

export const getMultiCall = async (
	tokenAddress: string[],
	walletAddress: string,
	signerOrProvider:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
		| ethers.providers.Provider
		| undefined,
	method?: string
) => {
	if (!signerOrProvider) return [];

	try {
		const getTokensCode = await Promise.all(
			tokenAddress.map(token => signerOrProvider.getCode(token))
		);

		const contractsVeryfied = tokenAddress.map((token, index: number) => {
			if (getTokensCode[index] === "0x") return [];

			return createContractUsingAbi(token, PAIR_INTERFACE, signerOrProvider);
		});

		const contractsCalls = await multiCall(
			contractsVeryfied as Contract[],
			method as string
		);

		return contractsCalls;
	} catch (error) {
		return [];
	}
};
