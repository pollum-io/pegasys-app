import { TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { PEGASYS_LIST, TANENBAUM_LIST, ROLLUX_LIST } from "helpers/consts";
import { IGetTokenListByUrl } from "types";
import { returnConvertedUrl } from "utils/returnConvertedUrl";

const getDefaultTokens = (
	currentNetworkConnected: number
): Promise<TokenList> => {
	let tokenListUrlByChain: string;

	switch (currentNetworkConnected) {
		case 57:
			tokenListUrlByChain = PEGASYS_LIST;
			break;
		case 5700:
			tokenListUrlByChain = TANENBAUM_LIST;
			break;
		case 2814:
			tokenListUrlByChain = ROLLUX_LIST;
			break;
		default:
			tokenListUrlByChain = PEGASYS_LIST;
	}

	return fetch(tokenListUrlByChain).then(res => res.json());
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
