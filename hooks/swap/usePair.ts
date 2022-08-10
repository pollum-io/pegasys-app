import { TokenAmount, Pair, Token } from "@pollum-io/pegasys-sdk";
import { getMultiCall, wrappedCurrency } from "utils";
import { IWalletHookInfos } from "types";

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
		if (!result) return [PairState.NOT_EXISTS, null];

		const { _reserve0, _reserve1 } = result;

		const tokenA: Token = tokens[i][0] as Token;
		const tokenB: Token = tokens[i][1] as Token;

		const [token0, token1] = tokenA?.sortsBefore(tokenB)
			? [tokenA, tokenB]
			: [tokenB, tokenA];

		return [
			PairState.EXISTS,
			new Pair(
				new TokenAmount(token0, _reserve0?.toString()),
				new TokenAmount(token1, _reserve1?.toString()),
				chainId
			),
		];
	});
}
