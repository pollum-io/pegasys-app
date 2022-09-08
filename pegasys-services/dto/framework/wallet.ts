import { ethers, Signer } from "ethers";

export type TProvider =
	| ethers.providers.Web3Provider
	| ethers.providers.JsonRpcProvider;

export type TSigner = Signer;

export interface IWalletFrameworkConnectionInfo {
	address: string;
	chainId: number;
}
