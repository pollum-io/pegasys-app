import { TokenAmount } from "@pollum-io/pegasys-sdk";
import { pegasysClient, GET_TRANSACTIONS } from "apollo";
import { IReturnTransactions } from "pegasys-services/dto/contexts/portfolio";

// TODO TYPES

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
}

export default PortfolioServices;
