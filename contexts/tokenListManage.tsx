import { TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { INITIAL_TOKEN_LIST_STATE } from "helpers/tokenListHelpers";
import { getTokenListByUrl } from "networks";
import React, { createContext, useMemo, useState, useEffect } from "react";
import { ListsState } from "types";

interface ITokensListManageContext {
	tokenListManageState: ListsState;
}

export const TokensListManageContext = createContext(
	{} as ITokensListManageContext
);

export const TokensListManageProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [tokenListManageState, setTokenListManageState] = useState<ListsState>(
		INITIAL_TOKEN_LIST_STATE
	);

	const fetchAndFulfilledTokenListManage = async (listUrl: string) => {
		const tokenListResponse = await getTokenListByUrl(listUrl);

		const currentList = tokenListManageState?.byUrl[listUrl]?.current;
		const loadingRequestId =
			tokenListManageState?.byUrl[listUrl]?.loadingRequestId;

		if (!currentList) {
			// eslint-disable-next-line
			setTokenListManageState(prevState => ({
				...prevState,
				...(prevState.byUrl[listUrl] = {
					...prevState?.byUrl[listUrl],
					current: tokenListResponse?.response as TokenList,
					error: null,
					loadingRequestId: tokenListResponse?.id as string,
					pendingUpdate: null,
				}),
			}));
		} else if (
			loadingRequestId === "" ||
			loadingRequestId === tokenListResponse?.id
		) {
			// eslint-disable-next-line
			setTokenListManageState(prevState => ({
				...prevState,
				...(prevState.byUrl[listUrl] = {
					...prevState?.byUrl[listUrl],
					loadingRequestId: null,
					error: null,
					current: currentList,
					pendingUpdate: tokenListResponse?.response as TokenList,
				}),
			}));
		}

		return tokenListResponse;
	};

	useEffect(() => {
		if (!tokenListManageState?.byUrl) return;
		Object.keys(tokenListManageState?.byUrl).forEach(url =>
			fetchAndFulfilledTokenListManage(url)
		);
	}, [tokenListManageState?.byUrl]);

	console.log("tokenListManageState", tokenListManageState);

	const tokensListManageProviderValue = useMemo(
		() => ({
			tokenListManageState,
		}),
		[tokenListManageState]
	);

	return (
		<TokensListManageContext.Provider value={tokensListManageProviderValue}>
			{children}
		</TokensListManageContext.Provider>
	);
};
