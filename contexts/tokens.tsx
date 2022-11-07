import React, { useEffect, createContext, useState, useMemo } from "react";
import { ITokenInfoBalance, WrappedTokenInfo } from "types";
import { ApprovalState, useTokensListManage } from "hooks";
import { getDefaultTokens } from "networks";
import { getBalanceOfSingleCall, getProviderBalance } from "utils";
import { TokenInfo } from "@pollum-io/syscoin-tokenlist-sdk";
import {
	useWallet,
	useTransaction,
	SUPPORTED_NETWORK_CHAINS,
} from "pegasys-services";
import { ChainId } from "@pollum-io/pegasys-sdk";

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
		address: walletAddress,
		chainId: currentNetworkChainId,
		provider,
	} = useWallet();

	const { approvalState } = useTransaction();

	const { currentCacheListTokensToDisplay, tokenListManageState } =
		useTokensListManage();

	const validatedCurrentChain = SUPPORTED_NETWORK_CHAINS.includes(
		currentNetworkChainId as number
	);

	const getInitialDefaultTokensByRequest = async () => {
		const { tokens: initialTokens } = await getDefaultTokens(
			validatedCurrentChain ? (currentNetworkChainId as number) : 57
		);

		const WSYS = initialTokens.find(
			(token: TokenInfo | WrappedTokenInfo) =>
				token.symbol === "WSYS" &&
				(token.chainId as ChainId) === currentNetworkChainId
		) as WrappedTokenInfo | ITokenInfoBalance;

		const SYS: TokenInfo = {
			...WSYS,
			name: "Syscoin",
			symbol: "SYS",
			logoURI:
				"https://app.pegasys.finance/static/media/syscoin_token_round.f5e7de99.png",
		} as TokenInfo;

		const allTokens = [...initialTokens, SYS];

		setInitialDefaultTokens([...allTokens]);
	};

	const getAllTokens = () => {
		if (
			initialDefaultTokens.length === 0 &&
			currentCacheListTokensToDisplay.length === 0
		)
			return [];

		const SYSToken = initialDefaultTokens.find(
			token =>
				token.symbol === "SYS" &&
				Number(token.chainId) ===
					(validatedCurrentChain ? currentNetworkChainId : 57)
		);
		const WSYSToken = initialDefaultTokens.find(
			token =>
				token.symbol === "WSYS" &&
				Number(token.chainId) ===
					(validatedCurrentChain ? currentNetworkChainId : 57)
		);
		const PSYSToken = initialDefaultTokens.find(
			token =>
				token.symbol === "PSYS" &&
				Number(token.chainId) ===
					(validatedCurrentChain ? currentNetworkChainId : 57)
		);

		if (currentCacheListTokensToDisplay.length === 0)
			return [SYSToken, WSYSToken, PSYSToken];

		const SYSExist = currentCacheListTokensToDisplay.find(
			token => token?.symbol === "SYS"
		);
		const WSYSExist = currentCacheListTokensToDisplay.find(
			token => token?.symbol === "WSYS"
		);
		const PSYSExist = currentCacheListTokensToDisplay.find(
			token => token?.symbol === "PSYS"
		);

		if (SYSExist === undefined && SYSToken !== undefined)
			currentCacheListTokensToDisplay.push(SYSToken as WrappedTokenInfo);
		if (WSYSExist === undefined && WSYSToken !== undefined)
			currentCacheListTokensToDisplay.push(WSYSToken as WrappedTokenInfo);
		if (PSYSExist === undefined && PSYSToken !== undefined)
			currentCacheListTokensToDisplay.push(PSYSToken as WrappedTokenInfo);

		return currentCacheListTokensToDisplay;
	};

	const getDefaultUserTokensBalance = async () => {
		const tokens = getAllTokens();

		if (tokens.length === 0) return;

		if (!isConnected || !provider) {
			const tokensWithBalance = tokens.map(token => ({
				...token,
				balance: "0",
				formattedBalance: "0",
			}));

			const convertTokens = tokensWithBalance.map(
				token => new WrappedTokenInfo(token as ITokenInfoBalance)
			);

			setUserTokensBalance([...convertTokens]);
		}

		const { providerFullBalance, providerFormattedBalance, validatedAddress } =
			await getProviderBalance(provider, walletAddress);

		const tokensWithBalance = await Promise.all(
			tokens.map(async token => {
				if (token?.symbol === "SYS") {
					return {
						...token,
						balance: providerFullBalance || ("0" as string),
						formattedBalance: providerFormattedBalance,
					};
				}

				const { balance, formattedBalance } = await getBalanceOfSingleCall(
					token?.address as string,
					validatedAddress as string,
					provider,
					token?.decimals as number
				);

				return {
					...token,
					balance,
					formattedBalance,
				};
			})
		);

		const convertTokens = tokensWithBalance.map(
			token => new WrappedTokenInfo(token as ITokenInfoBalance)
		);

		setUserTokensBalance([...convertTokens]);
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
		isConnected,
		currentCacheListTokensToDisplay,
		initialDefaultTokens,
		tokenListManageState.selectedListUrl,
	]);

	useEffect(() => {
		getInitialDefaultTokensByRequest();
	}, [currentNetworkChainId, isConnected, walletAddress]);

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
