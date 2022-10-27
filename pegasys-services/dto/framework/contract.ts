/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from "@ethersproject/bignumber";
import { ChainId } from "@pollum-io/pegasys-sdk";
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
	value?: BigNumber;
	args?: any[];
	contract: TContract;
	methodName: string;
	highGasFee?: boolean;
}

export type IContractFrameworkCallProps = IContractFrameworkEstimateGasProps;

export interface IGetDefinedContract {
	address: string;
	provider?: TProvider | TSigner;
}

export interface IGetSpecificContract {
	chainId?: ChainId;
	provider?: TProvider | TSigner;
}
