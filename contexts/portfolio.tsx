/* eslint-disable no-unused-expressions */
import { Pair } from "@pollum-io/pegasys-sdk";
import { useTokens } from "hooks";
import { useWallet } from "pegasys-services";
import {
	IContextTransactions,
	ILiquidity,
	ITransactions,
} from "pegasys-services/dto/contexts/portfolio";
import PortfolioServices from "pegasys-services/services/portfolio";
import { createContext, useEffect, useMemo, useState } from "react";

export const PortfolioContext = createContext({} as IContextTransactions);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { address, chainId, provider, signer } = useWallet();
	const { userTokensBalance } = useTokens();

	const [pairs, setPairs] = useState<Pair[]>([]);

	const [swapsTransactions, setSwapsTransactions] = useState<ITransactions[]>(
		[]
	);
	const [burnsTransactions, setBurnsTransactions] = useState<ITransactions[]>(
		[]
	);
	const [mintsTransactions, setMintsTransactions] = useState<ITransactions[]>(
		[]
	);
	const [walletBalance, setWalletBalance] = useState<Array<any>>([]);
	const [liquidityPosition, setLiquidityPosition] = useState<ILiquidity>({
		fees: 0,
		liquidity: 0,
		positions: [],
	});

	const getWalletBalance = async () => {
		const balances = await PortfolioServices.getWalletBalance(
			userTokensBalance
		);

		setWalletBalance(balances.walletBalances);
	};

	const getPairs = async () => {
		const currentPairs = await PortfolioServices.getAllUserTokenPairs(
			{ chainId: chainId as any, provider, walletAddress: address },
			userTokensBalance
		);
		if (currentPairs) setPairs(currentPairs);
	};

	const getPoolPercentShare = async (pair: Pair) => {
		const poolShare = await PortfolioServices.getPoolPercentShare(pair, {
			provider,
			signer,
			walletAddress: address,
		});

		return poolShare;
	};

	const getDepositedTokens = async (pair: Pair) => {
		const [token0Deposited, token1Deposited] =
			await PortfolioServices.getDepositedTokens(pair, {
				provider,
				signer,
				walletAddress: address,
			});

		return [token0Deposited, token1Deposited];
	};

	const getLiquidityPositions = async () => {
		const positions = await PortfolioServices.getUserLiquidityPositions(
			address
		);
		console.log(positions, "positions");

		setLiquidityPosition(positions);
		console.log(liquidityPosition, "liquidityPosition");
	};

	const getTransactions = async () => {
		const transactions = await PortfolioServices.getTransactions(address);

		setSwapsTransactions(transactions.swaps);
		setBurnsTransactions(transactions.burns);
		setMintsTransactions(transactions.mints);
	};

	useEffect(() => {
		if (address) {
			getTransactions();
			getLiquidityPositions();
			getPairs();
		}

		if (userTokensBalance) getWalletBalance();
	}, [address, userTokensBalance]);

	const allTransactions = useMemo(() => {
		const transactions = [
			...swapsTransactions,
			...burnsTransactions,
			...mintsTransactions,
		];

		return transactions.sort((a, b) => {
			if (a.time < b.time) return 1;

			if (a.time > b.time) return -1;
			return 0;
		});
	}, [swapsTransactions, burnsTransactions, mintsTransactions]);

	const getTotalValueSwapped = useMemo(() => {
		const total = swapsTransactions.reduce(
			(acc, cur) => acc + cur.totalValue,
			0
		);
		return total;
	}, [swapsTransactions]);

	const portfolioProviderValue = useMemo(
		() => ({
			swapsTransactions,
			burnsTransactions,
			mintsTransactions,
			allTransactions,
			getTotalValueSwapped,
			getPoolPercentShare,
			getDepositedTokens,
			walletBalance,
			pairs,
			liquidityPosition,
		}),
		[
			swapsTransactions,
			pairs,
			burnsTransactions,
			mintsTransactions,
			allTransactions,
			getTotalValueSwapped,
			getPoolPercentShare,
			walletBalance,
			liquidityPosition,
		]
	);

	return (
		<PortfolioContext.Provider value={portfolioProviderValue}>
			{children}
		</PortfolioContext.Provider>
	);
};
