import {
	TokenAmount,
	Pair,
	Currency,
	ChainId,
	Token,
} from "@pollum-io/pegasys-sdk";
import { useMemo } from "react";
import { getMultiCall, wrappedCurrency } from "utils";
import { IWalletHookInfos } from "types";

import IPegasysPairABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/interfaces/IPegasysPair.sol/IPegasysPair.json";

export enum PairState {
	LOADING,
	NOT_EXISTS,
	EXISTS,
	INVALID,
}

export async function usePairs(
	currencies: [Currency | undefined, Currency | undefined][],
	walletInfos: IWalletHookInfos
): Promise<[PairState, Pair | null | any][]> {
	const tokens = currencies;

	const pairAddresses = tokens
		.map(([tokenA, tokenB]) => {
			if (tokenA.chainId && tokenB.chainId) {
				return Pair.getAddress(
					tokenA as Token,
					tokenB as Token,
					ChainId.TANENBAUM
				);
			}
			return undefined;
		})
		.filter(pair => pair !== undefined);

	console.log("PAIR ADDRESS: ", pairAddresses);

	const results: any = await getMultiCall(
		pairAddresses as string[],
		walletInfos.walletAddress,
		walletInfos.provider,
		"getReserves",
		IPegasysPairABI
	);
	// eslint-disable-next-line
	console.log("MULTI CALL RESULT: ", results);

	return results?.map((result: any, i: number) => {
		const { result: reserves, loading } = result;
		const tokenA = tokens[i][0];
		const tokenB = tokens[i][1];

		if (loading) return [PairState.LOADING, null];
		if (!tokenA || !tokenB || tokenA.equals(tokenB))
			return [PairState.INVALID, null];
		if (!reserves) return [PairState.NOT_EXISTS, null];
		const { reserve0, reserve1 } = reserves;
		const [token0, token1] = tokenA.sortsBefore(tokenB)
			? [tokenA, tokenB]
			: [tokenB, tokenA];
		return [
			PairState.EXISTS,
			new Pair(
				new TokenAmount(token0, reserve0.toString()),
				new TokenAmount(token1, reserve1.toString()),
				walletInfos.chainId || ChainId.NEVM
			),
		];
	});
}
