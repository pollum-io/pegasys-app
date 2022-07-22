import { ITokenInfoBalance, WrappedTokenInfo } from "types";

export const transformTokenType = (
	tokenInformed: ITokenInfoBalance | any
): WrappedTokenInfo[] | WrappedTokenInfo => new WrappedTokenInfo(tokenInformed);
