import { ChainId } from "@pollum-io/pegasys-sdk";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { ethers, Signer } from "ethers";

export interface IWalletInfo {
	connector?: AbstractConnector;
	name?: string;
	iconName?: string;
	description?: string;
	href?: string | null;
	color?: string;
	primary?: true;
	mobile?: true;
	mobileOnly?: true;
}

export interface IWalletHookInfos {
	chainId: ChainId;
	walletAddress: string;
	provider:
		| ethers.providers.Provider
		| ethers.providers.Web3Provider
		| ethers.providers.JsonRpcProvider
		| Signer
		| undefined;
}
