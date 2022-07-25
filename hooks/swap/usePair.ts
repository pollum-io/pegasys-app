import { TokenAmount, Pair, ChainId, Token } from "@pollum-io/pegasys-sdk";
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
		wrappedCurrency(currencyA, chainId as ChainId),
		wrappedCurrency(currencyB, chainId as ChainId),
	]);

	const pairAddresses = tokens.map(([tokenA, tokenB]) =>
		tokenA && tokenB && !tokenA.equals(tokenB)
			? Pair.getAddress(tokenA, tokenB, chainId || ChainId.NEVM)
			: undefined
	);

	const results: any = await getMultiCall(
		pairAddresses as string[],
		walletAddress,
		provider,
		"getReserves"
	);

	console.log("results", results);

	return results.map((result: any, i: number) => {
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
				chainId ? (chainId as ChainId) : ChainId.NEVM
			),
		];
	});
}
