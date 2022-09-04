import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers } from "ethers";
import { ListsState, TokenAddressMap, WrappedTokenInfo } from "types";
import { useWallet, ApprovalState, useTokensListManage } from "hooks";
import { getDefaultTokens, getTokenListByUrl } from "networks";
import { getBalanceOfMultiCall, truncateNumberDecimalsPlaces } from "utils";
import { TokenInfo, TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import {
	EMPTY_TOKEN_LIST,
	INITIAL_TOKEN_LIST_STATE,
	tokenListCache,
} from "helpers/tokenListHelpers";
import { DEFAULT_TOKEN_LISTS_SELECTED, PEGASYS_LIST } from "helpers/consts";

interface ITokensContext {
	userTokensBalance: WrappedTokenInfo[];
}

export const TokensContext = createContext({} as ITokensContext);

export const TokensProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [userTokensBalance, setUserTokensBalance] = useState<
		WrappedTokenInfo[]
	>([]);

	const { tokenListManageState } = useTokensListManage();
	const {
		isConnected,
		provider,
		walletAddress,
		currentNetworkChainId,
		approvalState,
	} = useWallet();

	const getDefaultListToken = async () => {
		const { tokens } = await getDefaultTokens(currentNetworkChainId as number);

		const WSYS = tokens.find(token => token.symbol === "WSYS");

		const SYS: TokenInfo = {
			...WSYS,
			name: "Syscoin",
			symbol: "SYS",
			logoURI:
				"https://app.pegasys.finance/static/media/syscoin_token_round.f5e7de99.png",
		} as TokenInfo;

		const allTokens = [...tokens, SYS];

		if (!isConnected || !provider) {
			const tokensWithBalance = allTokens.map(token => ({
				...token,
				balance: "0",
			}));

			const convertTokens = tokensWithBalance.map(
				token => new WrappedTokenInfo(token)
			);

			setUserTokensBalance(convertTokens);
		}

		const tokensAddress = allTokens.map(token => token.address);

		const tokensDecimals = allTokens.map(token => token.decimals);

		const providerTokenBalance = await provider
			?.getBalance(walletAddress)
			.then(result => result.toString());

		if (!providerTokenBalance) return "0";

		const formattedValue = ethers.utils.formatEther(providerTokenBalance);
		const truncatedValue = String(
			truncateNumberDecimalsPlaces(parseFloat(formattedValue), 3)
		);

		const contractBalances = await getBalanceOfMultiCall(
			tokensAddress,
			walletAddress,
			provider,
			tokensDecimals
		);

		const tokensWithBalance = allTokens.map(token => {
			const balanceItems = contractBalances.find(
				balance => balance.address === token.address
			);

			if (token.symbol === "SYS") {
				return {
					...token,
					balance: truncatedValue as string,
				};
			}

			const truncatedBalance =
				balanceItems &&
				String(
					truncateNumberDecimalsPlaces(parseFloat(balanceItems.balance), 3)
				);

			return {
				...token,
				balance: truncatedBalance as string,
			};
		});

		const convertTokens = tokensWithBalance.map(
			token => new WrappedTokenInfo(token)
		);

		setUserTokensBalance(convertTokens);

		return {};
	};

	const listToTokenMap = async (list: TokenList): Promise<TokenAddressMap> => {
		const verifyCurrentList = tokenListCache?.get(list);

		if (verifyCurrentList) return verifyCurrentList;

		// const SYSToken: TokenInfo = {
		// 	...list.tokens.find(token => token.symbol === "WSYS"),
		// 	name: "Syscoin",
		// 	symbol: "SYS",
		// 	logoURI:
		// 		"https://app.pegasys.finance/static/media/syscoin_token_round.f5e7de99.png",
		// } as TokenInfo;

		// const listWithAllTokens = [...list.tokens, SYSToken];

		// // console.log('listWithAllTokens', listWithAllTokens)

		// const tokensAddress = listWithAllTokens.map(token => token.address);

		// const tokensDecimals = listWithAllTokens.map(token => token.decimals);

		// const providerTokenBalance =
		// 	(await provider
		// 		?.getBalance(walletAddress)
		// 		.then(result => result.toString())) || "0";

		// const balanceFormattedValue =
		// 	ethers.utils.formatEther(providerTokenBalance);

		// const getContractBalances = await getBalanceOfMultiCall(
		// 	tokensAddress,
		// 	walletAddress,
		// 	provider,
		// 	tokensDecimals
		// );

		// const listTokensWithBalance = listWithAllTokens.map(token => {
		// 	const balanceItems = getContractBalances.find(
		// 		balance => balance.address === token.address
		// 	);

		// 	if (token.symbol === "SYS") {
		// 		return {
		// 			...token,
		// 			balance: balanceFormattedValue as string,
		// 		};
		// 	}

		// 	return {
		// 		...token,
		// 		balance: ethers.utils.formatEther(balanceItems?.balance as string),
		// 	};
		// });

		// console.log('listTokensWithBalance', listTokensWithBalance)

		const mapAroundList = list.tokens.reduce<TokenAddressMap>(
			(tokenMap, tokenInfo) => {
				const token = new WrappedTokenInfo(tokenInfo);

				if (tokenMap[token.chainId][token.address] !== undefined)
					throw new Error("Duplicated token");
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

		// console.log('mapAroundList', mapAroundList)

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

	useEffect(() => {
		getDefaultListToken();
	}, [isConnected, currentNetworkChainId, walletAddress]);

	useEffect(() => {
		if (approvalState.status === ApprovalState.APPROVED) {
			getDefaultListToken();
		}
	}, [approvalState]);

	useEffect(() => {
		UseSelectedTokenList();
	}, [tokenListManageState]);

	const tokensProviderValue = useMemo(
		() => ({
			userTokensBalance,
		}),
		[userTokensBalance]
	);

	return (
		<TokensContext.Provider value={tokensProviderValue}>
			{children}
		</TokensContext.Provider>
	);
};
