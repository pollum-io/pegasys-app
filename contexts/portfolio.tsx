/* eslint-disable no-unused-expressions */
import { useWallet } from "pegasys-services";
import {
	IContextTransactions,
	ITransactions,
} from "pegasys-services/dto/contexts/portfolio";
import PortfolioServices from "pegasys-services/services/portfolio";
import { createContext, useEffect, useMemo, useState } from "react";

export const PortfolioContext = createContext({} as IContextTransactions);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { address } = useWallet();

	const [swapsTransactions, setSwapsTransactions] = useState<ITransactions[]>(
		[]
	);
	const [burnsTransactions, setBurnsTransactions] = useState<ITransactions[]>(
		[]
	);
	const [mintsTransactions, setMintsTransactions] = useState<ITransactions[]>(
		[]
	);

	const getTransactions = async () => {
		const transactions = await PortfolioServices.getTransactions(address);

		setSwapsTransactions(transactions.swaps);
		setBurnsTransactions(transactions.burns);
		setMintsTransactions(transactions.mints);
	};

	useEffect(() => {
		if (address) getTransactions();
	}, [address]);

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

	const portfolioProviderValue = useMemo(
		() => ({
			swapsTransactions,
			burnsTransactions,
			mintsTransactions,
			allTransactions,
		}),
		[swapsTransactions, burnsTransactions, mintsTransactions, allTransactions]
	);

	return (
		<PortfolioContext.Provider value={portfolioProviderValue}>
			{children}
		</PortfolioContext.Provider>
	);
};
