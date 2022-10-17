import React, { useEffect, createContext, useState, useMemo } from "react";
import { ITokenInfoBalance, WrappedTokenInfo } from "types";
import { useWallet, ApprovalState, useTokensListManage } from "hooks";
import { getDefaultTokens } from "networks";
import { getBalanceOfSingleCall, getProviderBalance } from "utils";
import { TokenInfo } from "@pollum-io/syscoin-tokenlist-sdk";
import { Signer } from "ethers";

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

	const [initialDefaultTokens, setInitialDefaultTokens] = useState<TokenInfo[]>(
		[]
	);

	const {
		isConnected,
		provider,
		walletAddress,
		currentNetworkChainId,
		approvalState,
	} = useWallet();

	const { currentCacheListTokensToDisplay, tokenListManageState } =
		useTokensListManage();

	const getInitialDefaultTokensByRequest = async () => {
		const { tokens: initialTokens } = await getDefaultTokens(
			(currentNetworkChainId || 57) as number
		);

		const WSYS = initialTokens.find(
			(token: TokenInfo | WrappedTokenInfo) => token.symbol === "WSYS"
		) as WrappedTokenInfo | ITokenInfoBalance;

		const SYS: TokenInfo = {
			...WSYS,
			name: "Syscoin",
			symbol: "SYS",
			logoURI:
				"https://app.pegasys.finance/static/media/syscoin_token_round.f5e7de99.png",
		} as TokenInfo;

		const allTokens = [...initialTokens, SYS];

		setInitialDefaultTokens(allTokens);
	};

	const getAllTokens = async () => {
		if (
			initialDefaultTokens.length === 0 &&
			currentCacheListTokensToDisplay.length === 0
		)
			return [];

		const defaultTokens = initialDefaultTokens?.filter(
			token =>
				token.symbol === "SYS" ||
				token.symbol === "WSYS" ||
				token.symbol === "PSYS"
		);

		if (currentCacheListTokensToDisplay.length === 0) return defaultTokens;

		const [SYSExist, WSYSExist, PSYSExist] =
			currentCacheListTokensToDisplay.filter(
				token =>
					token.symbol === "SYS" ||
					token.symbol === "WSYS" ||
					token.symbol === "PSYS"
			);

		if (SYSExist === undefined || !SYSExist)
			currentCacheListTokensToDisplay.push(
				defaultTokens[0] as WrappedTokenInfo
			);
		if (WSYSExist === undefined || !WSYSExist)
			currentCacheListTokensToDisplay.push(
				defaultTokens[1] as WrappedTokenInfo
			);
		if (PSYSExist === undefined || !PSYSExist)
			currentCacheListTokensToDisplay.push(
				defaultTokens[2] as WrappedTokenInfo
			);

		return currentCacheListTokensToDisplay;
	};

	const getDefaultUserTokensBalance = async () => {
		const tokens = await getAllTokens();

		if (tokens.length === 0) return;

		if (!isConnected || !provider) {
			const tokensWithBalance = tokens.map(token => ({
				...token,
				balance: "0",
			}));

			const convertTokens = tokensWithBalance.map(
				token => new WrappedTokenInfo(token as ITokenInfoBalance)
			);

			setUserTokensBalance(convertTokens);
		}

		const { providerBalanceFormattedValue, validatedAddress } =
			await getProviderBalance(provider, walletAddress);

		const tokensWithBalance = await Promise.all(
			tokens.map(async token => {
				if (token.symbol === "SYS") {
					return {
						...token,
						balance: providerBalanceFormattedValue || ("0" as string),
					};
				}

				const contractBalance = await getBalanceOfSingleCall(
					token.address,
					validatedAddress as string,
					provider as Signer,
					token.decimals
				);

				return {
					...token,
					balance: contractBalance,
				};
			})
		);

		const convertTokens = tokensWithBalance.map(
			token => new WrappedTokenInfo(token as ITokenInfoBalance)
		);

		setUserTokensBalance(convertTokens);
	};

	useEffect(() => {
		if (approvalState.status === ApprovalState.APPROVED) {
			getDefaultUserTokensBalance();
			return;
		}

		getDefaultUserTokensBalance();
	}, [
		currentNetworkChainId,
		walletAddress,
		approvalState.status,
		currentCacheListTokensToDisplay,
		tokenListManageState,
		tokenListManageState.selectedListUrl,
	]);

	useEffect(() => {
		getInitialDefaultTokensByRequest();
	}, []);

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
