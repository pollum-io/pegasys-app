import { ChainId, Pair, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { UseTokensPairSorted } from "hooks";
import { wrappedCurrency } from "utils";

import {
	IPairServicesDoesPairExists,
	IPairServicesGetPairReserve,
	PairState,
} from "pegasys-services/dto";
import {
	ContractFramework,
	WalletFramework,
} from "pegasys-services/frameworks";

class PairServices {
	static async getPairs(
		pairs: Array<[Token | undefined, Token | undefined]>,
		currentChainId?: ChainId
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
		chainId?: ChainId
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
}

export default PairServices;
