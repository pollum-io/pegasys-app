import { ethers, Signer } from "ethers";

export type TProvider =
	| ethers.providers.Web3Provider
	| ethers.providers.JsonRpcProvider;

export type TSigner = Signer | undefined;

export interface IWalletFrameworkConnectionInfo {
	address: string;
	chainId: number;
	signer?: TSigner;
	provider: TProvider;
}
