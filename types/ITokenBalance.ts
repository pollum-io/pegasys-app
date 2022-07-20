import { TokenInfo } from "@pollum-io/syscoin-tokenlist-sdk";
import { Token } from "@pollum-io/pegasys-sdk";

export class WrappedTokenInfo extends Token {
	public readonly tokenInfo: TokenInfo;

	constructor(tokenInfo: TokenInfo) {
		super(
			tokenInfo.chainId,
			tokenInfo.address,
			tokenInfo.decimals,
			tokenInfo.symbol,
			tokenInfo.name
		);
		this.tokenInfo = tokenInfo;
	}

	public get logoURI(): string | undefined {
		return this.tokenInfo.logoURI;
	}
}
export interface ITokenBalance extends WrappedTokenInfo {
	balance: string;
}

export interface ITokenBalanceWithId extends ITokenBalance {
	id: number;
}
