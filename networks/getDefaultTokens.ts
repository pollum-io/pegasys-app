import { TokenList } from "@pollum-io/syscoin-tokenlist-sdk";

const getDefaultTokens = (
	currentNetworkConnected: number
): Promise<TokenList> => {
	const isSyscoinTestnet = currentNetworkConnected === 5700;

	return fetch(
		isSyscoinTestnet
			? "https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/tanembaum.tokenlist.json"
			: "https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/pegasys.tokenlist.json"
	).then(res => res.json());
};
export { getDefaultTokens };
