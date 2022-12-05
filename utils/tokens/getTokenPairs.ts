import { ChainId, Token } from "@pollum-io/pegasys-sdk";
import { BASES_TO_TRACK_LIQUIDITY_FOR } from "pegasys-services/constants";
import flatMap from "lodash.flatmap";
import { WrappedTokenInfo } from "types";

interface ITokens {
	[address: string]: WrappedTokenInfo;
}

export function getTokenPairs(chainId: ChainId, allTokens: WrappedTokenInfo[]) {
	if (
		allTokens.length === 0 ||
		!chainId ||
		!allTokens.every(token => token.chainId === chainId)
	)
		return [];
	const tokens: ITokens = allTokens.reduce(
		(accumulator, value) => ({
			...accumulator,
			[value.address]: value,
		}),
		{}
	);

	const TUSD = allTokens.find(item => item.symbol === "TUSD");
	const USDT = allTokens.find(item => item.symbol === "USDT");
	const USDC = allTokens.find(item => item.symbol === "USDC");
	const DAI = allTokens.find(item => item.symbol === "DAI");
	const WETH = allTokens.find(item => item.symbol === "WETH");
	const BUSD = allTokens.find(item => item.symbol === "BUSD");
	const WBTC = allTokens.find(item => item.symbol === "WBTC");
	const BNB = allTokens.find(item => item.symbol === "BNB");
	const WSYS = allTokens.find(item => item.symbol === "WSYS");
	const PSYS = allTokens.find(item => item.symbol === "PSYS");

	const customPairs = [
		TUSD,
		USDT,
		USDC,
		DAI,
		WETH,
		BUSD,
		BNB,
		WBTC,
		WSYS,
		PSYS,
	].filter(item => item !== undefined);

	const allCustomPairs = customPairs.flatMap((v, i) =>
		customPairs.slice(i + 1).map(w => {
			if (v?.symbol === "PSYS" && w?.symbol === "WSYS") {
				return [w, v];
			}
			return [v, w];
		})
	);

	// pairs for every token against every base
	const generatedPairs = chainId
		? flatMap(Object.keys(tokens), tokenAddress => {
				const token = tokens[tokenAddress];
				// for each token on the current chain,
				return (
					// loop though all bases on the current chain
					(BASES_TO_TRACK_LIQUIDITY_FOR[chainId ?? ChainId.NEVM] ?? [])
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

	const mixPairs =
		chainId === ChainId.NEVM || chainId === ChainId.ROLLUX
			? [...generatedPairs, ...allCustomPairs]
			: [...generatedPairs];

	// dedupes pairs of tokens in the combined list
	const keyed = mixPairs?.reduce<{
		[key: string]: [Token, Token];
	}>((memo, [tokenA, tokenB]) => {
		const sorted =
			tokenA instanceof WrappedTokenInfo && tokenA.sortsBefore(tokenB as Token);
		const key = sorted
			? `${tokenA?.address}:${tokenB?.address}`
			: `${tokenB?.address}:${tokenA?.address}`;
		if (memo[key]) return memo;
		// eslint-disable-next-line
		// @ts-ignore
		memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA];
		return memo;
	}, {});

	return Object.keys(keyed).map(key => keyed[key]);
}
