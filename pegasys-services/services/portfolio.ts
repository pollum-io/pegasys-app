import { TokenAmount } from "@pollum-io/pegasys-sdk";
import {
	pegasysClient,
	GET_TRANSACTIONS,
	WALLET_BALANCE_TOKEN,
	USER_HISTORY,
	USER_POSITIONS,
} from "apollo";
import { IReturnTransactions } from "pegasys-services/dto/contexts/portfolio";

interface IWalletBalance {
	priceUSD: any;
	balance: any;
	value: any;
}

export interface IReturnWallet {
	walletBalances: IWalletBalance[];
}

class PortfolioServices {
	static async getTransactions(
		walletAddress: string
	): Promise<IReturnTransactions> {
		const fetchTransactions = await pegasysClient.query({
			query: GET_TRANSACTIONS,
			fetchPolicy: "cache-first",
			variables: { wallet: walletAddress },
		});

		if (!fetchTransactions.data) return { mints: [], burns: [], swaps: [] };

		const { mints, burns, swaps } = fetchTransactions.data;

		return {
			mints: mints.map((mintValues: any) => {
				const type = "add";
				const symbol0 = mintValues.pair.token0.symbol;
				const symbol1 = mintValues.pair.token1.symbol;
				const totalValue = Number(mintValues.amountUSD);
				const tokenAmount0 = `${Number(mintValues.amount0).toFixed(5)} ${
					mintValues.pair.token0.symbol
				}`;
				const tokenAmount1 = `${Number(mintValues.amount1).toFixed(5)} ${
					mintValues.pair.token1.symbol
				}`;
				const time = Number(mintValues.transaction.timestamp);

				return {
					symbol0,
					symbol1,
					totalValue,
					tokenAmount0,
					tokenAmount1,
					time,
					type,
				};
			}),

			burns: burns.map((burnsValues: any) => {
				const type = "remove";
				const symbol0 = burnsValues.pair.token0.symbol;
				const symbol1 = burnsValues.pair.token1.symbol;
				const totalValue = Number(burnsValues.amountUSD);
				const tokenAmount0 = `${burnsValues.amount0} ${burnsValues.pair.token0.symbol}`;
				const tokenAmount1 = `${burnsValues.amount1} ${burnsValues.pair.token1.symbol}`;
				const time = Number(burnsValues.transaction.timestamp);

				return {
					symbol0,
					symbol1,
					totalValue,
					tokenAmount0,
					tokenAmount1,
					time,
					type,
				};
			}),

			swaps: swaps.map((swapsValues: any) => {
				const type = "swap";
				const symbol0 = swapsValues.pair.token0.symbol;
				const symbol1 = swapsValues.pair.token1.symbol;
				const totalValue = Number(swapsValues.amountUSD);
				const tokenAmount0 = `${Number(swapsValues.amount0In).toFixed(5)} ${
					swapsValues.pair.token0.symbol
				}`;
				const tokenAmount1 = `${Number(swapsValues.amount1Out).toFixed(5)} ${
					swapsValues.pair.token1.symbol
				}`;
				const time = Number(swapsValues.transaction.timestamp);

				return {
					symbol0,
					symbol1,
					totalValue,
					tokenAmount0,
					tokenAmount1,
					time,
					type,
				};
			}),
		};
	}

	static async getWalletBalance(tokenList: Array<any>): Promise<IReturnWallet> {
		const walletBalances = await Promise.all(
			tokenList.map(async item => {
				const fetchWalletBalance = await pegasysClient.query({
					query: WALLET_BALANCE_TOKEN,
					fetchPolicy: "cache-first",
					variables: { tokenAddr: item.address.toLowerCase() },
				});

				const { priceUSD } = fetchWalletBalance?.data?.tokenDayDatas[0] ?? {
					priceUSD: 0,
				};

				return {
					tokenImage: item.tokenInfo.logoURI,
					symbol: item.symbol,
					priceUSD: Number(priceUSD),
					balance: Number(item.tokenInfo.formattedBalance),
					decimals: item.tokenInfo.decimals,
					value: Number(priceUSD) * Number(item.tokenInfo.formattedBalance),
				};
			})
		);

		return { walletBalances };
	}

	static async getUserPosition(userAddress: any, pair: any): Promise<any> {
		const snapshots = [];
		let skip = 0;
		let finished = false;
		while (!finished) {
			// eslint-disable-next-line no-await-in-loop
			const fetchUserPosition = await pegasysClient.query({
				query: USER_HISTORY,
				fetchPolicy: "no-cache",
				variables: { user: userAddress, skip },
			});

			if (fetchUserPosition.data.liquidityPositionSnapshots.length < 1000) {
				finished = true;
			} else {
				skip += 1000;
			}

			snapshots.push(
				...fetchUserPosition.data.liquidityPositionSnapshots.filter(
					(currentSnapshot: any) => currentSnapshot.pair.id === pair.id
				)
			);
		}

		const position = snapshots[snapshots.length - 1];

		return position;
	}

	static async getBanana(userAddress: any): Promise<any> {
		const fetchGetBanana = await pegasysClient.query({
			query: USER_POSITIONS,
			fetchPolicy: "no-cache",
			variables: { user: userAddress },
		});

		if (!fetchGetBanana.data) return [];

		Promise.all(
			fetchGetBanana.data.liquidityPositions.map(async (value: any) => {
				PortfolioServices.getUserPosition(userAddress);
			})
		);

		return fetchGetBanana;
	}
}

export default PortfolioServices;
