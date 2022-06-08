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

export const SUPPORTED_WALLETS: { [key: string]: IWalletInfo } = {
	INJECTED: {
		connector: injected,
		name: "Injected",
		iconName: "metamask.png",
		description: "Injected web3 provider.",
		href: null,
		color: "#010101",
		primary: true,
	},
	METAMASK: {
		connector: injected,
		name: "MetaMask",
		iconName: "metamask.png",
		description: "Easy-to-use browser extension.",
		href: null,
		color: "#E8831D",
	},
	WALLET_LINK: {
		connector: walletlink,
		name: "Coinbase Wallet",
		iconName: "coinbaseWalletIcon.svg",
		description: "Use Coinbase Wallet app on mobile device",
		href: null,
		color: "#315CF5",
	},
	WALLET_CONNECT: {
		connector: walletconnect,
		name: "Wallet Connect",
		iconName: "walletConnectIcon.svg",
		description: "Use Wallet Connect",
		href: null,
		color: "#315CF5",
	},
};
