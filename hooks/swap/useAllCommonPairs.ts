import { Currency, Pair, Token, ChainId } from "@pollum-io/pegasys-sdk";
import flatMap from "lodash.flatmap";
import { BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from "helpers/consts";
import { IWalletHookInfos } from "types";
import { PairState, usePairs } from "./usePair";

export async function useAllCommonPairs(
	currencyA: Currency,
	currencyB: Currency,
	walletInfos: IWalletHookInfos
): Promise<Pair[]> {
	const bases: Token[] = walletInfos.chainId
		? BASES_TO_CHECK_TRADES_AGAINST[ChainId.TANENBAUM]
		: [];

	const [tokenA, tokenB] = [
		currencyA &&
			new Token(
				ChainId.TANENBAUM,
				currencyA?.address,
				currencyA?.decimals,
				currencyA?.symbol,
				currencyA?.name
			),
		currencyB &&
			new Token(
				ChainId.TANENBAUM,
				currencyB?.address,
				currencyB?.decimals,
				currencyB?.symbol,
				currencyB?.name
			),
	];

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
						// if (!walletInfos.chainId) return true;
						const customBases = CUSTOM_BASES[ChainId.TANENBAUM];
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
