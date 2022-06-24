import { injected, walletconnect, walletlink } from "utils/connectors";
import { IWalletInfo } from "types";

export const NEVM_CHAIN_PARAMS = {
	chainId: "0x39", // A 0x-prefixed hexadecimal chainId
	chainName: "Syscoin NEVM Mainnet",
	nativeCurrency: {
		name: "Syscoin",
		symbol: "SYS",
		decimals: 18,
	},
	rpcUrls: ["https://rpc.syscoin.org/"],
	blockExplorerUrls: ["https://explorer.syscoin.org/"],
};

export const SYS_TESTNET_CHAIN_PARAMS = {
	chainId: "0x1644", // A 0x-prefixed hexadecimal chainId
	chainName: "Syscoin Tanenbaum Testnet",
	nativeCurrency: {
		name: "Testnet Syscoin",
		symbol: "tSYS",
		decimals: 18,
	},
	rpcUrls: ["https://rpc.tanenbaum.io"],
	blockExplorerUrls: ["https://tanenbaum.io"],
};

export const SUPPORTED_WALLETS: { [key: string]: IWalletInfo } = {
	METAMASK: {
		connector: injected,
		name: "MetaMask",
		iconName: "metamask.png",
	},
	WALLET_LINK: {
		connector: walletlink,
		name: "Coinbase Wallet",
		iconName: "coinbaseWalletIcon.svg",
	},
	WALLET_CONNECT: {
		connector: walletconnect,
		name: "Wallet Connect",
		iconName: "walletConnectIcon.svg",
	},
};
