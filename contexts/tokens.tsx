import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers } from "ethers";
import { TokenAddressMap, WrappedTokenInfo } from "types";
import { useWallet, ApprovalState, useTokensListManage, UseENS } from "hooks";
import { getDefaultTokens } from "networks";
import {
	getBalanceOfMultiCall,
	getBalanceOfSingleCall,
	truncateNumberDecimalsPlaces,
} from "utils";
import { TokenInfo, TokenList } from "@pollum-io/syscoin-tokenlist-sdk";
import { EMPTY_TOKEN_LIST, tokenListCache } from "helpers/tokenListHelpers";

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

		if (verifyCurrentList && !isConnected) return verifyCurrentList;

		const SYSToken: TokenInfo = {
			...list.tokens.find(token => token.symbol === "WSYS"),
			name: "Syscoin",
			symbol: "SYS",
			logoURI:
				"https://app.pegasys.finance/static/media/syscoin_token_round.f5e7de99.png",
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

		const validateAddress = UseENS(walletAddress);

		const providerTokenBalance = await provider
			?.getBalance(validateAddress.address as string)
			.then(result => result.toString());

		const providerBalanceFormattedValue = ethers.utils.formatEther(
			providerTokenBalance as string
		);

		const mapAroundList = listWithAllTokens.reduce<TokenAddressMap>(
			(tokenMap, tokenInfo) => {
				const eachTokenBalancePromise = new Promise(resolve => {
					setTimeout(() => {
						resolve(
							Number(tokenInfo.chainId) === Number(currentNetworkChainId) &&
								getBalanceOfSingleCall(
									tokenInfo.address,
									validateAddress.address as string,
									provider,
									tokenInfo.decimals
								)
						);
					}, 100);
				});

				const eachTokenBalanceResult = eachTokenBalancePromise.then(
					(result: any) => console.log(result.toString())
				);

				const token = new WrappedTokenInfo({
					...tokenInfo,
					balance:
						tokenInfo.symbol === "SYS"
							? providerBalanceFormattedValue
							: String(eachTokenBalanceResult),
				});

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
	}, [tokenListManageState, isConnected, walletAddress, currentNetworkChainId]);

	console.log("listCache", tokenListCache);

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
