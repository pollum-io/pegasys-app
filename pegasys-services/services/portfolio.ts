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
	private static parseTransaction(transactions: any[], type: string) {
		return transactions.map((tx: any) => {
			const symbol0 = tx.pair.token0.symbol;
			const symbol1 = tx.pair.token1.symbol;
			const totalValue = Number(tx.amountUSD);
			const tokenAmount0 = `${Number(tx.amount0).toFixed(5)} ${
				tx.pair.token0.symbol
			}`;
			const tokenAmount1 = `${Number(tx.amount1).toFixed(5)} ${
				tx.pair.token1.symbol
			}`;
			const time = Number(tx.transaction.timestamp);

			return {
				symbol0,
				symbol1,
				totalValue,
				tokenAmount0,
				tokenAmount1,
				time,
				type,
			};
		});
	}

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
			mints: this.parseTransaction(mints, "add"),
			burns: this.parseTransaction(burns, "remove"),
			swaps: this.parseTransaction(swaps, "swap"),
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

	static async getUserLiquidityPositions(userAddress: string) {
		const snapshots: { [k: string]: Array<any> } = {};
		let skip = 0;
		let finished = false;

		while (!finished) {
			// eslint-disable-next-line no-await-in-loop
			const fetchUserPosition = await pegasysClient.query({
				query: USER_HISTORY,
				fetchPolicy: "no-cache",
				variables: { user: userAddress.toLowerCase(), skip },
			});
			console.log(
				fetchUserPosition.data.liquidityPositionSnapshots,
				"fetchUserPosition.data.liquidityPositionSnapshots"
			);

			fetchUserPosition.data.liquidityPositionSnapshots.forEach((snap: any) => {
				if (snapshots[snap.pair.id]) snapshots[snap.pair.id].push(snap);
				else snapshots[snap.pair.id] = [snap];
			});

			if (fetchUserPosition.data.liquidityPositionSnapshots.length < 1000)
				finished = true;
			else skip += 1000;
		}

		const positions = Object.keys(snapshots).map(pairSnapshots => {
			const position =
				snapshots[pairSnapshots][snapshots[pairSnapshots].length - 1];

			const poolShare =
				position.liquidityTokenBalance / position.pair.totalSupply;

			const valueUSD = poolShare * position.reserveUSD;
			const reserve0 = poolShare * parseFloat(position.reserve0);
			const reserve1 = poolShare * parseFloat(position.reserve1);

			return {
				valueUSD,
				reserve0,
				reserve1,
				symbol0: position.pair.token0.symbol,
				symbol1: position.pair.token1.symbol,
				poolShare,
			};
		});

		const liquidity = positions.reduce((acc, curr) => acc + curr.valueUSD, 0);
		return {
			liquidity,
			fees: liquidity * 0.0025,
			positions,
		};
	}
}

export default PortfolioServices;
