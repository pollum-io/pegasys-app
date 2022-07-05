import { ethers, Signer } from "ethers";

export const createContractUsingAbi = (
	address: string,
	AbiContract: object | never,
	signer:
		| ethers.providers.Provider
		| Signer
		| ethers.providers.JsonRpcProvider
		| ethers.providers.Web3Provider
		| undefined
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => new ethers.Contract(address, AbiContract as any, signer);
