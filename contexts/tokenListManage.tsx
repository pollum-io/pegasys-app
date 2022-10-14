import { ChainId, Token } from "@pollum-io/pegasys-sdk";
import { TokenInfo, TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { Signer } from "ethers";
import { DEFAULT_TOKEN_LISTS_SELECTED, SYS_LOGO } from "helpers/consts";
import {
	EMPTY_TOKEN_LIST,
	INITIAL_TOKEN_LIST_STATE,
	NEW_TOKEN_LIST_STATE,
	tokenListCache,
} from "helpers/tokenListHelpers";
import { useToasty, useWallet } from "hooks";
import { getTokenListByUrl } from "networks";
import { StringifyOptions } from "querystring";
import React, { createContext, useMemo, useState, useEffect } from "react";
import { ListsState, TokenAddressMap, WrappedTokenInfo } from "types";
import { getBalanceOfSingleCall, getProviderBalance } from "utils";

interface ITokensListManageContext {
	tokenListManageState: ListsState;
	currentCacheListTokensToDisplay: WrappedTokenInfo[];
	UseSelectedListUrl: () => string[] | undefined;
	UseSelectedTokenList: () => Promise<TokenAddressMap>;
	removeListFromListState: (listUrl: string) => void;
	addListToListState: (listUrl: string) => void;
	toggleListByUrl: (listUrl: string, shouldToggle: boolean) => void;
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

	const [currentCacheListTokensToDisplay, setCurrentCacheListTokensToDisplay] =
		useState<WrappedTokenInfo[]>([]);

	const [listToAdd, setListToAdd] = useState<string>("");
	const [listToRemove, setListToRemove] = useState<string>("");

	const { walletAddress, currentNetworkChainId } = useWallet();

	const { toast } = useToasty();

	// UTILS FUNCTIONS TO HANDLE DISPLAY TOKENS STATE //
	const findAndReturnTokensByListUrl = (
		listUrl: string
	): WrappedTokenInfo[] => {
		const getCurrentListCache = tokenListCache?.get(
			tokenListManageState.byUrl[listUrl].current as TokenList
		) as TokenAddressMap;

		if (getCurrentListCache) {
			const transformListObject = Object.assign(getCurrentListCache);

			const findTokensByChain =
				transformListObject[currentNetworkChainId || 57];

			const convertFoundedTokens = Object.values(findTokensByChain).map(
				token => token
			) as WrappedTokenInfo[];

			const convertCurrentListByState = tokenListManageState.byUrl[
				listUrl
			].current?.tokens.map(token => {
				const tokenWithBalance = {
					...token,
					balance: "0",
				};

				return new WrappedTokenInfo(tokenWithBalance);
			}) as WrappedTokenInfo[];

			const filterExistentTokens = convertFoundedTokens.filter(convertTokens =>
				convertCurrentListByState.some(
					stateTokens =>
						String(convertTokens?.tokenInfo?.address) ===
						String(stateTokens?.tokenInfo?.address)
				)
			);

			const verifyIfListHasUnecessaryTokens = filterExistentTokens.findIndex(
				token =>
					token.symbol === "AGEUR" ||
					token.symbol === "MAI" ||
					token.symbol === "QI"
			);

			if (verifyIfListHasUnecessaryTokens !== -1) {
				const unecessaryTokensRemoved = filterExistentTokens.filter(
					token =>
						token.symbol !== "AGEUR" &&
						token.symbol !== "MAI" &&
						token.symbol !== "QI"
				);

				return unecessaryTokensRemoved;
			}
			return filterExistentTokens;
		}

		return [];
	};

	// END UTILS FUNCTIONS TO HANDLE DISPLAY TOKEN STATE //

	// HANDLE FUNCTIONS TO FILL AND MANAGE TOKEN LIST MANAGE STATE AT ALL AND ALSO WEAK MAP LISTS //
	const fetchAndFulfilledTokenListManage = async (listUrl: string) => {
		const tokenListResponse = await getTokenListByUrl(listUrl);

		const currentList = tokenListManageState?.byUrl[listUrl]?.current;
		const loadingRequestId =
			tokenListManageState?.byUrl[listUrl]?.loadingRequestId;

		if (!currentList) {
			setTokenListManageState(prevState => {
				prevState.byUrl[listUrl] = {
					...prevState?.byUrl[listUrl],
					current: tokenListResponse?.response as TokenList,
					error: null,
					loadingRequestId: tokenListResponse?.id as string,
					pendingUpdate: null,
				};
				prevState.selectedListUrl = prevState?.selectedListUrl
					?.filter(list => list !== listUrl)
					.concat(listUrl) as string[];

				return { ...prevState };
			});
		}

		if (
			currentList &&
			(loadingRequestId === "" || loadingRequestId === tokenListResponse?.id)
		) {
			setTokenListManageState(prevState => {
				prevState.byUrl[listUrl] = {
					...prevState?.byUrl[listUrl],
					loadingRequestId: null,
					error: null,
					current: currentList,
					pendingUpdate: tokenListResponse?.response as TokenList,
				};

				return { ...prevState };
			});
		}

		return tokenListResponse;
	};

	const listToTokenMap = async (list: TokenList): Promise<TokenAddressMap> => {
		const verifyCurrentList = tokenListCache?.get(list);

		if (verifyCurrentList) return verifyCurrentList;

		const mapAroundList = list.tokens.reduce<TokenAddressMap>(
			(tokenMap, tokenInfo) => {
				// const token = new WrappedTokenInfo(tokenInfo);

				const transformChain = Number(tokenInfo.chainId) as ChainId;

				if (tokenMap[transformChain][tokenInfo.address] !== undefined)
					console.log(
						"Duplicated token",
						tokenMap[transformChain][tokenInfo.address]
					);

				return {
					...tokenMap,
					[transformChain]: {
						...tokenMap[transformChain],
						[tokenInfo.address]: tokenInfo,
					},
				};
			},
			{ ...EMPTY_TOKEN_LIST }
		);

		tokenListCache?.set(list, mapAroundList);

		return mapAroundList;
	};

	const useTokenList = async (
		urls: string[] | undefined
	): Promise<TokenAddressMap> => {
		const lists = tokenListManageState.byUrl;

		const tokenList = {} as {
			[chainId: string]: { [tokenAddress: string]: WrappedTokenInfo };
		};

		const formattedUrls = ([] as string[]).concat(urls || []);

		await Promise.all(
			formattedUrls.map(async url => {
				const currentUrl = lists[url]?.current;

				if (url && currentUrl) {
					try {
						const dataFromList = await listToTokenMap(currentUrl);

						Object.entries(dataFromList).forEach(([chainId, tokens]) => {
							tokenList[chainId] = tokenList[chainId] || {};

							tokenList[chainId] = {
								...tokenList[chainId],
								...tokens,
							};
						});
					} catch (error) {
						console.log("Could not show token list due to error", error);
					}
				}
			})
		);

		return tokenList as TokenAddressMap;
	};

	const removeListFromListState = (listUrl: string) => {
		setTokenListManageState(prevState => {
			if (prevState.byUrl[listUrl]) delete prevState.byUrl[listUrl];

			const existValueInList = ([] as string[]).concat(
				prevState.selectedListUrl || []
			);
			const findInList = existValueInList.indexOf(listUrl);

			if (findInList !== -1) {
				if (existValueInList?.length === 1) {
					prevState.selectedListUrl = DEFAULT_TOKEN_LISTS_SELECTED;
				} else {
					existValueInList.splice(findInList, 1);
					prevState.selectedListUrl = existValueInList;
				}
			}

			return { ...prevState };
		});

		setListToRemove("");
	};

	const addListToListState = (listUrl: string) => {
		setTokenListManageState(prevState => {
			if (!prevState.byUrl[listUrl]) {
				prevState.byUrl[listUrl] = NEW_TOKEN_LIST_STATE;
			}

			return { ...prevState };
		});

		setListToAdd("");
	};

	const toggleListByUrl = (listUrl: string, shouldToggle: boolean) => {
		setTokenListManageState(prevState => {
			const existingSelectedList = ([] as string[]).concat(
				prevState?.selectedListUrl || []
			);

			if (shouldToggle) {
				existingSelectedList.push(listUrl);

				prevState.selectedListUrl = existingSelectedList;
			} else {
				const elementInListIndex = existingSelectedList.indexOf(listUrl);

				if (elementInListIndex === -1) return { ...prevState };

				if (existingSelectedList?.length === 1) {
					prevState.selectedListUrl = DEFAULT_TOKEN_LISTS_SELECTED;
				} else {
					existingSelectedList.splice(elementInListIndex, 1);
					prevState.selectedListUrl = existingSelectedList;
				}
			}

			if (!prevState.byUrl[listUrl])
				prevState.byUrl[listUrl] = NEW_TOKEN_LIST_STATE;

			return { ...prevState };
		});

		setCurrentCacheListTokensToDisplay([]);
	};

	const UseSelectedListUrl = (): string[] | undefined =>
		([] as string[]).concat(tokenListManageState?.selectedListUrl || []);

	const UseSelectedTokenList = (): Promise<TokenAddressMap> =>
		useTokenList(UseSelectedListUrl());

	// HANDLE FUNCTIONS TO FILL AND MANAGE TOKEN LIST MANAGE STATE AT ALL AND ALSO WEAK MAP LISTS //

	useEffect(() => {
		if (
			Object.keys(tokenListManageState?.byUrl).length === 0 ||
			tokenListManageState.selectedListUrl?.length === 0
		)
			return;

		UseSelectedTokenList();

		Object.keys(tokenListManageState?.byUrl).forEach(url =>
			fetchAndFulfilledTokenListManage(url)
		);
	}, [
		tokenListManageState,
		tokenListManageState.byUrl,
		tokenListManageState.selectedListUrl,
		walletAddress,
		currentNetworkChainId,
	]);

	useEffect(() => {
		if (tokenListManageState.selectedListUrl?.length === 0) return;

		tokenListManageState.selectedListUrl?.map(listUrl => {
			const getListTokens = tokenListCache?.get(
				tokenListManageState.byUrl[listUrl].current as TokenList
			) as TokenAddressMap;

			if (getListTokens && Object.keys(getListTokens)?.length > 0) {
				const transformToChainIdType = Number(
					currentNetworkChainId || 57
				) as ChainId;

				const getTokensByChain = Object.values(
					getListTokens[transformToChainIdType]
				);

				const verifyTokens = currentCacheListTokensToDisplay.filter(token =>
					getTokensByChain.some(
						currentToken => token.address === currentToken.address
					)
				);

				if (getTokensByChain.length > 0 && verifyTokens.length === 0) {
					setCurrentCacheListTokensToDisplay(prevState => [
						...prevState,
						...getTokensByChain,
					]);
				}
			}

			return {};
		});
	}, [
		tokenListCache,
		tokenListManageState.selectedListUrl,
		walletAddress,
		currentNetworkChainId,
	]);

	useMemo(() => {
		if (listToAdd === "" && listToRemove === "") return;

		if (listToAdd) addListToListState(listToAdd);

		if (listToRemove) removeListFromListState(listToRemove);
	}, [listToAdd, listToRemove]);

	const tokensListManageProviderValue = useMemo(
		() => ({
			tokenListManageState,
			currentCacheListTokensToDisplay,
			UseSelectedListUrl,
			UseSelectedTokenList,
			removeListFromListState,
			addListToListState,
			toggleListByUrl,
		}),
		[
			tokenListManageState,
			tokenListManageState.byUrl,
			tokenListManageState.lastInitializedDefaultListOfLists,
			tokenListManageState.selectedListUrl,
			currentCacheListTokensToDisplay,
			UseSelectedListUrl,
			UseSelectedTokenList,
			removeListFromListState,
			addListToListState,
			toggleListByUrl,
		]
	);

	return (
		<TokensListManageContext.Provider value={tokensListManageProviderValue}>
			{children}
		</TokensListManageContext.Provider>
	);
};
