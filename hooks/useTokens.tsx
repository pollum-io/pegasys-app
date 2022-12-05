import { TokensContext } from "contexts";
import { useContext } from "react";

export function useTokens() {
	return useContext(TokensContext);
}
