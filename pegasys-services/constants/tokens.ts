import { ethers } from "ethers";
import { Token, ChainId } from "@pollum-io/pegasys-sdk";
import { ITokensDTO } from "./dto";

export const PegasysTokens: ITokensDTO = {
	[ChainId.NEVM]: {
		PSYS: new Token(
			ChainId.NEVM,
			ethers.utils.getAddress("0xe18c200a70908c89ffa18c628fe1b83ac0065ea4"),
			18,
			"PSYS",
			"Pegasys"
		),
		USDT: new Token(
			ChainId.NEVM,
			ethers.utils.getAddress("0x922D641a426DcFFaeF11680e5358F34d97d112E1"),
			6,
			"USDT",
			"Tether USD"
		),
		DAI: new Token(
			ChainId.NEVM,
			ethers.utils.getAddress("0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73"),
			18,
			"DAI",
			"Dai Stablecoin"
		),
		USDC: new Token(
			ChainId.NEVM,
			ethers.utils.getAddress("0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c"),
			6,
			"USDC",
			"USD Coin"
		),
		WETH: new Token(
			ChainId.NEVM,
			ethers.utils.getAddress("0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D"),
			18,
			"WETH",
			"Ether"
		),
		WBTC: new Token(
			ChainId.NEVM,
			ethers.utils.getAddress("0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055"),
			6,
			"WBTC",
			"Wrapped Bitcoin"
		),
		LUXY: new Token(
			ChainId.NEVM,
			ethers.utils.getAddress("0x6b7a87899490ece95443e979ca9485cbe7e71522"),
			18,
			"LUXY",
			"LUXY"
		),
	},

	[ChainId.TANENBAUM]: {
		PSYS: new Token(
			ChainId.TANENBAUM,
			ethers.utils.getAddress("0x81821498cD456c9f9239010f3A9F755F3A38A778"),
			18,
			"PSYS",
			"Pegasys"
		),
		USDT: new Token(
			ChainId.TANENBAUM,
			ethers.utils.getAddress("0x94c80b500C825F3030411a987b7EBb0A8f4adEa0"),
			6,
			"USDT",
			"Tether USD"
		),
		DAI: new Token(
			ChainId.TANENBAUM,
			ethers.utils.getAddress("0x2d2e508c8056c3D92745dC2C39E5Cc316de79C0F"),
			18,
			"DAI",
			"Dai Stablecoin"
		),
		USDC: new Token(
			ChainId.TANENBAUM,
			ethers.utils.getAddress("0x510A5D64cCFBd50Ec42Fa400601a0fedf1d452bC"),
			6,
			"USDC",
			"USD Coin"
		),
		WETH: new Token(
			ChainId.TANENBAUM,
			ethers.utils.getAddress("0xE872a5deBaE33f9E11Fe9fD7C7d43be66d8C90C9"),
			18,
			"WETH",
			"Ether"
		),
		WBTC: new Token(
			ChainId.TANENBAUM,
			ethers.utils.getAddress("0x5f971686Ea09b26d34477cc08092fd2C5AD03Fb7"),
			18,
			"WBTC",
			"Wrapped Bitcoin"
		),
		LUXY: new Token(
			ChainId.TANENBAUM,
			ethers.utils.getAddress("0x6b7a87899490ece95443e979ca9485cbe7e71522"),
			18,
			"LUXY",
			"LUXY"
		),
	},

	[ChainId.ROLLUX]: {
		PSYS: new Token(
			ChainId.ROLLUX,
			ethers.utils.getAddress("0x2A4DC2e946b92AB4a1f7D62844EB237788F9056c"),
			18,
			"PSYS",
			"Pegasys"
		),
		USDT: new Token(
			ChainId.ROLLUX,
			ethers.utils.getAddress("0x5B0aC6194499621630ddebb30c4aBE37037b30Ec"),
			6,
			"USDT",
			"Tether USD"
		),
		DAI: new Token(
			ChainId.ROLLUX,
			ethers.utils.getAddress("0x48023b16c3e81AA7F6eFFbdEB35Bb83f4f31a8fd"),
			18,
			"DAI",
			"Dai Stablecoin"
		),
		USDC: new Token(
			ChainId.ROLLUX,
			ethers.utils.getAddress("0x50D227a0D2131B12B4432A1E044f58A4aCcBe046"),
			6,
			"USDC",
			"USD Coin"
		),
		WETH: new Token(
			ChainId.ROLLUX,
			ethers.utils.getAddress("0x6aE73f43cc18Bb9ffB35204023C6C7897CA879C4"),
			18,
			"WETH",
			"Ether"
		),
		WBTC: new Token(
			ChainId.ROLLUX,
			ethers.utils.getAddress("0x8A85F9a03DA71F8A7E06fd5b4Af4229288960252"),
			8,
			"WBTC",
			"Wrapped Bitcoin"
		),
		LUXY: new Token(
			ChainId.ROLLUX,
			ethers.utils.getAddress("0x6b7a87899490ece95443e979ca9485cbe7e71522"),
			18,
			"LUXY",
			"LUXY"
		),
	},
};
