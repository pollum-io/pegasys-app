import { Currency, Pair, Token, ChainId } from "@pollum-io/pegasys-sdk";
import flatMap from "lodash.flatmap";
import {
	BASES_TO_CHECK_TRADES_AGAINST,
	CUSTOM_BASES_PAIRS,
} from "pegasys-services";
import { IWalletHookInfos } from "types";
import { wrappedCurrency } from "utils";
import { PairState, usePairs } from "./usePair";

export async function useAllCommonPairs(
	currencyA: Currency,
	currencyB: Currency,
	walletInfos: IWalletHookInfos
): Promise<Pair[]> {
	const { chainId } = walletInfos;
	if (!currencyA || !currencyB) return [];

	const bases: Token[] = chainId
		? BASES_TO_CHECK_TRADES_AGAINST[chainId as ChainId]
		: [];

	const [tokenA, tokenB] = chainId
		? [
				wrappedCurrency(currencyA, chainId as ChainId),
				wrappedCurrency(currencyB, chainId as ChainId),
		  ]
		: [undefined, undefined];

	const basePairs: [Token, Token][] = flatMap(bases, (base): [Token, Token][] =>
		bases.map(otherBase => [base, otherBase])
	).filter(([t0, t1]) => t0.address !== t1.address);

	const allPairCombinations: [Token, Token][] =
		tokenA && tokenB
			? [
					// the direct pair
					[tokenA, tokenB],
					// token A against all bases
					...bases.map((base): [Token, Token] => [tokenA, base]),
					// token B against all bases
					...bases.map((base): [Token, Token] => [tokenB, base]),
					// each base against all bases
					...basePairs,
			  ]
					.filter((tokens): tokens is [Token, Token] =>
						Boolean(tokens[0] && tokens[1])
					)
					.filter(([t0, t1]) => t0.address !== t1.address)
					.filter(([tokenA, tokenB]) => {
						if (!walletInfos.chainId) return true;
						const customBases = CUSTOM_BASES_PAIRS[chainId as ChainId];
						if (!customBases) return true;

						const customBasesA: Token[] | undefined =
							customBases[tokenA.address];
						const customBasesB: Token[] | undefined =
							customBases[tokenB.address];

						if (!customBasesA && !customBasesB) return true;

						if (customBasesA && !customBasesA.find(base => tokenB.equals(base)))
							return false;
						if (customBasesB && !customBasesB.find(base => tokenA.equals(base)))
							return false;

						return true;
					})
			: [];

	// eslint-disable-next-line
	const allPairs = await usePairs(allPairCombinations, walletInfos);

	// only pass along valid pairs, non-duplicated pairs
	return Object.values(
		allPairs
			// filter out invalid pairs
			.filter((result): result is [PairState.EXISTS, Pair] =>
				Boolean(result[0] === PairState.EXISTS && result[1])
			)
			// filter out duplicated pairs
			.reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
				memo[curr.liquidityToken.address] =
					memo[curr.liquidityToken.address] ?? curr;
				return memo;
			}, {})
	);
}
