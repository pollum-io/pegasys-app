import { ChainId, Token } from "@pollum-io/pegasys-sdk";
import { BASES_TO_TRACK_LIQUIDITY_FOR } from "helpers/consts";
import flatMap from "lodash.flatmap";
import { WrappedTokenInfo } from "types";

interface ITokens {
	[address: string]: WrappedTokenInfo;
}

export function getTokenPairs(chainId: ChainId, allTokens: WrappedTokenInfo[]) {
	if (allTokens.length === 0) return [];
	const tokens: ITokens = allTokens.reduce(
		(accumulator, value) => ({
			...accumulator,
			[value.address]: value,
		}),
		{}
	);

	// pairs for every token against every base
	const generatedPairs = chainId
		? flatMap(Object.keys(tokens), tokenAddress => {
				const token = tokens[tokenAddress];
				// for each token on the current chain,
				return (
					// loop though all bases on the current chain
					(BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
						// to construct pairs of the given token with each base
						.map(base => {
							if (base.address === token.address) {
								return null;
							}
							return [base, token];
						})
						.filter((p): p is [Token, Token] => p !== null)
				);
		  })
		: [];

	// dedupes pairs of tokens in the combined list
	const keyed = generatedPairs.reduce<{
		[key: string]: [Token, Token];
	}>((memo, [tokenA, tokenB]) => {
		const sorted =
			tokenA instanceof WrappedTokenInfo && tokenA.sortsBefore(tokenB);
		const key = sorted
			? `${tokenA.address}:${tokenB.address}`
			: `${tokenB.address}:${tokenA.address}`;
		if (memo[key]) return memo;
		memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA];
		return memo;
	}, {});

	return Object.keys(keyed).map(key => keyed[key]);
}
