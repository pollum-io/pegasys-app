import gql from "graphql-tag";

export const GET_TOKENS_GRAPH_CANDLE = gql`
	query candles($token0: String!, $token1: String!, $period: Int!) {
		candles(
			orderBy: time
			first: 1000
			orderDirection: desc
			where: { token0: $token0, token1: $token1, period: $period }
		) {
			time
			open
			high
			low
			close
		}
	}
`;

const PairFields = `
  fragment PairFields on Pair {
    id
    txCount
    token0 {
      id
      symbol
      name
      totalLiquidity
      derivedSYS
    }
    token1 {
      id
      symbol
      name
      totalLiquidity
      derivedSYS
    }
    reserve0
    reserve1
    reserveUSD
    totalSupply
    trackedReserveSYS
    reserveSYS
    volumeUSD
    untrackedVolumeUSD
    token0Price
    token1Price
    createdAtTimestamp
  }
`;
export const PAIR_DATA = (pairAddress: string, block?: number) => {
	const queryString = `
    ${PairFields}
    query pairs {
      pairs(${
				block ? `block: {number: ${block}}` : ``
			} where: { id: "${pairAddress}"} ) {
        ...PairFields
      }
    }`;
	return gql(queryString);
};

export const SYS_PRICE = () => {
	const queryString = ` query bundles {
      bundles(where: { id: 1 }) {
        id
        sysPrice
      }
    }
  `;
	return gql(queryString);
};

export const USER_POSITIONS = gql`
	query liquidityPositions($user: Bytes!) {
		liquidityPositions(where: { user: $user }) {
			pair {
				id
				reserve0
				reserve1
				reserveUSD
				token0 {
					id
					symbol
					derivedSYS
				}
				token1 {
					id
					symbol
					derivedSYS
				}
				totalSupply
			}
			liquidityTokenBalance
		}
	}
`;

export const PAIRS_CURRENT = gql`
	query pairs {
		pairs(first: 200, orderBy: reserveUSD, orderDirection: desc) {
			id
		}
	}
`;

export const GET_BLOCKS = (timestamps: number[]) => {
	let queryString = "query blocks {";
	queryString += timestamps.map(
		timestamp => `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
			timestamp + 600
		} }) {
      number
    }`
	);
	queryString += "}";
	return gql(queryString);
};

export const GET_PROPOSALS = gql`
	query proposalsQuery($proposalCount: Int!) {
		proposals(
			orderBy: startBlock
			first: $proposalCount
			orderDirection: desc
		) {
			id
			description
			proposer {
				id
			}
			status
			signatures
			targets
			calldatas
			startBlock
			endBlock
			votes {
				votes
				support
				voter {
					id
				}
			}
		}
	}
`;

export const GET_STAKE_DATA = gql`
	query stakeQuery($id: ID!, $walletAddress: ID!, $date: Int!) {
		pegasysStaking(id: $id) {
			psysStaked
			psysStakedUSD
			users(where: { id: $walletAddress }) {
				psysStaked
				psysStakedUSD
				psysHarvested
				psysHarvestedUSD
			}
		}
		pegasysStakingDayDatas(where: { date_gte: $date }) {
			depositFeePSYS
			depositFeeUSD
		}
	}
`;

export const feeCollectorDayData = gql`
	query dayDataQuery($date: Int!) {
		dayDatas(where: { date_gte: $date }) {
			tokenRemitted
		}
	}
`;
