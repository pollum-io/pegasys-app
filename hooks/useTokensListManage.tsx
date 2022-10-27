import { TokensListManageContext } from "contexts";
import { useContext } from "react";

export function useTokensListManage() {
	return useContext(TokensListManageContext);
}
