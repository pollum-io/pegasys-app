import { BigNumber, Contract, ethers, Signer } from "ethers";
import pairPegasysAbi from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/PegasysPair.sol/PegasysPair.json";
import { Interface } from "@ethersproject/abi";
import { IAddressessAndBalances } from "types";
import {
	verifyZerosInBalanceAndFormat,
	formatBigNumberValues,
	createContractUsingAbi,
	singleCallWithoutParams,
	singleCall,
} from "utils";
import abi20 from "../abis/erc20.json";
import { multiCall } from "./multiCall";

const PAIR_INTERFACE = new Interface(pairPegasysAbi.abi);

export const getBalanceOfSingleCall = async (
	tokenAddress: string,
	walletAddress: string,
	signerOrProvider:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
		| ethers.providers.Provider
		| null,
	decimals: number
) => {
	if (!signerOrProvider)
		return {
			balance: "0",
			formattedBalance: "0",
		};

	try {
		const contract = createContractUsingAbi(
			String(tokenAddress),
			abi20,
			signerOrProvider
		);

		const contractCall = await singleCall(contract, "balanceOf", walletAddress);

		const fullContractBalanceValue = String(
			ethers.utils.formatUnits(contractCall, decimals)
		);

		const finalFormattedValue = verifyZerosInBalanceAndFormat(
			Number(fullContractBalanceValue)
		);

		return {
			balance: fullContractBalanceValue,
			formattedBalance: finalFormattedValue,
		};
	} catch (err) {
		return {
			balance: "0",
			formattedBalance: "0",
		};
	}
};

export const getBalanceOfBNSingleCall = async (
	tokenAddress: string,
	walletAddress: string,
	signerOrProvider:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
		| null
) => {
	if (!signerOrProvider) return "0";
	try {
		const contract = createContractUsingAbi(
			String(tokenAddress),
			abi20,
			signerOrProvider
		);

		const contractCall = await singleCallWithoutParams(contract, "balanceOf");

		const balance = await contractCall(walletAddress);

		return balance;
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

export const getBalancesOf = async (
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

		return contractCall;
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
		| null,
	method?: string
) => {
	if (!signerOrProvider) return [];

	try {
		const getTokensCode = await Promise.all(
			// eslint-disable-next-line
			// @ts-ignore
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
