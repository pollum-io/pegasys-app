import React, { useEffect, createContext, useState, useMemo } from "react";
import { ethers } from "ethers";
import { ITokenBalance, ITokenBalanceWithId } from "types";
import { useWallet } from "hooks";
import { getDefaultTokens } from "networks";
import { getBalanceOfMultiCall } from "utils";

interface ITokensContext {
	userTokensBalance: ITokenBalance[];
}

export const TokensContext = createContext({} as ITokensContext);

export const TokensProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [userTokensBalance, setUserTokensBalance] = useState<
		ITokenBalance[] | ITokenBalanceWithId[]
	>([]);

	const { isConnected, provider, walletAddress } = useWallet();

	const getProviderTokenBalance = async () => {
		const value = await provider
			?.getBalance(walletAddress)
			.then(result => result.toString());

		if (!value) return "0";

		const formattedValue = ethers.utils.formatEther(value);
		// eslint-disable-next-line
		setUserTokensBalance(previous => [
			{
				address: "",
				chainId: 5700,
				name: "Testnet Syscoin",
				symbol: "TSYS",
				decimals: 18,
				balance: formattedValue,
				logoURI: "https://cryptologos.cc/logos/syscoin-sys-logo.png?v=022",
			},
			...previous,
		]);

		return formattedValue;
	};

	const getDefaultListToken = async () => {
		const { tokens } = await getDefaultTokens();

		const tokensAddress = tokens.map(token => token.address);

		const tokensDecimals = tokens.map(token => token.decimals);

		const balances = await getBalanceOfMultiCall(
			tokensAddress,
			walletAddress,
			provider,
			tokensDecimals
		);

		const tokensWithBalance = tokens.map(token => {
			const balanceItems = balances.find(
				balance => balance.address === token.address
			);

			return {
				...token,
				balance: balanceItems?.balance as string,
			};
		});

		setUserTokensBalance(tokensWithBalance);

		if (!userTokensBalance) return;

		getProviderTokenBalance();
	};

	useEffect(() => {
		if (!isConnected) return;

		getDefaultListToken();
	}, [isConnected]);

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
