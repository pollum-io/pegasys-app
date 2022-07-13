// import {
// 	TokenAmount,
// 	Pair,
// 	Currency,
// 	Chain,
// 	Token,
// } from "@pollum-io/pegasys-sdk";
// import { useMemo } from "react";
// // import pegasysAbi from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/interfaces/IPegasysPair.sol/IPegasysPair.json";
// import { getMultiCall, wrappedCurrency } from "utils";
// // import { Interface } from "@ethersproject/abi";
// import { useWallet } from "hooks";

// const PAIR_INTERFACE = new Interface(pegasysAbi);

// export enum PairState {
// 	LOADING,
// 	NOT_EXISTS,
// 	EXISTS,
// 	INVALID,
// }

// export function usePairs(
// 	currencies: [Currency | undefined, Currency | undefined][]
// ): [PairState, Pair | null][] {
// 	const { chain, walletAddress, provider } = useWallet();

// 	const tokens = useMemo(
// 		() =>
// 			currencies.map(([currencyA, currencyB]) => [
// 				wrappedCurrency(currencyA, chain),
// 				wrappedCurrency(currencyB, chain),
// 			]),
// 		[chain, currencies]
// 	);

// const pairAddresses = useMemo(
// 	() =>
// 		tokens.map(([tokenA, tokenB]) =>
// 			Pair.getAddress(tokenA as Token, tokenB as Token, chain || Chain.NEVM)
// 		),
// 	[tokens, chain]
// );
// // eslint-disable-next-line
// console.log("tokens: ", currencies);

// const results = getMultiCall(
// 	pairAddresses,
// 	walletAddress,
// 	provider,
// 	"getReserves"
// );
// // eslint-disable-next-line
// console.log("MULTI CALL RESULT: ", results);

// return useMemo(
// 	() =>
// 		results.map((result, i) => {
// 			const { result: reserves, loading } = result;
// 			const tokenA = tokens[i][0];
// 			const tokenB = tokens[i][1];

// 			if (loading) return [PairState.LOADING, null];
// 			if (!tokenA || !tokenB || tokenA.equals(tokenB))
// 				return [PairState.INVALID, null];
// 			if (!reserves) return [PairState.NOT_EXISTS, null];
// 			const { reserve0, reserve1 } = reserves;
// 			const [token0, token1] = tokenA.sortsBefore(tokenB)
// 				? [tokenA, tokenB]
// 				: [tokenB, tokenA];
// 			return [
// 				PairState.EXISTS,
// 				new Pair(
// 					new TokenAmount(token0, reserve0.toString()),
// 					new TokenAmount(token1, reserve1.toString()),
// 					chain || Chain.NEVM
// 				),
// 			];
// 		}),
// 	[results, tokens, chain]
// );
// }

// export function usePair(
// 	tokenA?: Currency,
// 	tokenB?: Currency
// ): [PairState, Pair | null] {
// 	return usePairs([[tokenA, tokenB]])[0];
// }
