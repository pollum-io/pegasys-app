import { Token } from "@pollum-io/pegasys-sdk";

export const UseTokensPairSorted = (tokens: Token[]) => {
	const [tokenA, tokenB]: Token[] = [tokens[0], tokens[1]] as Token[];

	const [token0, token1] = tokenA?.sortsBefore(tokenB)
		? [tokenA, tokenB]
		: [tokenB, tokenA];

	return [token0, token1];
};
