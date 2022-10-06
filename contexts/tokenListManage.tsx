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
import React, {
	createContext,
	useMemo,
	useState,
	useEffect,
	useCallback,
} from "react";
import { ListsState, TokenAddressMap, WrappedTokenInfo } from "types";
import { getBalanceOfSingleCall, getProviderBalance } from "utils";

interface ITokensListManageContext {
	tokenListManageState: ListsState;
	currentTokensToDisplay: WrappedTokenInfo[];
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

	// UTILS FUNCTIONS TO HANDLE DISPLAY TOKENS STATE //
	const findAndReturnTokensByListUrl = (
		listUrl: string
	): WrappedTokenInfo[] => {
		const getCurrentList = tokenListCache?.get(
			tokenListManageState.byUrl[listUrl].current as TokenList
		) as TokenAddressMap;

		if (getCurrentList) {
			const transformListObject = Object.assign(getCurrentList);

			const findTokensByChain =
				transformListObject[currentNetworkChainId || 57];

			const convertFoundedTokens = Object.values(findTokensByChain).map(
				token => token
			) as WrappedTokenInfo[];

			const verifyIfListHasUnecessaryTokens = convertFoundedTokens.findIndex(
				token =>
					token.symbol === "AGEUR" ||
					token.symbol === "MAI" ||
					token.symbol === "QI"
			);

			if (verifyIfListHasUnecessaryTokens !== -1) {
				const unecessaryTokensRemoved = convertFoundedTokens.filter(
					token =>
						token.symbol !== "AGEUR" &&
						token.symbol !== "MAI" &&
						token.symbol !== "QI"
				);
				return unecessaryTokensRemoved;
			}

			return convertFoundedTokens;
		}

		return [];
	};

	const handleTokensToDisplay = () => {
		if (!tokenListManageState?.byUrl || !tokenListManageState?.selectedListUrl)
			return;

		const transformListKeys = Object.keys(tokenListManageState.byUrl);

		tokenListManageState?.selectedListUrl.map((listUrl, index) => {
			const tokenListValuesByUrl = String(transformListKeys[index]);

			const getCurrentListTokens = findAndReturnTokensByListUrl(listUrl);

			if (String(listUrl) === tokenListValuesByUrl) {
				const verifyIfTokenExist = currentTokensToDisplay.filter(
					(token, index) => token === getCurrentListTokens[index]
				);

				if (verifyIfTokenExist.length === 0) {
					setCurrentTokensToDisplay(prevState => [
						...prevState,
						...getCurrentListTokens,
					]);
				}
			} else {
				setCurrentTokensToDisplay(getCurrentListTokens);
			}
			return {};
		});
	};

	const findAndRemoveTokenFromList = (listUrl: string) => {
		const getCurrentListTokens = findAndReturnTokensByListUrl(listUrl);

		const searchAndRemoveToken = currentTokensToDisplay.filter(
			(token, index) => token !== getCurrentListTokens[index]
		);

		setCurrentTokensToDisplay(searchAndRemoveToken);
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

				if (elementInListIndex === -1) return { ...prevState };

				if (existingSelectedList?.length === 1) {
					prevState.selectedListUrl = DEFAULT_TOKEN_LISTS_SELECTED;
				} else {
					findAndRemoveTokenFromList(listUrl);

					existingSelectedList.splice(elementInListIndex, 1);
					prevState.selectedListUrl = existingSelectedList;
				}
			}

			if (!prevState.byUrl[listUrl])
				prevState.byUrl[listUrl] = NEW_TOKEN_LIST_STATE;

			return { ...prevState };
		});
	};

	const UseSelectedListUrl = (): string[] | undefined =>
		([] as string[]).concat(tokenListManageState?.selectedListUrl || []);

	const UseSelectedTokenList = (): TokenAddressMap =>
		useTokenList(UseSelectedListUrl());

	// HANDLE FUNCTIONS TO FILL AND MANAGE TOKEN LIST MANAGE STATE AT ALL AND ALSO WEAK MAP LISTS //

	console.log("currentTokensToDisplay", currentTokensToDisplay);

	useEffect(() => {
		UseSelectedTokenList();

		if (!tokenListManageState?.byUrl) return;
		Object.keys(tokenListManageState?.byUrl).forEach(url =>
			fetchAndFulfilledTokenListManage(url)
		);
	}, [
		tokenListManageState,
		tokenListManageState.byUrl,
		tokenListManageState.lastInitializedDefaultListOfLists,
		tokenListManageState.selectedListUrl,
		isConnected,
		walletAddress,
		currentNetworkChainId,
	]);

	useEffect(() => {
		if (!tokenListManageState.selectedListUrl) return;
		// console.log(tokenListManageState.selectedListUrl)
		handleTokensToDisplay();
	}, [tokenListManageState.selectedListUrl, currentNetworkChainId]);

	const tokensListManageProviderValue = useMemo(
		() => ({
			tokenListManageState,
			currentTokensToDisplay,
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
			currentTokensToDisplay,
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
