import { TokenInfo } from "@pollum-io/syscoin-tokenlist-sdk";
import { Token } from "@pollum-io/pegasys-sdk";

export interface ITokenInfoBalance extends TokenInfo {
	balance: string | Promise<string>;
	id?: number;
}

export class WrappedTokenInfo extends Token {
	public readonly tokenInfo: ITokenInfoBalance;

	constructor(tokenInfo: ITokenInfoBalance) {
		super(
			tokenInfo.chainId,
			tokenInfo.address,
			tokenInfo.decimals,
			tokenInfo.symbol,
			tokenInfo.name
		);
		this.tokenInfo = tokenInfo;
		this.tokenInfo.id = tokenInfo.id;
	}

	public get logoURI(): string | undefined {
		return this.tokenInfo.logoURI;
	}

	public get balance(): string | Promise<string> {
		return this.tokenInfo.balance;
	}

	public get id(): number | undefined {
		return this.tokenInfo.id;
	}
}
