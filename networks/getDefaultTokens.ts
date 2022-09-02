import { TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { returnConvertedUrl } from "utils/returnConvertedUrl";

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

const getTokenListByUrl = async (
	listUrl: string
): Promise<TokenList | undefined> => {
	const urlConverted = returnConvertedUrl(listUrl);

	const urlFetchedReponse = await (await fetch(urlConverted[0])).json();

	if (!urlFetchedReponse.ok) {
		console.log(`Failed to download list ${listUrl}`);
	}

	return urlFetchedReponse;
};

export { getDefaultTokens, getTokenListByUrl };
