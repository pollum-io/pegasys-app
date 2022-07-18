import {
	TokenAmount,
	Pair,
	Currency,
	ChainId,
	Token,
} from "@pollum-io/pegasys-sdk";
import { getMultiCall } from "utils";
import { IWalletHookInfos } from "types";

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

	// console.log("PAIR ADDRESS: ", pairAddresses);

	const results: any[] = await getMultiCall(
		pairAddresses,
		walletInfos.walletAddress,
		walletInfos.provider,
		"getReserves"
	);
	// eslint-disable-next-line
	// console.log("MULTI CALL RESULT: ", results);

	return results?.map((result: any, i: number) => {
		const { _reserve0, _reserve1 } = result;

		return [
			PairState.EXISTS,
			new Pair(
				new TokenAmount(tokens[tokens.length - 1][0], _reserve0.toString()),
				new TokenAmount(tokens[tokens.length - 1][1], _reserve1.toString()),
				ChainId.TANENBAUM
			),
		];
	});
}
