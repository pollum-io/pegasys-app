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

export interface IContextTransactions {
	swapsTransactions: ITransactions[];
	burnsTransactions: ITransactions[];
	mintsTransactions: ITransactions[];
	allTransactions: ITransactions[];
	getTotalValueSwapped: number;
	walletBalance: any;
}
