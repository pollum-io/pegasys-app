import { ethers } from "ethers";

export const createContractUsingAbi = async (
	address: string,
	AbiContract: object | any,
	signer: any
): Promise<any> => new ethers.Contract(address, AbiContract as any, signer);
