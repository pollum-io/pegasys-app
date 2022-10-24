import { ChainId, Token } from "@pollum-io/pegasys-sdk";
import { TypeOf } from "yup";
import { ITokenRoutes } from "../dto";

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
	[ChainId.TANENBAUM]: "0xE18c200A70908c89fFA18C628fE1B83aC0065EA4",
	[ChainId.NEVM]: "0x017dAd2578372CAEE5c6CddfE35eEDB3728544C4",
};

export const MINICHEF_ADDRESS: { [k: number]: string } = {
	[ChainId.NEVM]: "0x27F037100118548c63F945e284956073D1DC76dE",
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
};

// Stablecoins

export const USDT: ITokenRoutes = {
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

export const DAI: ITokenRoutes = {
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

export const USDC: ITokenRoutes = {
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

export const WETH: ITokenRoutes = {
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

export const WBTC: ITokenRoutes = {
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

export const LUXY: ITokenRoutes = {
	[ChainId.TANENBAUM]: new Token(
		ChainId.TANENBAUM,
		"0x6b7a87899490ece95443e979ca9485cbe7e71522",
		18,
		"LUXY",
		"LUXY"
	),
	[ChainId.NEVM]: new Token(
		ChainId.NEVM,
		"0x6b7a87899490ece95443e979ca9485cbe7e71522",
		18,
		"LUXY",
		"LUXY"
	),
};

export const API = "https://api.pegasys.finance/";
