export interface ICommonPairs {
	oneDay: {
		[pairAddress: string]: {
			id: string;
			txCount: string;
			token0: {
				id: string;
				symbol: string;
				name: string;
				totalLiquidity: string;
				derivedSYS: string;
				__typename: string;
			};
			token1: {
				id: string;
				symbol: string;
				name: string;
				totalLiquidity: string;
				derivedSYS: string;
				__typename: string;
			};
			reserve0: string;
			reserve1: string;
			reserveUSD: string;
			totalSupply: string;
			trackedReserveSYS: string;
			reserveSYS: string;
			volumeUSD: string;
			untrackedVolumeUSD: string;
			token0Price: string;
			token1Price: string;
			createdAtTimestamp: string;
			__typename: string;
		};
	};
	general: {
		[pairAddress: string]: {
			id: string;
			txCount: string;
			token0: {
				id: string;
				symbol: string;
				name: string;
				totalLiquidity: string;
				derivedSYS: string;
				__typename: string;
			};
			token1: {
				id: string;
				symbol: string;
				name: string;
				totalLiquidity: string;
				derivedSYS: string;
				__typename: string;
			};
			reserve0: string;
			reserve1: string;
			reserveUSD: string;
			totalSupply: string;
			trackedReserveSYS: string;
			reserveSYS: string;
			volumeUSD: string;
			untrackedVolumeUSD: string;
			token0Price: string;
			token1Price: string;
			createdAtTimestamp: string;
			__typename: string;
		};
	};
}
