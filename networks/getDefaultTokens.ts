import { TokenList } from "@pollum-io/syscoin-tokenlist-sdk";

const getDefaultTokens = (): Promise<TokenList> =>
	fetch(
		process.env.NEXT_PUBLIC_ENV === "production"
			? "https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/pegasys.tokenlist.json"
			: "https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/tanembaum.tokenlist.json"
	).then(res => res.json());

export { getDefaultTokens };
