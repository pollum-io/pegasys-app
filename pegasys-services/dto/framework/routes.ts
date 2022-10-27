import { ChainId } from "@pollum-io/pegasys-sdk";

export interface IRoutesFrameworkContractGetContractAddress {
	chainId?: ChainId;
	router: { [k: number]: string };
}
