import { injected, walletlink } from "utils/connectors";
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
};

export const TOKENS_INITIAL_STATE = [
	{
		address: "",
		balance: "0",
		chainId: 5700,
		decimals: 18,
		name: "Testnet Syscoin",
		logoURI: "https://cryptologos.cc/logos/syscoin-sys-logo.png?v=022",
		symbol: "TSYS",
		id: 0,
	},
	{
		address: "0x81821498cD456c9f9239010f3A9F755F3A38A778",
		balance: "0",
		chainId: 5700,
		decimals: 18,
		logoURI:
			"https://raw.githubusercontent.com/pollum-io/pegasys-tokenlists/master/testnet-logos/0x81821498cD456c9f9239010f3A9F755F3A38A778/logo.png",
		name: "Pegasys",
		symbol: "PSYS",
		id: 1,
	},
];
