/* eslint-disable */
// @ts-nocheck
import { getAddress } from "@ethersproject/address";
import {
	ChainId,
	Pair,
	Token,
	JSBI,
	Percent,
	TokenAmount,
} from "@pollum-io/pegasys-sdk";
import {
	pegasysClient,
	GET_TRANSACTIONS,
	WALLET_BALANCE_TOKEN,
	USER_HISTORY,
	PAIRS_CURRENT,
	PAIR_DATA,
	SYS_PRICE,
} from "apollo";
import {
	getTokenPairs,
	toV2LiquidityToken,
	getBalanceOfBNSingleCall,
	getTotalSupply,
	verifyZerosInBalanceAndFormat,
	getBlocksFromTimestamps,
} from "utils";
import { IReturnTransactions } from "pegasys-services/dto/contexts/portfolio";
import { WrappedTokenInfo } from "types";
import { TProvider, TSigner } from "pegasys-services/dto";
import { usePairs as getPairs } from "hooks";
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
			const amount0 = tx.amount0
				? tx.amount0
				: tx.amount0In === "0"
				? tx.amount0Out
				: tx.amount0In;
			const amount1 = tx.amount1
				? tx.amount1
				: tx.amount1In === "0"
				? tx.amount1Out
				: tx.amount1In;

			const symbol0 = tx.pair.token0.symbol;
			const symbol1 = tx.pair.token1.symbol;
			const totalValue = Number(tx.amountUSD);
			const tokenAmount0 = `${Number(amount0).toFixed(5)} ${
				tx.pair.token0.symbol
			}`;
			const tokenAmount1 = `${Number(amount1).toFixed(5)} ${
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

	static async getDepositedTokens(
		pair: Pair,
		walletInfos: {
			provider: TProvider | null;
			signer: TSigner | null;
			walletAddress: string;
		}
	) {
		const { signer, walletAddress: address, provider } = walletInfos;

		const pairBalance = await getBalanceOfBNSingleCall(
			pair?.liquidityToken.address as string,
			address,
			signer ?? null
		);

		const value = JSBI.BigInt(pairBalance?.toString());

		const pairBalanceAmount = new TokenAmount(
			pair?.liquidityToken as Token,
			value
		);

		const totalSupply = await getTotalSupply(
			pair?.liquidityToken as Token,
			signer as Signer,
			provider
		);

		const [token0Deposited, token1Deposited] =
			!!pair &&
			!!totalSupply &&
			!!pairBalanceAmount &&
			// this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
			JSBI.greaterThanOrEqual(totalSupply.raw, pairBalanceAmount.raw)
				? [
						pair.getLiquidityValue(
							pair.token0,
							totalSupply,
							pairBalanceAmount,
							false
						),
						pair.getLiquidityValue(
							pair.token1,
							totalSupply,
							pairBalanceAmount,
							false
						),
				  ]
				: [undefined, undefined];

		return [token0Deposited, token1Deposited];
	}

	static async getPoolPercentShare(
		pair: Pair,
		walletInfos: {
			provider: TProvider | null;
			signer: TSigner | null;
			walletAddress: string;
		}
	) {
		const { signer, walletAddress: address, provider } = walletInfos;
		const pairBalance = await getBalanceOfBNSingleCall(
			pair?.liquidityToken.address as string,
			address,
			signer ?? null
		);

		const value = JSBI.BigInt(pairBalance?.toString());

		const pairBalanceAmount = new TokenAmount(
			pair?.liquidityToken as Token,
			value
		);

		const totalSupply = await getTotalSupply(
			pair?.liquidityToken as Token,
			signer as Signer,
			provider
		);

		const poolTokenPercentage =
			pairBalanceAmount &&
			totalSupply &&
			JSBI.greaterThanOrEqual(totalSupply.raw, pairBalanceAmount.raw)
				? new Percent(pairBalanceAmount.raw, totalSupply.raw)
				: undefined;

		return Number(poolTokenPercentage?.toSignificant(6)).toFixed(2);
	}

	static async getPairsData(
		walletInfos: {
			chainId: ChainId;
			provider: TProvider | null;
			walletAddress: string;
		},
		userTokensBalance: WrappedTokenInfo[]
	) {
		const { chainId } = walletInfos;
		// eslint-disable-next-line
		let allTokens = [] as any;

		const tokens = getTokenPairs(chainId, userTokensBalance);

		if (
			tokens.every(
				token => token[0]?.chainId === chainId && token[1]?.chainId === chainId
			)
		) {
			allTokens = tokens;
		}

		const [{ number: oneDay }] = await getBlocksFromTimestamps();

		const fetchPairs = await pegasysClient.query({
			query: PAIRS_CURRENT,
			fetchPolicy: "cache-first",
		});

		const fetchPairsAddresses = await Promise.all([fetchPairs]);

		const pairAddresses = fetchPairsAddresses[0]?.data?.pairs;

		const oneDayPairInfos = await Promise.all(
			pairAddresses.map(async (token: { id: string }) => {
				const volume = await pegasysClient.query({
					query: PAIR_DATA(token.id, Number(oneDay)),
					fetchPolicy: "network-only",
				});

				return volume.data.pairs[0];
			})
		);
		const formattedOneDayPairsInfo = oneDayPairInfos.reduce(
			(acc, curr) => ({
				...acc,
				[`${curr.token0.symbol}-${curr.token1.symbol}`]: curr,
			}),
			{}
		);
		const oneDayCommonPairs = allTokens
			.map(
				currency =>
					formattedOneDayPairsInfo[
						`${
							currency[0]?.symbol === "WETH"
								? "ETH"
								: currency[0]?.symbol === "SYS"
								? "WSYS"
								: currency[0]?.symbol
						}-${currency[1]?.symbol === "WETH" ? "ETH" : currency[1]?.symbol}`
					]
			)
			.filter(item => item !== undefined);

		const formattedOneDayCommonPairs = oneDayCommonPairs.reduce(
			(acc, curr) => ({
				...acc,
				[`${
					curr?.token0?.symbol === "WSYS"
						? "SYS"
						: curr?.token0?.symbol === "ETH"
						? "WETH"
						: curr?.token0?.symbol
				}-${
					curr?.token1?.symbol === "WSYS"
						? "SYS"
						: curr?.token1?.symbol === "ETH"
						? "WETH"
						: curr?.token1?.symbol
				}`]: curr,
			}),
			{}
		);

		const generalPairInfos = await Promise.all(
			pairAddresses.map(async (token: { id: string }) => {
				const volume = await pegasysClient.query({
					query: PAIR_DATA(token.id),
					fetchPolicy: "network-only",
				});

				return volume.data.pairs[0];
			})
		);

		const formattedGeneralPairsInfo = generalPairInfos.reduce(
			(acc, curr) => ({
				...acc,
				[`${curr.token0.symbol}-${curr.token1.symbol}`]: curr,
			}),
			{}
		);
		const generalDaysCommonPairs = allTokens
			.map(
				currency =>
					formattedGeneralPairsInfo[
						`${
							currency[0]?.symbol === "WETH"
								? "ETH"
								: currency[0]?.symbol === "SYS"
								? "WSYS"
								: currency[0]?.symbol
						}-${currency[1]?.symbol === "WETH" ? "ETH" : currency[1]?.symbol}`
					]
			)
			.filter(item => item !== undefined);

		const formattedGeneralCommonPairs = generalDaysCommonPairs.reduce(
			(acc, curr) => ({
				...acc,
				[`${
					curr?.token0?.symbol === "WSYS"
						? "SYS"
						: curr?.token0?.symbol === "ETH"
						? "WETH"
						: curr?.token0?.symbol
				}-${
					curr?.token1?.symbol === "WSYS"
						? "SYS"
						: curr?.token1?.symbol === "ETH"
						? "WETH"
						: curr?.token1?.symbol
				}`]: curr,
			}),
			{}
		);

		const fetchSysPrice = await pegasysClient.query({
			query: SYS_PRICE(),
			fetchPolicy: "cache-first",
		});

		const sysPrice = fetchSysPrice?.data?.bundles[0]?.sysPrice;

		return {
			oneDay: formattedOneDayCommonPairs,
			allDays: formattedGeneralCommonPairs,
			sysPrice: +sysPrice,
		};
	}

	static async getAllUserTokenPairs(
		walletInfos: {
			chainId: ChainId;
			provider: TProvider | null;
			walletAddress: string;
		},
		userTokensBalance: WrappedTokenInfo[]
	) {
		const { chainId } = walletInfos;
		// eslint-disable-next-line
		let allTokens = [] as any;

		const tokens = getTokenPairs(chainId, userTokensBalance);

		if (
			tokens.every(
				token => token[0]?.chainId === chainId && token[1]?.chainId === chainId
			)
		) {
			allTokens = tokens;
		}

		const tokensWithLiquidity = allTokens.map((tokens: any) => ({
			liquidityToken: toV2LiquidityToken(
				tokens as [WrappedTokenInfo, Token],
				chainId
			),
			tokens: tokens as [WrappedTokenInfo, Token],
		}));

		// eslint-disable-next-line
		const v2Tokens = await getPairs(
			tokensWithLiquidity.map(({ tokens }: { tokens: any }) => tokens),
			walletInfos
		);

		const allV2PairsWithLiquidity = v2Tokens
			.map(([, pair]) => pair)
			.filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

		const allUniqueV2PairsWithLiquidity = allV2PairsWithLiquidity
			.map(pair => pair)
			.filter(
				(item, index) =>
					allV2PairsWithLiquidity
						.map(pair => pair.liquidityToken.address)
						.indexOf(item.liquidityToken.address) === index
			);

		return allUniqueV2PairsWithLiquidity;
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
				addressToken0: getAddress(position.pair.token0.id),
				symbol1: position.pair.token1.symbol,
				addressToken1: getAddress(position.pair.token1.id),
				poolShare: verifyZerosInBalanceAndFormat(poolShare, 2),
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
