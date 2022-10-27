import { injected } from "utils/connectors";
import { IWalletInfo } from "types";
import { ChainId, Token, WSYS, Percent, JSBI } from "@pollum-io/pegasys-sdk";
import { ethers } from "ethers";

type ChainTokenList = {
	readonly [chainId in ChainId]: Token[];
};

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
	[ChainId.TANENBAUM]: ethers.utils.getAddress(
		"0xE18c200A70908c89fFA18C628fE1B83aC0065EA4"
	),
	[ChainId.NEVM]: ethers.utils.getAddress(
		"0x017dAd2578372CAEE5c6CddfE35eEDB3728544C4"
	),
	[ChainId.ROLLUX]: ethers.utils.getAddress(
		"0x734D8ed3eF0a9F7474bE75252182a6e4ea3B1fEB"
	),
};

export const AIRDROP_ADDRESS: { [chainId in ChainId]?: string } = {
	[ChainId.TANENBAUM]: ethers.utils.getAddress(
		"0x0000000000000000000000000000000000000000"
	),
	[ChainId.NEVM]: ethers.utils.getAddress(
		"0x5c0543fFB580b22574D52179cB3Eba7aeF1CE293"
	),
	[ChainId.ROLLUX]: ethers.utils.getAddress(
		"0x0000000000000000000000000000000000000000"
	),
};

export const SUPPORTED_NETWORK_CHAINS = [
	57, // Syscoin NEVM Mainnet
	5700, // Syscoin Tanenbaum Testnet
	2814, // Syscoin Rollux Testnet
];

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
};

export const PSYS: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		ethers.utils.getAddress("0x81821498cD456c9f9239010f3A9F755F3A38A778"),
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
	[ChainId.ROLLUX]: new Token(
		ChainId.ROLLUX,
		ethers.utils.getAddress("0x2A4DC2e946b92AB4a1f7D62844EB237788F9056c"),
		18,
		"PSYS",
		"Pegasys"
	),
};

// Stablecoins

export const USDT: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		ethers.utils.getAddress("0x94c80b500C825F3030411a987b7EBb0A8f4adEa0"),
		6,
		"USDT",
		"Tether USD"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		ethers.utils.getAddress("0x922D641a426DcFFaeF11680e5358F34d97d112E1"),
		6,
		"USDT",
		"Tether USD"
	),
	[ChainId.ROLLUX]: new Token(
		ChainId.ROLLUX,
		ethers.utils.getAddress("0x5B0aC6194499621630ddebb30c4aBE37037b30Ec"),
		6,
		"USDT",
		"Tether USD"
	),
};

export const DAI: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		ethers.utils.getAddress("0x2d2e508c8056c3D92745dC2C39E5Cc316de79C0F"),
		18,
		"DAI",
		"Dai Stablecoin"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		ethers.utils.getAddress("0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73"),
		18,
		"DAI",
		"Dai Stablecoin"
	),
	[ChainId.ROLLUX]: new Token(
		ChainId.ROLLUX,
		ethers.utils.getAddress("0x48023b16c3e81AA7F6eFFbdEB35Bb83f4f31a8fd"),
		18,
		"DAI",
		"Dai Stablecoin"
	),
};

export const USDC: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		ethers.utils.getAddress("0x510A5D64cCFBd50Ec42Fa400601a0fedf1d452bC"),
		6,
		"USDC",
		"USD Coin"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		ethers.utils.getAddress("0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c"),
		6,
		"USDC",
		"USD Coin"
	),
	[ChainId.ROLLUX]: new Token(
		ChainId.ROLLUX,
		ethers.utils.getAddress("0x50D227a0D2131B12B4432A1E044f58A4aCcBe046"),
		6,
		"USDC",
		"USD Coin"
	),
};

// Wrapped Assets

export const WETH: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		ethers.utils.getAddress("0xE872a5deBaE33f9E11Fe9fD7C7d43be66d8C90C9"),
		18,
		"WETH",
		"Ether"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		ethers.utils.getAddress("0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D"),
		18,
		"WETH",
		"Ether"
	),
	[ChainId.ROLLUX]: new Token(
		ChainId.ROLLUX,
		ethers.utils.getAddress("0x6aE73f43cc18Bb9ffB35204023C6C7897CA879C4"),
		18,
		"WETH",
		"Ether"
	),
};

export const WBTC: { [chainId in ChainId]: Token } = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		ethers.utils.getAddress("0x5f971686Ea09b26d34477cc08092fd2C5AD03Fb7"),
		18,
		"WBTC",
		"Wrapped Bitcoin"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		ethers.utils.getAddress("0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055"),
		6,
		"WBTC",
		"Wrapped Bitcoin"
	),
	[ChainId.ROLLUX]: new Token(
		ChainId.ROLLUX,
		ethers.utils.getAddress("0x8A85F9a03DA71F8A7E06fd5b4Af4229288960252"),
		8,
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
	[ChainId.ROLLUX]: new Token(
		ChainId.ROLLUX,
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
	[ChainId.ROLLUX]: [WSYS[ChainId.ROLLUX], PSYS[ChainId.ROLLUX]],
};

const WSYS_AND_PSYS_ONLY: ChainTokenList = {
	[ChainId.TANENBAUM]: [WSYS[ChainId.TANENBAUM], PSYS[ChainId.TANENBAUM]],
	[ChainId.NEVM]: [WSYS[ChainId.NEVM], PSYS[ChainId.NEVM]],
	[ChainId.ROLLUX]: [WSYS[ChainId.ROLLUX], PSYS[ChainId.ROLLUX]],
};

export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
	...WSYS_AND_PSYS_ONLY,
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

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;

// 60 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60;

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

// Helper consts for Trade price calculation
const BASE_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000));
export const ONE_HUNDRED_PERCENT = new Percent(
	JSBI.BigInt(10000),
	JSBI.BigInt(10000)
);
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE);

export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
	JSBI.BigInt(100),
	BIPS_BASE
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
	JSBI.BigInt(300),
	BIPS_BASE
); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
	JSBI.BigInt(500),
	BIPS_BASE
); // 5%
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
	JSBI.BigInt(1500),
	BIPS_BASE
); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(
	JSBI.BigInt(10),
	JSBI.BigInt(16)
); // .01 ETH

// Candle graph periods values -> Seconds to Minutes
export const FIVE_MINUTES_IN_SECONDS = 300;
export const FIFTEEN_MINUTES_IN_SECONDS = 900;
export const ONE_HOUR_IN_SECONDS = 3600;
export const FOUR_HOURS_IN_SECONDS = 14400;
export const ONE_DAY_IN_SECONDS = 86400;
export const ONE_WEEK_IN_SECONDS = 604800;

// Pegasys default Token List values

export const PEGASYS_LIST =
	"https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/pegasys.tokenlist.json";
export const TANENBAUM_LIST =
	"https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/tanembaum.tokenlist.json";

export const ROLLUX_LIST =
	"https://static.luxy.io/ipfs/QmSY84ni9RsuWfoJtCBSjVEzAAykBqqCrPUwytQCHUrmrA";

export const DEFAULT_TOKEN_LISTS_SELECTED: string[] = [
	PEGASYS_LIST,
	TANENBAUM_LIST,
	ROLLUX_LIST,
];

export const DEFAULT_TOKEN_LISTS: string[] = [
	PEGASYS_LIST,
	TANENBAUM_LIST,
	ROLLUX_LIST,
];
