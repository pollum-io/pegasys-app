import { JSBI, Pair, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { createContext, useEffect, useMemo, useState } from "react";
import {
	IPoolsApr,
	IPoolsLiquidity,
	IPoolsWithLiquidity,
	IPoolsVolume,
	ICommonPairs,
} from "types";
import {
	getBalanceOfBNSingleCall,
	removeScientificNotation,
	unwrappedToken,
} from "utils";
import { pegasysClient, SYS_PRICE } from "apollo";
import { useWallet } from "pegasys-services";

interface IPools {
	setPoolsApr: React.Dispatch<React.SetStateAction<IPoolsApr | undefined>>;
	poolsApr: IPoolsApr | undefined;
	setPoolsWithLiquidity: React.Dispatch<
		React.SetStateAction<IPoolsWithLiquidity | undefined>
	>;
	poolsWithLiquidity: IPoolsWithLiquidity | undefined;
	setPoolsLiquidity: React.Dispatch<
		React.SetStateAction<IPoolsLiquidity | undefined>
	>;
	poolsLiquidity: IPoolsLiquidity | undefined;
	setPoolsVolume: React.Dispatch<
		React.SetStateAction<IPoolsVolume | undefined>
	>;
	poolsVolume: IPoolsVolume | undefined;
	setPairs: React.Dispatch<React.SetStateAction<Pair[]>>;
	pairs: Pair[];
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	pairInfo: ICommonPairs | undefined;
	setPairInfo: React.Dispatch<React.SetStateAction<ICommonPairs | undefined>>;
	setSortType: React.Dispatch<React.SetStateAction<string>>;
	sortType: string;
}

export const PoolsContext = createContext({} as IPools);
export const PoolsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [poolsApr, setPoolsApr] = useState<IPoolsApr>();
	const [poolsWithLiquidity, setPoolsWithLiquidity] =
		useState<IPoolsWithLiquidity>();
	const [poolsLiquidity, setPoolsLiquidity] = useState<IPoolsLiquidity>();
	const [poolsVolume, setPoolsVolume] = useState<IPoolsVolume>();
	const [pairs, setPairs] = useState<Pair[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [pairInfo, setPairInfo] = useState<ICommonPairs>();
	const [currenciesArr, setCurrenciesArr] = useState<string[]>([]);
	const [sortType, setSortType] = useState<string>("apr");
	// eslint-disable-next-line
	const [poolBalance, setPoolBalance] = useState<any>();
	const { address, provider } = useWallet();

	useMemo(() => {
		const stringArr = pairs.map(pair => {
			const currencyA = unwrappedToken(pair.token0 as Token);
			const currencyB = unwrappedToken(pair.token1 as Token);

			return `${currencyA.symbol}-${currencyB.symbol}`;
		});

		setCurrenciesArr(stringArr);
	}, [pairs]);

	useMemo(async () => {
		const poolsBalances = await Promise.all(
			pairs.map(async pair => {
				const pairBalance = await getBalanceOfBNSingleCall(
					pair?.liquidityToken.address as string,
					address,
					provider ?? null
				);

				const value = JSBI.BigInt(pairBalance?.toString());
				const pairBalanceAmount = new TokenAmount(
					pair?.liquidityToken as Token,
					value
				);

				const amount = `${removeScientificNotation(
					pairBalanceAmount.toSignificant(5)
				)}`;

				return { pair, amount };
			})
		);
		const formattedPoolsBalances = poolsBalances.reduce(
			(acc, curr) => ({
				...acc,
				[`${unwrappedToken(curr.pair.token0).symbol}-${
					unwrappedToken(curr.pair.token1).symbol
				}`]: curr.amount,
			}),
			{}
		);

		setPoolBalance(formattedPoolsBalances);
	}, [pairs]);

	useMemo(async () => {
		const fetchSysPrice = await pegasysClient.query({
			query: SYS_PRICE(),
			fetchPolicy: "cache-first",
		});

		const sysPrice = fetchSysPrice?.data?.bundles[0]?.sysPrice;

		currenciesArr.map(currencyPair => {
			if (pairInfo?.oneDay?.[currencyPair]) {
				const currentDayVolume =
					parseFloat(`${pairInfo?.general?.[currencyPair]?.volumeUSD}`) -
					parseFloat(`${pairInfo?.oneDay?.[currencyPair]?.volumeUSD}`);
				setPoolsApr(prevState => {
					const value = parseFloat(
						(
							(Number(currentDayVolume) * 0.003 * 365 * 100) /
							(Number(pairInfo?.general?.[currencyPair]?.trackedReserveSYS) *
								sysPrice)
						).toString()
					);
					return {
						...prevState,
						[currencyPair]: value,
					};
				});
				setPoolsWithLiquidity(prevState => ({
					...prevState,
					[currencyPair]: +poolBalance[currencyPair],
				}));
				setPoolsLiquidity(prevState => ({
					...prevState,
					[currencyPair]:
						Number(pairInfo.general?.[currencyPair]?.trackedReserveSYS) *
						sysPrice,
				}));
				setPoolsVolume(prevState => ({
					...prevState,
					[currencyPair]:
						Number(pairInfo.general?.[currencyPair]?.volumeUSD) -
						Number(pairInfo.oneDay?.[currencyPair]?.volumeUSD),
				}));
			}
			if (!Number.isNaN(+poolBalance[currencyPair])) {
				setIsLoading(false);
			}
			// eslint-disable-next-line
			return;
		});
	}, [poolBalance]);

	useEffect(() => {
		if (!isLoading && pairs.length !== 0) {
			setSortType("your-pools");
		}
	}, [isLoading]);

	const providerValue = useMemo(
		() => ({
			poolsApr,
			setPoolsApr,
			poolsWithLiquidity,
			setPoolsWithLiquidity,
			poolsLiquidity,
			setPoolsLiquidity,
			poolsVolume,
			setPoolsVolume,
			pairs,
			setPairs,
			isLoading,
			setIsLoading,
			pairInfo,
			setPairInfo,
			sortType,
			setSortType,
		}),
		[
			poolsApr,
			setPoolsApr,
			poolsWithLiquidity,
			setPoolsWithLiquidity,
			poolsLiquidity,
			setPoolsLiquidity,
			poolsVolume,
			setPoolsVolume,
			pairs,
			setPairs,
			isLoading,
			setIsLoading,
			pairInfo,
			setPairInfo,
			sortType,
			setSortType,
		]
	);

	return (
		<PoolsContext.Provider value={providerValue}>
			{children}
		</PoolsContext.Provider>
	);
};
