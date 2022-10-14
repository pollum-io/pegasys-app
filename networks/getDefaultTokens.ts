import { TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { IGetTokenListByUrl } from "types";
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
): Promise<IGetTokenListByUrl | undefined> => {
	const requestId = Math.floor(Math.random() * 10).toString();
	const urlConverted = returnConvertedUrl(listUrl);

	const urlFetchedReponse = await fetch(urlConverted[0]);

	if (!urlFetchedReponse.ok) {
		console.log(`Failed to download list ${listUrl}`);
	}

	const urlFetchedReponseJson = await urlFetchedReponse.json();

	return {
		response: urlFetchedReponseJson,
		id: requestId,
	};
};

export { getDefaultTokens, getTokenListByUrl };
