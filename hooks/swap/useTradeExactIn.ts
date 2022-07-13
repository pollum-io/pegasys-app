import {
	Currency,
	Pair,
	// Token,
	// Trade,
	// ChainId,
	// WSYS,
} from "@pollum-io/pegasys-sdk";
// import flatMap from "lodash.flatmap";
// import { useMemo } from "react";

// import { useWallet, usePairs } from "hooks";

import { tryParseAmount } from "utils";

// const PSYS: { [chainId in ChainId]: Token } = {
// 	[ChainId.TANENBAUM]: new Token(
// 		ChainId.TANENBAUM,
// 		"0x81821498cD456c9f9239010f3A9F755F3A38A778",
// 		18,
// 		"PSYS",
// 		"Pegasys"
// 	),
// 	[ChainId.NEVM]: new Token(
// 		ChainId.NEVM,
// 		"0xe18c200a70908c89ffa18c628fe1b83ac0065ea4",
// 		18,
// 		"PSYS",
// 		"Pegasys"
// 	),
// };
// const USDT: { [chainId in ChainId]: Token } = {
// 	[ChainId.TANENBAUM]: new Token(
// 		ChainId.TANENBAUM,
// 		"0x94c80b500C825F3030411a987b7EBb0A8f4adEa0",
// 		6,
// 		"USDT",
// 		"Tether USD"
// 	),
// 	[ChainId.NEVM]: new Token(
// 		ChainId.NEVM,
// 		"0x922D641a426DcFFaeF11680e5358F34d97d112E1",
// 		6,
// 		"USDT",
// 		"Tether USD"
// 	),
// };

// const DAI: { [chainId in ChainId]: Token } = {
// 	[ChainId.TANENBAUM]: new Token(
// 		ChainId.TANENBAUM,
// 		"0x2d2e508c8056c3D92745dC2C39E5Cc316de79C0F",
// 		18,
// 		"DAI",
// 		"Dai Stablecoin"
// 	),
// 	[ChainId.NEVM]: new Token(
// 		ChainId.NEVM,
// 		"0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73",
// 		18,
// 		"DAI",
// 		"Dai Stablecoin"
// 	),
// };

// const USDC: { [chainId in ChainId]: Token } = {
// 	[ChainId.TANENBAUM]: new Token(
// 		ChainId.TANENBAUM,
// 		"0x510A5D64cCFBd50Ec42Fa400601a0fedf1d452bC",
// 		6,
// 		"USDC",
// 		"USD Coin"
// 	),
// 	[ChainId.NEVM]: new Token(
// 		ChainId.NEVM,
// 		"0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c",
// 		6,
// 		"USDC",
// 		"USD Coin"
// 	),
// };

// const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
// 	[ChainId.TANENBAUM]: [WSYS[ChainId.TANENBAUM], PSYS[ChainId.TANENBAUM]],
// 	[ChainId.NEVM]: [
// 		WSYS[ChainId.NEVM],
// 		PSYS[ChainId.NEVM],
// 		USDT[ChainId.NEVM],
// 		DAI[ChainId.NEVM],
// 		USDC[ChainId.NEVM],
// 	],
// };

// const CUSTOM_BASES: {
// 	[chainId in ChainId]?: { [tokenAddress: string]: Token[] };
// } = {
// 	[ChainId.NEVM]: {},
// };

// function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
// 	const { chain } = useWallet();

// 	console.log({ currencyA, currencyB, chain });

// 	const bases: Token[] = chain ? BASES_TO_CHECK_TRADES_AGAINST[chain] : [];

// 	const [tokenA, tokenB] = [
// 		wrappedCurrency(currencyA, chain),
// 		wrappedCurrency(currencyB, chain),
// 	];

// 	console.log("tokenA e B: ", { tokenA, tokenB });

// 	const basePairs: [Token, Token][] = useMemo(
// 		() =>
// 			flatMap(bases, (base): [Token, Token][] =>
// 				bases.map(otherBase => [base, otherBase])
// 			).filter(([t0, t1]) => t0.address !== t1.address),
// 		[bases]
// 	);

// 	const allPairCombinations: [Token, Token][] = useMemo(
// 		() =>
// 			tokenA && tokenB
// 				? [
// 						// the direct pair
// 						[tokenA, tokenB],
// 						// token A against all bases
// 						...bases.map((base): [Token, Token] => [tokenA, base]),
// 						// token B against all bases
// 						...bases.map((base): [Token, Token] => [tokenB, base]),
// 						// each base against all bases
// 						...basePairs,
// 				  ]
// 						.filter((tokens): tokens is [Token, Token] =>
// 							Boolean(tokens[0] && tokens[1])
// 						)
// 						.filter(([t0, t1]) => t0.address !== t1.address)
// 						.filter(([tokenA, tokenB]) => {
// 							if (!chain) return true;
// 							const customBases = CUSTOM_BASES[chain];
// 							if (!customBases) return true;

// 							const customBasesA: Token[] | undefined =
// 								customBases[tokenA.address];
// 							const customBasesB: Token[] | undefined =
// 								customBases[tokenB.address];

// 							if (!customBasesA && !customBasesB) return true;

// 							if (
// 								customBasesA &&
// 								!customBasesA.find(base => tokenB.equals(base))
// 							)
// 								return false;
// 							if (
// 								customBasesB &&
// 								!customBasesB.find(base => tokenA.equals(base))
// 							)
// 								return false;

// 							return true;
// 						})
// 				: [],
// 		[tokenA, tokenB, bases, basePairs, chain]
// 	);

// 	const allPairs = usePairs(allPairCombinations);
// 	console.log("combinations: ", allPairCombinations);
// 	console.log("PAIRS: ", allPairs);

// only pass along valid pairs, non-duplicated pairs
// return useMemo(
// 	() =>
// 		Object.values(
// 			allPairs
// 				// filter out invalid pairs
// 				.filter((result): result is [PairState.EXISTS, Pair] =>
// 					Boolean(result[0] === PairState.EXISTS && result[1])
// 				)
// 				// filter out duplicated pairs
// 				.reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
// 					memo[curr.liquidityToken.address] =
// 						memo[curr.liquidityToken.address] ?? curr;
// 					return memo;
// 				}, {})
// 		),
// 	[allPairs]
// );
// }

export function useTradeExactIn(
	currencyIn: Currency,
	valueIn: string,
	currencyOut: Currency,
	valueOut: string,
	chain: number
): Trade | null {
	const [currencyAmountIn, currencyAmountOut] = [
		tryParseAmount(valueIn, currencyIn),
		tryParseAmount(valueOut, currencyOut),
	];

	const allowedPairs = [
		{
			liquidityToken: {
				address: "0x8f7E525197a55F2166C13Cbb32739417075130D7",
				chainId: chain,
				decimals: 18,
				name: "Pegasys LP Token",
				symbol: "PLP",
			},
			tokenAmounts: [currencyAmountIn, currencyAmountOut],
		} as Pair,
	];
	return allowedPairs;
	// return Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
	// 	maxHops: 3,
	// 	maxNumResults: 1,
	// })[0];
}
