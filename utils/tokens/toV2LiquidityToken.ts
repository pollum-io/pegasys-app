import { ChainId, Pair, Token } from "@pollum-io/pegasys-sdk";
import { WrappedTokenInfo } from "types";

export function toV2LiquidityToken(
	[tokenA, tokenB]: [WrappedTokenInfo, Token],
	chainId: ChainId
) {
	if (!tokenA || !tokenB || tokenA.chainId !== chainId) return null;

	return new Token(
		tokenA.chainId,
		Pair.getAddress(tokenA, tokenB, chainId),
		18,
		"PLP",
		"Pegasys LP Token"
	);
}
