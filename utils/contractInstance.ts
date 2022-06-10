import { ethers, Signer } from "ethers";

export const createContractUsingAbi = async (
	address: string,
	AbiContract: object | never,
	signer:
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
		| undefined
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => new ethers.Contract(address, AbiContract as any, signer);
