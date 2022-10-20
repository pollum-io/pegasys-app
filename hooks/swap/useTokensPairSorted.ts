import { Token } from "@pollum-io/pegasys-sdk";
import { PSYS, SYS_LOGO } from "helpers/consts";
import { WrappedTokenInfo } from "types";

export const UseTokensPairSorted = (tokens: Token[]) => {
	if (tokens[0].symbol === "SYS" && tokens[1].symbol === "WSYS") {
		const SYS = new WrappedTokenInfo({
			...PSYS[tokens[0].chainId],
			name: "Syscoin",
			symbol: "SYS",
			logoURI: SYS_LOGO,
			balance: "0",
			formattedBalance: "0",
		});

		const [tokenA, tokenB]: Token[] = [SYS, tokens[1]];

		const [token0, token1] = tokenA?.sortsBefore(tokenB)
			? [tokenA, tokenB]
			: [tokenB, tokenA];

		return [token0, token1];
	}
	if (tokens[0].symbol === "WSYS" && tokens[1].symbol === "SYS") {
		const SYS = new WrappedTokenInfo({
			...PSYS[tokens[0].chainId],
			name: "Syscoin",
			symbol: "SYS",
			logoURI: SYS_LOGO,
			balance: "0",
			formattedBalance: "0",
		});

		const [tokenA, tokenB]: Token[] = [tokens[0], SYS];

		const [token0, token1] = tokenA?.sortsBefore(tokenB)
			? [tokenA, tokenB]
			: [tokenB, tokenA];

		return [token0, token1];
	}

	const [tokenA, tokenB]: Token[] = [tokens[0], tokens[1]];

	const [token0, token1] = tokenA?.sortsBefore(tokenB)
		? [tokenA, tokenB]
		: [tokenB, tokenA];

	return [token0, token1];
};
