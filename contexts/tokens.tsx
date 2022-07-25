import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers } from "ethers";
import { WrappedTokenInfo } from "types";
import { useWallet } from "hooks";
import { getDefaultTokens } from "networks";
import { getBalanceOfMultiCall } from "utils";

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

	const { isConnected, provider, walletAddress, currentNetworkChainId } =
		useWallet();

	const getDefaultListToken = async () => {
		const { tokens } = await getDefaultTokens();

		if (!isConnected || !provider) {
			const tokensWithBalance = tokens.map(token => ({
				...token,
				balance: "0",
			}));

			const convertTokens = tokensWithBalance.map(
				token => new WrappedTokenInfo(token)
			);

			setUserTokensBalance(convertTokens);
		}

		const tokensAddress = tokens.map(token => token.address);

		const tokensDecimals = tokens.map(token => token.decimals);

		const providerTokenBalance = await provider
			?.getBalance(walletAddress)
			.then(result => result.toString());

		if (!providerTokenBalance) return "0";

		const formattedValue = ethers.utils.formatEther(providerTokenBalance);

		const contractBalances = await getBalanceOfMultiCall(
			tokensAddress,
			walletAddress,
			provider,
			tokensDecimals
		);

		const tokensWithBalance = tokens.map(token => {
			const balanceItems = contractBalances.find(
				balance => balance.address === token.address
			);

			if (token.symbol === "WSYS" || token.symbol === "SYS") {
				return {
					...token,
					balance: formattedValue as string,
				};
			}

			return {
				...token,
				balance: balanceItems?.balance as string,
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
	}, [isConnected, currentNetworkChainId]);

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
