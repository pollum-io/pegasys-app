import { ChainId } from "@pollum-io/pegasys-sdk";

export type IContractDTO = {
	[chainId in ChainId]: {
		[k: string]: string;
	};
};
