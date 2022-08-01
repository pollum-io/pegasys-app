import { injected, walletlink } from "utils/connectors";
import { IWalletInfo } from "types";
import { ChainId, Token, WSYS, Percent, JSBI } from "@pollum-io/pegasys-sdk";
import { ethers } from "ethers";

type ChainTokenList = {
	readonly [chainId in ChainId]: Token[];
};

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;

// 60 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60;

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

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

export const PSYS: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		"0x81821498cD456c9f9239010f3A9F755F3A38A778",
		18,
		"PSYS",
		"Pegasys"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		ethers.utils.getAddress("0xe18c200a70908c89ffa18c628fe1b83ac0065ea4"),
		18,
		"PSYS",
		"Pegasys"
	),
};

// Stablecoins

export const USDT: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		"0x94c80b500C825F3030411a987b7EBb0A8f4adEa0",
		6,
		"USDT",
		"Tether USD"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		"0x922D641a426DcFFaeF11680e5358F34d97d112E1",
		6,
		"USDT",
		"Tether USD"
	),
};

export const DAI: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		"0x2d2e508c8056c3D92745dC2C39E5Cc316de79C0F",
		18,
		"DAI",
		"Dai Stablecoin"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		"0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73",
		18,
		"DAI",
		"Dai Stablecoin"
	),
};

export const USDC: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		"0x510A5D64cCFBd50Ec42Fa400601a0fedf1d452bC",
		6,
		"USDC",
		"USD Coin"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		"0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c",
		6,
		"USDC",
		"USD Coin"
	),
};

// Wrapped Assets

export const WETH: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		"0xE872a5deBaE33f9E11Fe9fD7C7d43be66d8C90C9",
		18,
		"WETH",
		"Ether"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		"0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D",
		18,
		"WETH",
		"Ether"
	),
};

export const WBTC: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		"0x5f971686Ea09b26d34477cc08092fd2C5AD03Fb7",
		18,
		"WBTC",
		"Wrapped Bitcoin"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		"0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055",
		6,
		"WBTC",
		"Wrapped Bitcoin"
	),
};

export const LUXY: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		ethers.utils.getAddress("0x6b7a87899490ece95443e979ca9485cbe7e71522"),
		18,
		"LUXY",
		"LUXY"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		ethers.utils.getAddress("0x6b7a87899490ece95443e979ca9485cbe7e71522"),
		18,
		"LUXY",
		"LUXY"
	),
};

export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
	[ChainId.TANENBAUM]: [WSYS[ChainId.TANENBAUM], PSYS[ChainId.TANENBAUM]],
	[ChainId.NEVM]: [
		WSYS[ChainId.NEVM],
		PSYS[ChainId.NEVM],
		USDT[ChainId.NEVM],
		DAI[ChainId.NEVM],
		USDC[ChainId.NEVM],
	],
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
	[chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} = {
	[ChainId.NEVM]: {},
};
