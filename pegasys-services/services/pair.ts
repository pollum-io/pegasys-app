import { ChainId, Pair, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { UseTokensPairSorted } from "hooks";
import { wrappedCurrency } from "utils";

import {
	IGetMixedTokenPairs,
	IPairServicesDoesPairExists,
	IPairServicesGetPairReserve,
	ITokensMixed,
	PairState,
} from "pegasys-services/dto";
import {
	ContractFramework,
	WalletFramework,
} from "pegasys-services/frameworks";
import { WrappedTokenInfo } from "types";

import { BASES_TO_TRACK_LIQUIDITY_FOR } from "helpers/consts";
import flatMap from "lodash.flatmap";

class PairServices {
	static async getPairs(
		pairs: Array<[Token | undefined, Token | undefined]>,
		currentChainId?: ChainId | null
	) {
		const chainId = currentChainId ?? ChainId.NEVM;

		const tokens = pairs.map(([currencyA, currencyB]) => [
			currencyA ? wrappedCurrency(currencyA, chainId) : undefined,
			currencyB ? wrappedCurrency(currencyB, chainId) : undefined,
		]);

		const pairAddresses = tokens.map(([tokenA, tokenB]) => [
			this.getPairAddress([tokenA, tokenB], currentChainId),
			tokenA,
			tokenB,
		]);

		const res: Array<[PairState, Pair | undefined]> = await Promise.all(
			pairAddresses.map(async ([pairAddress, tokenA, tokenB]) => {
				if (!pairAddress) {
					return [PairState.INVALID, undefined];
				}

				const pairReserve = await this.getPairReserve({
					pairAddress: pairAddress as string,
					tokenA: tokenA as Token,
					tokenB: tokenB as Token,
					chainId,
				});

				if (!pairReserve) {
					return [PairState.NOT_EXISTS, undefined];
				}

				return [PairState.EXISTS, pairReserve];
			})
		);

		return res;
	}

	static getPairAddress(
		tokens: [Token | undefined, Token | undefined],
		chainId?: ChainId | null
	) {
		return tokens[0] && tokens[1] && !tokens[0].equals(tokens[1])
			? Pair.getAddress(tokens[0], tokens[1], chainId ?? ChainId.NEVM)
			: "";
	}

	static async getPairReserve({
		pairContract,
		provider,
		pairAddress,
		tokenA,
		tokenB,
		chainId,
	}: IPairServicesGetPairReserve) {
		const address =
			pairAddress ?? this.getPairAddress([tokenA, tokenB], chainId);

		const doesPairExists = await this.doesPairExists({
			pairAddress: address,
			provider,
		});

		if (!doesPairExists) {
			return undefined;
		}

		const contract =
			pairContract ?? ContractFramework.PairContract({ address, provider });

		const res = await ContractFramework.call({
			contract,
			methodName: "getReserves",
		});

		// eslint-disable-next-line
		const reserve0 = res?._reserve0;
		// eslint-disable-next-line
		const reserve1 = res?._reserve1;

		const [token0, token1] = UseTokensPairSorted([tokenA, tokenB]);

		return new Pair(
			new TokenAmount(token0, reserve0 ? reserve0?.toString() : "1"),
			new TokenAmount(token1, reserve1 ? reserve1?.toString() : "1"),
			chainId ?? ChainId.NEVM
		);
	}

	static async doesPairExists({
		pairAddress,
		provider,
	}: IPairServicesDoesPairExists) {
		const p = provider ?? WalletFramework.getProvider();

		const tokenCode = await p?.getCode(pairAddress);

		if (!tokenCode || tokenCode === "0x") {
			return false;
		}

		return true;
	}

	static getMixedTokenPairs({ chainId, allTokens }: IGetMixedTokenPairs) {
		if (allTokens.length === 0 || !chainId) return [];
		const tokens: ITokensMixed = allTokens.reduce(
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
		];

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
						(BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
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
			chainId === ChainId.NEVM
				? [...generatedPairs, ...allCustomPairs]
				: [...generatedPairs];

		// dedupes pairs of tokens in the combined list
		const keyed = mixPairs?.reduce<{
			[key: string]: [Token, Token];
		}>((memo, [tokenA, tokenB]) => {
			const sorted =
				tokenA instanceof WrappedTokenInfo &&
				tokenA.sortsBefore(tokenB as Token);
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
}

export default PairServices;
