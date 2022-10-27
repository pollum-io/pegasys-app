import { ChainId, Token } from "@pollum-io/pegasys-sdk";
import { ethers } from "ethers";
import { ITokenRoutes } from "../dto";

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
	[ChainId.TANENBAUM]: "0xE18c200A70908c89fFA18C628fE1B83aC0065EA4",
	[ChainId.NEVM]: "0x017dAd2578372CAEE5c6CddfE35eEDB3728544C4",
	[ChainId.ROLLUX]: "0x734D8ed3eF0a9F7474bE75252182a6e4ea3B1fEB",
};

export const MINICHEF_ADDRESS: { [k: number]: string } = {
	[ChainId.NEVM]: "0x27F037100118548c63F945e284956073D1DC76dE",
	// [ChainId.ROLLUX]: "0xe9b63e87AF5Bc0CD3f909033a014594d100AAF76",
};

export const STAKE_ADDRESS: { [k: number]: string } = {
	[ChainId.NEVM]: "0xE038E38B48F4123e1408865450E37edC78b736ED",
};

export const PSYS: ITokenRoutes = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		"0x81821498cD456c9f9239010f3A9F755F3A38A778",
		18,
		"PSYS",
		"Pegasys"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		"0xe18c200a70908c89ffa18c628fe1b83ac0065ea4",
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

export const API = "https://api.pegasys.finance/";
