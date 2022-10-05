/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { TProvider, TSigner } from "./wallet";

export type TContract = ethers.Contract;

export type TAbi = ethers.ContractInterface;

export interface IContractFrameworkGetContractProps {
	abi: TAbi;
	address: string;
	provider?: TProvider | TSigner;
}

export interface IContractFrameworkEstimateGasProps {
	value?: number;
	args?: any[];
	contract: TContract;
	methodName: string;
}

export type IContractFrameworkCallProps = IContractFrameworkEstimateGasProps;
