export interface ILiquidityTokens {
	[address: string]: {
		address: string;
		balance: number;
	};
}
