import { TokenList, TokenInfo } from "@pollum-io/syscoin-tokenlist-sdk";
import { Token } from "@pollum-io/pegasys-sdk";

export class WrappedTokenInfo extends Token {
	public readonly tokenInfo: TokenInfo;

	public readonly tags: TagInfo[];

	constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
		super(
			tokenInfo.chainId,
			tokenInfo.address,
			tokenInfo.decimals,
			tokenInfo.symbol,
			tokenInfo.name
		);
		this.tokenInfo = tokenInfo;
		this.tags = tags;
	}

	public get logoURI(): string | undefined {
		return this.tokenInfo.logoURI;
	}
}

const getDefaultTokens = (): Promise<TokenList> =>
	fetch(
		process.env.NEXT_PUBLIC_ENV === "production"
			? "https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/pegasys.tokenlist.json"
			: "https://raw.githubusercontent.com/Pollum-io/pegasys-tokenlists/master/tanembaum.tokenlist.json"
	).then(res => res.json());

export { getDefaultTokens };
