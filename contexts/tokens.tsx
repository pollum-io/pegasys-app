import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers } from "ethers";
import { WrappedTokenInfo } from "types";
import { useWallet, ApprovalState } from "hooks";
import { getDefaultTokens } from "networks";
import {
	getBalanceOfMultiCall,
	removeScientificNotation,
	truncateNumberDecimalsPlaces,
} from "utils";
import { TokenInfo } from "@pollum-io/syscoin-tokenlist-sdk";
import { useWallet as psUseWallet } from "pegasys-services";

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

	const { provider, approvalState } = useWallet();

	const { isConnected, address, chainId } = psUseWallet();

	const getDefaultListToken = async () => {
		const { tokens } = await getDefaultTokens(chainId as number);

		const WSYS = tokens.find(token => token.symbol === "WSYS");

		const SYS: TokenInfo = {
			...WSYS,
			name: "Syscoin",
			symbol: "SYS",
			logoURI:
				"https://app.pegasys.finance/static/media/syscoin_token_round.f5e7de99.png",
			extensions: {
				isNative: true,
			},
		} as TokenInfo;

		const allTokens = [...tokens, SYS].filter(
			token =>
				token.symbol !== "AGEUR" &&
				token.symbol !== "MAI" &&
				token.symbol !== "QI"
		);

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
			?.getBalance(address)
			.then(result => result.toString());

		if (!providerTokenBalance) return "0";

		const formattedValue = ethers.utils.formatEther(providerTokenBalance);
		const truncatedValue = String(
			truncateNumberDecimalsPlaces(parseFloat(formattedValue), 3)
		);

		const contractBalances = await getBalanceOfMultiCall(
			tokensAddress,
			address,
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
					+balanceItems.balance > 0 && +balanceItems.balance < 1
						? removeScientificNotation(parseFloat(balanceItems.balance))
						: truncateNumberDecimalsPlaces(parseFloat(balanceItems.balance), 3)
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
		getDefaultListToken();
	}, [isConnected, chainId, address]);

	useEffect(() => {
		if (approvalState.status === ApprovalState.APPROVED) {
			getDefaultListToken();
		}
	}, [approvalState]);

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
