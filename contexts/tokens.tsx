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

		setInitialDefaultTokens(initialTokens);
	};

	const getAllTokens = async () => {
		const filteredTokens = currentCacheListTokensToDisplay?.filter(
			token =>
				token.symbol !== "AGEUR" &&
				token.symbol !== "MAI" &&
				token.symbol !== "QI"
		);

		if (filteredTokens?.length === 0) {
			const initialTokens = initialDefaultTokens.filter(
				token => token.symbol === "WSYS" || token.symbol === "PSYS"
			);

			return [...initialTokens, ...filteredTokens];
		}

		return filteredTokens;
	};

	const getDefaultUserTokensBalance = async () => {
		const tokens = await getAllTokens();

		if (tokens.length === 0) return;

		// eslint-disable-next-line
		const WSYS = tokens.find(
			(token: TokenInfo | WrappedTokenInfo) => token.symbol === "WSYS"
		) as WrappedTokenInfo | ITokenInfoBalance;

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
				token => new WrappedTokenInfo(token as ITokenInfoBalance)
			);

			setUserTokensBalance(convertTokens);
		}

		const { providerBalanceFormattedValue, validatedAddress } =
			await getProviderBalance(provider, walletAddress);

		const tokensWithBalance = await Promise.all(
			allTokens.map(async token => {
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
