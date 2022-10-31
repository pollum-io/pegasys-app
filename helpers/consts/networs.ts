import { ChainId } from "@pollum-io/pegasys-sdk";
import { INetworksChainParams } from "./dto";

export const SUPPORTED_NETWORK_CHAINS = [
	57, // Syscoin NEVM Mainnet
	5700, // Syscoin Tanenbaum Testnet
	2814, // Syscoin Rollux Testnet
];

export const NETWORKS_CHAIN_PARAMS: INetworksChainParams = {
	[ChainId.NEVM]: {
		chainId: "0x39", // A 0x-prefixed hexadecimal chainId
		chainName: "Syscoin NEVM Mainnet",
		nativeCurrency: {
			name: "Syscoin",
			symbol: "SYS",
			decimals: 18,
		},
		rpcUrls: ["https://rpc.syscoin.org/"],
		blockExplorerUrls: ["https://explorer.syscoin.org/"],
	},
	[ChainId.TANENBAUM]: {
		chainId: "0x1644", // A 0x-prefixed hexadecimal chainId
		chainName: "Syscoin Tanenbaum Testnet",
		nativeCurrency: {
			name: "Testnet Syscoin",
			symbol: "tSYS",
			decimals: 18,
		},
		rpcUrls: ["https://rpc.tanenbaum.io"],
		blockExplorerUrls: ["https://tanenbaum.io"],
	},
	[ChainId.ROLLUX]: {
		chainId: "0xafe", // A 0x-prefixed hexadecimal chainId
		chainName: "Rollux Testnet",
		nativeCurrency: {
			name: "Rollux Testnet",
			symbol: "rSYS",
			decimals: 18,
		},
		rpcUrls: ["https://testnet.rollux.com:2814/"],
		blockExplorerUrls: ["https://explorer.testnet.rollux.com/"],
	},
};
