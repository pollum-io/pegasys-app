import { TokenAmount, Pair, Token, ChainId } from "@pollum-io/pegasys-sdk";
import { getMultiCall, wrappedCurrency } from "utils";
import { IWalletHookInfos } from "types";
import { UseTokensPairSorted } from "./useTokensPairSorted";

export enum PairState {
	LOADING,
	NOT_EXISTS,
	EXISTS,
	INVALID,
}

export async function usePairs(
	currencies: [Token, Token][],
	walletInfos: IWalletHookInfos
): Promise<[PairState, Pair | null][]> {
	const { chainId, walletAddress, provider } = walletInfos;

	if (chainId === ChainId.ROLLUX) {
		const pairAddresses = currencies.map(([tokenA, tokenB]) =>
			tokenA && tokenB && !tokenA.equals(tokenB)
				? Pair.getAddress(tokenA, tokenB, chainId)
				: undefined
		);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const results: any = await getMultiCall(
			pairAddresses as string[],
			walletAddress,
			provider,
			"getReserves"
		);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return results.map((result: any, i: number) => {
			if (!currencies[i]) return [PairState.INVALID, null];

			// eslint-disable-next-line
			const reserve0 = result?._reserve0;
			// eslint-disable-next-line
			const reserve1 = result?._reserve1;

			const [token0, token1] = UseTokensPairSorted([
				currencies[i][0] as Token,
				currencies[i][1] as Token,
			]);

			return [
				PairState.EXISTS,
				new Pair(
					new TokenAmount(token0, reserve0 ? reserve0?.toString() : "1"),
					new TokenAmount(token1, reserve1 ? reserve1?.toString() : "1"),
					chainId
				),
			];
		});
	}

	const tokens = currencies.map(([currencyA, currencyB]) => [
		wrappedCurrency(currencyA, chainId),
		wrappedCurrency(currencyB, chainId),
	]);

	const pairAddresses = tokens.map(([tokenA, tokenB]) =>
		tokenA && tokenB && !tokenA.equals(tokenB)
			? Pair.getAddress(tokenA, tokenB, chainId)
			: undefined
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const results: any = await getMultiCall(
		pairAddresses as string[],
		walletAddress,
		provider,
		"getReserves"
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return results.map((result: any, i: number) => {
		if (!tokens[i]) return [PairState.INVALID, null];

		// eslint-disable-next-line
		const reserve0 = result?._reserve0;
		// eslint-disable-next-line
		const reserve1 = result?._reserve1;

		const [token0, token1] = UseTokensPairSorted([
			tokens[i][0] as Token,
			tokens[i][1] as Token,
		]);

		return [
			PairState.EXISTS,
			new Pair(
				new TokenAmount(token0, reserve0 ? reserve0?.toString() : "1"),
				new TokenAmount(token1, reserve1 ? reserve1?.toString() : "1"),
				chainId
			),
		];
	});
}
