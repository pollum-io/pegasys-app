import { Pair } from "@pollum-io/pegasys-sdk";

export interface ITransactions {
	// id: number;
	symbol0: string;
	symbol1: string;
	totalValue: number;
	tokenAmount0: string;
	tokenAmount1: string;
	time: number;
	type: string;
}

export interface IReturnTransactions {
	mints: ITransactions[];
	burns: ITransactions[];
	swaps: ITransactions[];
}

export interface ILiquidity {
	liquidity: number;
	fees: number;
	positions: Array<{
		valueUSD: number;
		reserve0: number;
		reserve1: number;
		symbol0: any;
		symbol1: any;
		poolShare: number;
	}>;
}

export interface IContextTransactions {
	swapsTransactions: ITransactions[];
	burnsTransactions: ITransactions[];
	mintsTransactions: ITransactions[];
	pairs: Pair[];
	allTransactions: ITransactions[];
	getTotalValueSwapped: number;
	walletBalance: any;
	liquidityPosition: ILiquidity;
}
