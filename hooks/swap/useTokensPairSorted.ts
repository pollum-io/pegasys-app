import { Token } from "@pollum-io/pegasys-sdk";

export const UseTokensPairSorted = (tokens: Token[]) => {
	const SYS = new Token(
		tokens[0].chainId,
		"0x0000000000000000000000000000000000000000",
		18,
		"SYS"
	);

	const Token0 = tokens[0].symbol === "SYS" ? SYS : tokens[0];
	const Token1 = tokens[1].symbol === "SYS" ? SYS : tokens[1];

	const [tokenA, tokenB]: Token[] = [Token0, Token1];

	const [token0, token1] = tokenA?.sortsBefore(tokenB)
		? [tokenA, tokenB]
		: [tokenB, tokenA];

	return [token0, token1];
};
