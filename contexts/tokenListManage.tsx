import { TokenInfo, TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { Signer } from "ethers";
import { DEFAULT_TOKEN_LISTS_SELECTED, SYS_LOGO } from "helpers/consts";
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
	removeListFromListState: (listUrl: string) => void;
	addListToListState: (listUrl: string) => void;
	toggleListByUrl: (listUrl: string, shouldToggle: boolean) => void;
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

	const [currentTokensToDisplay, setCurrentTokensToDisplay] = useState<
		WrappedTokenInfo[]
	>([]);

	const { isConnected, provider, walletAddress, currentNetworkChainId } =
		useWallet();

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

		if (verifyCurrentList && !isConnected) return verifyCurrentList;

		const SYSToken: TokenInfo = {
			...list.tokens.find(token => token.symbol === "WSYS"),
			name: "Syscoin",
			symbol: "SYS",
			logoURI: SYS_LOGO,
		} as TokenInfo;

		const validateDefaultName = ["Pegasys Default", "Tanenbaum Tokens"];

		const listWithAllTokens = validateDefaultName.includes(list.name)
			? [...list.tokens, SYSToken]
			: list.tokens;

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
	};

	const addListToListState = (listUrl: string) => {
		setTokenListManageState(prevState => {
			if (!prevState.byUrl[listUrl]) {
				prevState.byUrl[listUrl] = NEW_TOKEN_LIST_STATE;
			}

			return { ...prevState };
		});
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

				if (elementInListIndex !== -1) {
					if (existingSelectedList?.length === 1) {
						prevState.selectedListUrl = DEFAULT_TOKEN_LISTS_SELECTED;
					} else {
						existingSelectedList.splice(elementInListIndex, 1);
						prevState.selectedListUrl = existingSelectedList;
					}
				}
			}

			if (!prevState.byUrl[listUrl])
				prevState.byUrl[listUrl] = NEW_TOKEN_LIST_STATE;

			return { ...prevState };
		});
	};

	const handleTokensToDisplay = () => {
		if (!tokenListManageState?.byUrl || !tokenListManageState?.selectedListUrl)
			return;

		const transformListKeys = Object.keys(tokenListManageState.byUrl);

		const tokensToDisplay: WrappedTokenInfo[] = [];

		tokenListManageState?.selectedListUrl.map((listUrl, index) => {
			const tokenListValuesByUrl = String(transformListKeys[index]);
			const getCurrentList = tokenListCache?.get(
				tokenListManageState.byUrl[listUrl].current as TokenList
			);

			if (listUrl === tokenListValuesByUrl && getCurrentList) {
				const transformList = Object.assign(getCurrentList);

				const findTokensByChain =
					transformList[currentNetworkChainId || (57 as number)]; // aqui é achado os tokens dentro do WeakMap, validem se os valores ja existem no array antes de adicionar

				if (Object.keys(findTokensByChain).length !== 0) {
					if (currentTokensToDisplay.length === 0) {
						setCurrentTokensToDisplay([...findTokensByChain]);
						console.log("findTokensByChain NO 1", findTokensByChain);
					} else {
						// const allTokens = [currentTokensToDisplay, findTokensByChain]
						setCurrentTokensToDisplay(prevState => {
							console.log("findTokensByChain NO 2", findTokensByChain);
							const newValuePush = [prevState].push(findTokensByChain);
							const newValueConcat = [prevState].concat(findTokensByChain);

							console.log("newValuePush", newValuePush);
							console.log("newValuePush", newValueConcat);

							return prevState;
						});
					}
				}
			}

			return tokenListManageState; // ignore that, only for eslint
		});
	};

	console.log("tokensToDisplay", currentTokensToDisplay);

	useEffect(() => {
		UseSelectedTokenList();

		if (!tokenListManageState?.byUrl) return;
		Object.keys(tokenListManageState?.byUrl).forEach(url =>
			fetchAndFulfilledTokenListManage(url)
		);

		handleTokensToDisplay();
	}, [
		tokenListManageState,
		tokenListManageState.byUrl,
		tokenListManageState.lastInitializedDefaultListOfLists,
		tokenListManageState.selectedListUrl,
		isConnected,
		walletAddress,
		currentNetworkChainId,
	]);

	const tokensListManageProviderValue = useMemo(
		() => ({
			tokenListManageState,
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
