import React, { useEffect, createContext, useState, useMemo } from "react";
import { WrappedTokenInfo } from "types";
import { useWallet, ApprovalState, useTokensListManage } from "hooks";
import { getDefaultTokens } from "networks";
import {
	getBalanceOfMultiCall,
	getProviderBalance,
	truncateNumberDecimalsPlaces,
} from "utils";
import { TokenInfo } from "@pollum-io/syscoin-tokenlist-sdk";

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

	const {
		isConnected,
		provider,
		walletAddress,
		currentNetworkChainId,
		approvalState,
	} = useWallet();

	const { UseSelectedListUrl, tokenListManageState } = useTokensListManage();

	const getCurrentSelectedTokens = async () => {
		const currentUrls = UseSelectedListUrl();
		// eslint-disable-next-line
		let genTokens: any[] = [];

		const fetchTokens =
			currentUrls &&
			(await Promise.all(
				currentUrls?.map(async url => {
					const { tokens } = await fetch(url).then(res => res.json());
					return tokens;
				})
			));
		if (!fetchTokens) return null;

		for (let i = 0; i < fetchTokens?.length; i += 1) {
			genTokens = [...genTokens, ...fetchTokens[i]];
		}

		return genTokens;
	};

	const getAllTokens = async () => {
		const generalTokens = await getCurrentSelectedTokens();
		const { tokens: initialTokens } = await getDefaultTokens(
			currentNetworkChainId as number
		);
		const filteredTokens = generalTokens?.filter(
			token =>
				token.chainId === currentNetworkChainId &&
				token.symbol !== "AGEUR" &&
				token.symbol !== "MAI" &&
				token.symbol !== "QI"
		);

		if (!currentNetworkChainId)
			return initialTokens.filter(
				token =>
					token.symbol !== "AGEUR" &&
					token.symbol !== "MAI" &&
					token.symbol !== "QI"
			);

		if (filteredTokens?.length === 0)
			return initialTokens.filter(
				token => token.symbol === "WSYS" || token.symbol === "PSYS"
			);

		return filteredTokens;
	};

	const getDefaultListToken = async () => {
		const tokens = await getAllTokens();

		if (!tokens) return null;

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

		const { providerBalanceFormattedValue } = await getProviderBalance(
			provider,
			walletAddress
		);

		if (!providerBalanceFormattedValue) return "0";

		const truncatedValue = String(
			truncateNumberDecimalsPlaces(parseFloat(providerBalanceFormattedValue), 3)
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

	useEffect(() => {
		if (approvalState.status === ApprovalState.APPROVED) {
			getDefaultListToken();
			return;
		}
		getCurrentSelectedTokens();
		getDefaultListToken();
	}, [
		isConnected,
		currentNetworkChainId,
		walletAddress,
		approvalState.status,
		tokenListManageState,
	]);

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
