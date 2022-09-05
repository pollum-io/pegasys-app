import { Trade } from "@pollum-io/pegasys-sdk";

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
export function involvesAddress(
	trade: Trade,
	checksummedAddress: string
): boolean {
	return (
		trade.route.path.some(token => token.address === checksummedAddress) ||
		trade.route.pairs.some(
			pair => pair.liquidityToken.address === checksummedAddress
		)
	);
}
