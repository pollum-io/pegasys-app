import { TokenInfo, TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { Signer } from "ethers";
import { SYS_LOGO } from "helpers/consts";
import {
	EMPTY_TOKEN_LIST,
	INITIAL_TOKEN_LIST_STATE,
	NEW_TOKEN_LIST_STATE,
	tokenListCache,
} from "helpers/tokenListHelpers";
import { useWallet } from "hooks";
import { getTokenListByUrl } from "networks";
import React, { createContext, useMemo, useState, useEffect } from "react";
import { ListsState, TokenAddressMap, WrappedTokenInfo } from "types";
import { getBalanceOfSingleCall, getProviderBalance } from "utils";

interface ITokensListManageContext {
	tokenListManageState: ListsState;
	UseSelectedListUrl: () => string[] | undefined;
	UseSelectedTokenList: () => TokenAddressMap;
	removeListFromSelectedListArray: (listUrl: string) => void;
}

interface ITokenInfoWithBalance extends TokenInfo {
	balance: string;
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

	const { isConnected, provider, walletAddress, currentNetworkChainId } =
		useWallet();

	const fetchAndFulfilledTokenListManage = async (listUrl: string) => {
		const tokenListResponse = await getTokenListByUrl(listUrl);

		const currentList = tokenListManageState?.byUrl[listUrl]?.current;
		const loadingRequestId =
			tokenListManageState?.byUrl[listUrl]?.loadingRequestId;

		if (!currentList) {
			// eslint-disable-next-line
			setTokenListManageState(prevState => ({
				...((prevState.byUrl[listUrl] = {
					...prevState?.byUrl[listUrl],
					current: tokenListResponse?.response as TokenList,
					error: null,
					loadingRequestId: tokenListResponse?.id as string,
					pendingUpdate: null,
				}),
				prevState),
			}));
		}

		if (
			currentList &&
			(loadingRequestId === "" || loadingRequestId === tokenListResponse?.id)
		) {
			// eslint-disable-next-line
			setTokenListManageState(prevState => ({
				...((prevState.byUrl[listUrl] = {
					...prevState?.byUrl[listUrl],
					loadingRequestId: null,
					error: null,
					current: currentList,
					pendingUpdate: tokenListResponse?.response as TokenList,
				}),
				prevState),
			}));
		}

		return tokenListResponse;
	};

	const listToTokenMap = async (list: TokenList): Promise<TokenAddressMap> => {
		const verifyCurrentList = tokenListCache?.get(list);

		if (verifyCurrentList && !isConnected) return verifyCurrentList;

		const SYSToken: TokenInfo = {
			...list.tokens.find(token => token.symbol === "WSYS"),
			name: "Syscoin",
			symbol: "SYS",
			logoURI: SYS_LOGO,
		} as TokenInfo;

		const listWithAllTokens = [...list.tokens, SYSToken];

		if (!isConnected || !provider) {
			const mapAroundList = listWithAllTokens.reduce<TokenAddressMap>(
				(tokenMap, tokenInfo) => {
					const tokenInfoWithBalance = {
						...tokenInfo,
						balance: "0",
					};

					const token = new WrappedTokenInfo(tokenInfoWithBalance);

					if (tokenMap[token.chainId][token.address] !== undefined)
						console.log(
							"Duplicated token",
							tokenMap[token.chainId][token.address]
						);
					return {
						...tokenMap,
						[token.chainId]: {
							...tokenMap[token.chainId],
							[token.address]: token,
						},
					};
				},
				{ ...EMPTY_TOKEN_LIST }
			);

			tokenListCache?.set(list, mapAroundList);

			return mapAroundList;
		}

		const { providerBalanceFormattedValue, validatedAddress } =
			await getProviderBalance(provider, walletAddress);

		const listWithBalances = await Promise.all(
			listWithAllTokens.map(async token => {
				if (token.symbol === "SYS") {
					return {
						...token,
						balance: providerBalanceFormattedValue,
					};
				}

				if (Number(token.chainId === Number(currentNetworkChainId))) {
					const getTokenBalance = await getBalanceOfSingleCall(
						token.address,
						validatedAddress as string,
						provider as Signer,
						token.decimals
					);

					return {
						...token,
						balance: getTokenBalance,
					} as ITokenInfoWithBalance;
				}

				return {
					...token,
					balance: "0",
				} as ITokenInfoWithBalance;
			})
		);

		const mapAroundList = listWithBalances.reduce<TokenAddressMap>(
			(tokenMap, tokenInfo) => {
				const token = new WrappedTokenInfo(tokenInfo);

				if (tokenMap[token.chainId][token.address] !== undefined)
					console.log(
						"Duplicated token",
						tokenMap[token.chainId][token.address]
					);
				return {
					...tokenMap,
					[token.chainId]: {
						...tokenMap[token.chainId],
						[token.address]: token,
					},
				};
			},
			{ ...EMPTY_TOKEN_LIST }
		);

		tokenListCache?.set(list, mapAroundList);

		return mapAroundList;
	};

	const useTokenList = (urls: string[] | undefined): TokenAddressMap => {
		const lists = tokenListManageState.byUrl;

		const tokenList = {} as {
			[chainId: string]: { [tokenAddress: string]: WrappedTokenInfo };
		};

		const formattedUrls = ([] as string[]).concat(urls || []);

		formattedUrls.forEach(url => {
			const currentUrl = lists[url]?.current;

			if (url && currentUrl) {
				try {
					listToTokenMap(currentUrl).then(data => {
						// eslint-disable-next-line
						for (const [chainId, tokens] of Object.entries(data)) {
							tokenList[chainId] = tokenList[chainId] || {};

							tokenList[chainId] = {
								...tokenList[chainId],
								...tokens,
							};
						}
					});
				} catch (error) {
					console.log("Could not show token list due to error", error);
				}
			}
		});
		return tokenList as TokenAddressMap;
	};

	const UseSelectedListUrl = (): string[] | undefined =>
		([] as string[]).concat(tokenListManageState?.selectedListUrl || []);

	const UseSelectedTokenList = (): TokenAddressMap =>
		useTokenList(UseSelectedListUrl());

	const removeListFromSelectedListArray = (listUrl: string) => {
		setTokenListManageState(prevState => ({
			...prevState,
			...prevState?.selectedListUrl?.filter(
				listValues => listValues !== listUrl
			),
		}));
	};

	useEffect(() => {
		if (!tokenListManageState?.byUrl) return;
		Object.keys(tokenListManageState?.byUrl).forEach(url =>
			fetchAndFulfilledTokenListManage(url)
		);
	}, [tokenListManageState?.byUrl]);

	useEffect(() => {
		UseSelectedTokenList();
	}, [tokenListManageState, isConnected, walletAddress, currentNetworkChainId]);

	console.log("listCache", tokenListCache);

	const tokensListManageProviderValue = useMemo(
		() => ({
			tokenListManageState,
			UseSelectedListUrl,
			UseSelectedTokenList,
			removeListFromSelectedListArray,
		}),
		[tokenListManageState]
	);

	return (
		<TokensListManageContext.Provider value={tokensListManageProviderValue}>
			{children}
		</TokensListManageContext.Provider>
	);
};
