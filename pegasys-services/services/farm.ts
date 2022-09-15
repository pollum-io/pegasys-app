// import {
// 	ChainId,
// 	CurrencyAmount,
// 	JSBI,
// 	NSYS,
// 	TokenAmount,
// 	Token,
// 	Pair,
// 	WSYS,
// } from "@pollum-io/pegasys-sdk";
// import IPegasysRouterABI from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-periphery/interfaces/IPegasysRouter.sol/IPegasysRouter.json";

// import { tryParseAmount, wrappedCurrencyAmount, wrappedCurrency } from "utils";
// import { ApprovalState } from "contexts";
// import { MaxUint256 } from "@ethersproject/constants";
// import { BigNumber } from "@ethersproject/bignumber";

// import { PSYS } from "helpers/consts";
// import { PairState } from "hooks";
// import { Interface } from "@ethersproject/abi";
// import { abi as REWARDERVIAMULTIPLIER_ABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/RewarderViaMultiplier.sol/RewarderViaMultiplier.json";
import { WrappedTokenInfo } from "types";
import { ChainId, JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { ContractFramework } from "../frameworks";
import {
	// IPoolServicesCalculateSlippageAmountProps,
	// IPoolServicesApproveProps,
	// IPoolServicesGetCurrencyAmountsProps,
	// IPoolServicesAddLiquidityProps,
	IStakeInfo,
} from "../dto";
import LpTokenServices from "./lpToken";

import {
	BIG_INT_SECONDS_IN_WEEK,
	PSYS,
	ZERO_ADDRESS,
	// 	API,
	// 	MINICHEF_ADDRESS,
	// 	ROUTER_ADDRESS,
	// 	DOUBLE_SIDE_STAKING,
} from "../constants";

class FarmServices {
	static async getStakeInfos(
		// userTokensBalance: WrappedTokenInfo[],
		tokenPairs: Array<[WrappedTokenInfo, Token]>,
		address: string,
		chainId: ChainId
	): Promise<IStakeInfo[]> {
		const lpTokens = await LpTokenServices.getLpTokens();
		const poolMap = await LpTokenServices.getPoolMap(lpTokens);

		const pairsWithLiquidityToken: IStakeInfo[] = [];

		await Promise.all(
			tokenPairs.map(async tokenPair => {
				const lpToken = LpTokenServices.getLpToken(
					tokenPair[0],
					tokenPair[1],
					chainId
				);

				const poolId = poolMap[lpToken.address];

				if (
					poolId !== undefined &&
					lpToken &&
					lpTokens.includes(lpToken.address)
				) {
					delete poolMap[lpToken.address];

					const rewarder = await LpTokenServices.getRewarder(poolId);

					const isSuperFarm = rewarder !== ZERO_ADDRESS;

					const aprs = await LpTokenServices.getAprs(poolId, isSuperFarm);

					const totalStake = await LpTokenServices.getBalance(lpToken.address);

					const userStake = await LpTokenServices.getUserStake(poolId, address);

					const userUnclaimedPSYS = await LpTokenServices.getUserUnclaimedPSYS(
						poolId,
						address
					);

					const getAllocPoint = await LpTokenServices.getAllocPoint(poolId);

					const totalAllocPoint = await LpTokenServices.getTotalAllocPoint();

					const rewardPerSecond = await LpTokenServices.getRewardPerSec();

					const userAvailableLpToken =
						await LpTokenServices.getAvailableLpTokens(
							lpToken.address,
							address
						);

					const totalStakedAmount = new TokenAmount(
						lpToken,
						JSBI.BigInt(totalStake.toString() ?? 0)
					);

					const stakedAmount = new TokenAmount(
						lpToken,
						JSBI.BigInt(userStake.toString() ?? 0)
					);

					const psys = PSYS[chainId ?? ChainId.NEVM];

					const unclaimedPSYS = new TokenAmount(
						psys,
						JSBI.BigInt(userUnclaimedPSYS.toString() ?? 0)
					);

					const availableLpTokens = new TokenAmount(
						lpToken,
						JSBI.BigInt(userAvailableLpToken.toString() ?? 0)
					);

					const poolAllocPointAmount = new TokenAmount(
						lpToken,
						JSBI.BigInt(getAllocPoint.toString() ?? 0)
					);

					const totalAllocPointAmount = new TokenAmount(
						lpToken,
						JSBI.BigInt(totalAllocPoint.toString() ?? 0)
					);

					const rewardRatePerSecAmount = new TokenAmount(
						psys,
						JSBI.BigInt(rewardPerSecond.toString() ?? 0)
					);

					const poolRewardRate = new TokenAmount(
						psys,
						JSBI.divide(
							JSBI.multiply(
								poolAllocPointAmount.raw,
								rewardRatePerSecAmount.raw
							),
							totalAllocPointAmount.raw
						)
					);

					const totalRewardRatePerWeek = new TokenAmount(
						psys,
						JSBI.multiply(poolRewardRate.raw, BIG_INT_SECONDS_IN_WEEK)
					);

					let rewarderMultiplier: bigint | undefined;

					if (isSuperFarm) {
						rewarderMultiplier = await LpTokenServices.getRewardMultiplier(
							rewarder
						);
					}

					pairsWithLiquidityToken.push({
						tokenA: tokenPair[0],
						tokenB: tokenPair[1],
						poolId,
						totalStakedAmount,
						stakedAmount,
						unclaimedPSYS,
						availableLpTokens,
						totalRewardRatePerWeek,
						rewarderMultiplier,
						lpToken,
						...aprs,
					});
				}
			})
		);

		return pairsWithLiquidityToken;
	}

	static async withdraw(poolId: number, amount: string, address: string) {
		const contract = LpTokenServices.getLpContract();

		await ContractFramework.call({
			methodName: "withdrawAndHarvest",
			contract,
			args: [poolId, `0x${amount}`, address],
		});
	}

	static async claim(poolId: number, address: string) {
		const contract = LpTokenServices.getLpContract();

		await ContractFramework.call({
			methodName: "harvest",
			contract,
			args: [poolId, address],
		});
	}

	static async deposit(poolId: number, amount: string, address: string) {
		const contract = LpTokenServices.getLpContract();

		await ContractFramework.call({
			methodName: "deposit",
			contract,
			args: [poolId, `0x${amount}`, address],
		});
	}

	static async depositWithPermit(
		poolId: number,
		amount: string,
		address: string,
		signatureData: {
			v: number;
			r: string;
			s: string;
			deadline: number;
		}
	) {
		const contract = LpTokenServices.getLpContract();

		await ContractFramework.call({
			methodName: "depositWithPermit",
			contract,
			args: [
				poolId,
				`0x${amount}`,
				address,
				signatureData.deadline,
				signatureData.v,
				signatureData.r,
				signatureData.s,
			],
		});
	}

	// static async getTotalSupply(address: string) {
	// 	// const totalSupplies: { [k: string]: any } = {};

	// 	// await Promise.all(
	// 	// pairAddress.map(async addr => {
	// 	console.log("entrou");

	// 	const contract = ContractFramework.TokenContract(address);

	// 	const totalSupply = await ContractFramework.call({
	// 		contract,
	// 		methodName: "totalSupply",
	// 	});

	// 	// totalSupplies[addr] = totalSupply;
	// 	// })
	// 	// );

	// 	console.log("totalSupply: ", totalSupply);

	// 	return totalSupply;
	// }

	// static async getRewardTokens(rewardsAddresses: string[]) {
	// 	const rewardTokens: { [k: string]: any } = {};

	// 	await Promise.all(
	// 		rewardsAddresses.map(async addr => {
	// 			const contract = ContractFramework.getContract({
	// 				abi: REWARDER_VIA_MULTIPLIER_INTERFACE,
	// 				address: addr,
	// 			});

	// 			const rewardToken = await ContractFramework.call({
	// 				contract,
	// 				methodName: "getRewardTokens",
	// 			});

	// 			rewardTokens[addr] = rewardToken;
	// 		})
	// 	);

	// 	return rewardTokens;
	// }

	// static async getRewardMultipliers(rewardsAddresses: string[]) {
	// 	const rewardMultipliers: { [k: string]: any } = {};

	// 	await Promise.all(
	// 		rewardsAddresses.map(async addr => {
	// 			const contract = ContractFramework.getContract({
	// 				abi: REWARDER_VIA_MULTIPLIER_INTERFACE,
	// 				address: addr,
	// 			});

	// 			const rewardMultiplier = await ContractFramework.call({
	// 				contract,
	// 				methodName: "getRewardMultipliers",
	// 			});

	// 			rewardMultipliers[addr] = rewardMultiplier;
	// 		})
	// 	);

	// 	return rewardMultipliers;
	// }

	// static async getPoolInfos(poolIds: number[]) {
	// 	const poolsInfo: { [k: string]: any } = {};

	// 	const contract = ContractFramework.StakingContract(MINICHEF_ADDRESS);

	// 	await Promise.all(
	// 		poolIds.map(async pid => {
	// 			const poolInfo = await ContractFramework.call({
	// 				contract,
	// 				methodName: "poolInfo",
	// 				args: [pid],
	// 			});

	// 			poolsInfo[pid] = poolInfo;
	// 		})
	// 	);

	// 	return poolsInfo;
	// }

	// static async getUsersInfos(poolIds: number[], address: string) {
	// 	const usersInfo: { [k: string]: any } = {};

	// 	const contract = ContractFramework.StakingContract(MINICHEF_ADDRESS);

	// 	await Promise.all(
	// 		poolIds.map(async pid => {
	// 			const userInfo = await ContractFramework.call({
	// 				contract,
	// 				methodName: "userInfo",
	// 				args: [pid, address],
	// 			});

	// 			usersInfo[pid] = userInfo;
	// 		})
	// 	);

	// 	return usersInfo;
	// }

	// static async getPendingRewards(poolIds: number[], address: string) {
	// 	const pendingRewards: { [k: string]: any } = {};

	// 	const contract = ContractFramework.StakingContract(MINICHEF_ADDRESS);

	// 	await Promise.all(
	// 		poolIds.map(async pid => {
	// 			const pendingReward = await ContractFramework.call({
	// 				contract,
	// 				methodName: "pendingReward",
	// 				args: [pid, address],
	// 			});

	// 			pendingRewards[pid] = pendingReward;
	// 		})
	// 	);

	// 	return pendingRewards;
	// }

	// static async getRewardPerSec() {
	// 	const chainId = await WalletFramework.getChain();

	// 	const psys = PSYS[(chainId as ChainId) || ChainId.NEVM];

	// 	const contract = ContractFramework.StakingContract(MINICHEF_ADDRESS);

	// 	const rewardPerSecond = await ContractFramework.call({
	// 		contract,
	// 		methodName: "rewardPerSecond",
	// 	});

	// 	return new TokenAmount(psys, JSBI.BigInt(rewardPerSecond));
	// }

	// static async getTotalAllocPoint() {
	// 	const contract = ContractFramework.StakingContract(MINICHEF_ADDRESS);

	// 	const totalAllocPoint = await ContractFramework.call({
	// 		contract,
	// 		methodName: "totalAllocPoint",
	// 	});

	// 	return totalAllocPoint;
	// }

	// static async getRewardsExpiration() {
	// 	const contract = ContractFramework.StakingContract(MINICHEF_ADDRESS);

	// 	const rewardsExpiration = await ContractFramework.call({
	// 		contract,
	// 		methodName: "rewardsExpiration",
	// 	});

	// 	return rewardsExpiration;
	// }

	// static async getWeeklyRewardRate() {
	// 	const rewardPerSecond = await this.getRewardPerSec();
	// }

	// static async useMinichefStakingInfos(
	// 	pairs: [PairState, Pair | null][],
	// 	pairToFilterBy?: Pair | null
	// ): DoubleSideStakingInfo[] {
	// 	const { chainId, address } = await WalletFramework.getConnectionInfo();

	// 	const minichefContract =
	// 		ContractFramework.StakingContract(MINICHEF_ADDRESS);

	// 	const poolMap = await this.useMinichefPools();

	// 	const psys = PSYS[(chainId as ChainId) || ChainId.NEVM];

	// 	const info = chainId
	// 		? Object.values(5).filter(item =>
	// 				pairToFilterBy === undefined
	// 					? true
	// 					: pairToFilterBy === null
	// 					? false
	// 					: pairToFilterBy.involvesToken(item.tokens[0]) &&
	// 					  pairToFilterBy.involvesToken(item.tokens[1])
	// 		  ) ?? []
	// 		: [];

	// 	// const tokens = info.map(({ tokens }) => tokens);
	// 	// const pairs = usePairs(tokens);

	// 	const pairAddresses = pairs.map(
	// 		([state, pair]) => pair?.liquidityToken.address ?? ""
	// 	);

	// 	const pairTotalSupplies = await this.getTotalSupply(pairAddresses);
	// 	const balances = await this.getBalances(pairAddresses);

	// 	const [sysPsysPairState, sysPsysPair] = usePair(
	// 		WSYS[(chainId as ChainId) || ChainId.NEVM],
	// 		psys
	// 	);

	// 	const poolIdArray = useMemo(() => {
	// 		if (!pairAddresses || !poolMap) return [];
	// 		// TODO: clean up this logic. seems like a lot of work to ensure correct types
	// 		const NOT_FOUND = -1;
	// 		const results = pairAddresses.map(
	// 			address => poolMap[address ?? ""] ?? NOT_FOUND
	// 		);
	// 		if (results.some(result => result === NOT_FOUND)) return [];
	// 		return results;
	// 	}, [poolMap, pairAddresses]);

	// 	const poolsIdInput = useMemo(() => {
	// 		if (!poolIdArray) return [];
	// 		return poolIdArray.map(pid => [pid]);
	// 	}, [poolIdArray]);
	// 	const poolInfos = useSingleContractMultipleData(
	// 		minichefContract,
	// 		"poolInfo",
	// 		poolsIdInput ?? []
	// 	);

	// 	const userInfoInput = useMemo(() => {
	// 		if (!poolIdArray || !account) return [];
	// 		return poolIdArray.map(pid => [pid, account]);
	// 	}, [poolIdArray, account]);
	// 	const userInfos = useSingleContractMultipleData(
	// 		minichefContract,
	// 		"userInfo",
	// 		userInfoInput ?? []
	// 	);

	// 	const pendingRewards = useSingleContractMultipleData(
	// 		minichefContract,
	// 		"pendingReward",
	// 		userInfoInput ?? []
	// 	);

	// 	const rewarders = useSingleContractMultipleData(
	// 		minichefContract,
	// 		"rewarder",
	// 		poolsIdInput ?? []
	// 	);

	// 	const rewardsAddresses = useMemo(() => {
	// 		if ((rewarders || []).length === 0) return [];
	// 		if (rewarders.some(item => item.loading)) return [];
	// 		return rewarders.map(reward => reward?.result?.[0]);
	// 	}, [rewarders]);

	// 	const rewardTokensAddresses = useMultipleContractSingleData(
	// 		rewardsAddresses,
	// 		REWARDER_VIA_MULTIPLIER_INTERFACE,
	// 		"getRewardTokens",
	// 		[]
	// 	);

	// 	const rewardTokensMultipliers = useMultipleContractSingleData(
	// 		rewardsAddresses,
	// 		REWARDER_VIA_MULTIPLIER_INTERFACE,
	// 		"getRewardMultipliers",
	// 		[]
	// 	);

	// 	// const rewardPerSecond = useSingleCallResult(
	// 	// 	minichefContract,
	// 	// 	"rewardPerSecond",
	// 	// 	[]
	// 	// ).result;
	// 	// const totalAllocPoint = useSingleCallResult(
	// 	// 	minichefContract,
	// 	// 	"totalAllocPoint",
	// 	// 	[]
	// 	// ).result;
	// 	// const rewardsExpiration = useSingleCallResult(
	// 	// 	minichefContract,
	// 	// 	"rewardsExpiration",
	// 	// 	[]
	// 	// ).result;
	// 	const usdPrice = useUSDCPrice(WSYS[chainId || ChainId.NEVM]);

	// 	const arr = useMemo(() => {
	// 		if (!chainId || !psys) return [];

	// 		return pairAddresses.reduce<any[]>((memo, pairAddress, index) => {
	// 			const pairTotalSupplyState = pairTotalSupplies[index];
	// 			const balanceState = balances[index];
	// 			const poolInfo = poolInfos[index];
	// 			const userPoolInfo = userInfos[index];
	// 			const [pairState, pair] = pairs[index];
	// 			const pendingRewardInfo = pendingRewards[index];
	// 			const rewardTokensAddress = rewardTokensAddresses[index];
	// 			const rewardTokensMultiplier = rewardTokensMultipliers[index];
	// 			const rewardsAddress = rewardsAddresses[index];

	// 			if (
	// 				pairTotalSupplyState?.loading === false &&
	// 				poolInfo?.loading === false &&
	// 				balanceState?.loading === false &&
	// 				pair &&
	// 				sysPsysPair &&
	// 				pairState !== PairState.LOADING &&
	// 				sysPsysPairState !== PairState.LOADING &&
	// 				rewardPerSecond &&
	// 				totalAllocPoint &&
	// 				rewardsExpiration?.[0] &&
	// 				rewardTokensAddress?.loading === false
	// 			) {
	// 				if (
	// 					balanceState?.error ||
	// 					pairTotalSupplyState.error ||
	// 					pairState === PairState.INVALID ||
	// 					pairState === PairState.NOT_EXISTS ||
	// 					sysPsysPairState === PairState.INVALID ||
	// 					sysPsysPairState === PairState.NOT_EXISTS
	// 				) {
	// 					console.error("Failed to load staking rewards info");
	// 					return memo;
	// 				}

	// 				// get the LP token
	// 				const token0 = pair?.token0;
	// 				const token1 = pair?.token1;
	// 				const tokens = [token0, token1];
	// 				const dummyPair = new Pair(
	// 					new TokenAmount(tokens[0], "0"),
	// 					new TokenAmount(tokens[1], "0"),
	// 					chainId
	// 				);
	// 				const lpToken = dummyPair.liquidityToken;

	// 				const poolAllocPointAmount = new TokenAmount(
	// 					lpToken,
	// 					JSBI.BigInt(poolInfo?.result?.allocPoint)
	// 				);
	// 				const totalAllocPointAmount = new TokenAmount(
	// 					lpToken,
	// 					JSBI.BigInt(totalAllocPoint?.[0])
	// 				);
	// 				const rewardRatePerSecAmount = new TokenAmount(
	// 					psys,
	// 					JSBI.BigInt(rewardPerSecond?.[0])
	// 				);
	// 				const poolRewardRate = new TokenAmount(
	// 					psys,
	// 					JSBI.divide(
	// 						JSBI.multiply(
	// 							poolAllocPointAmount.raw,
	// 							rewardRatePerSecAmount.raw
	// 						),
	// 						totalAllocPointAmount.raw
	// 					)
	// 				);

	// 				const totalRewardRatePerWeek = new TokenAmount(
	// 					psys,
	// 					JSBI.multiply(poolRewardRate.raw, BIG_INT_SECONDS_IN_WEEK)
	// 				);

	// 				const periodFinishMs = rewardsExpiration?.[0]?.mul(1000)?.toNumber();
	// 				// periodFinish will be 0 immediately after a reward contract is initialized
	// 				const isPeriodFinished =
	// 					periodFinishMs === 0
	// 						? false
	// 						: periodFinishMs < Date.now() ||
	// 						  poolAllocPointAmount.equalTo("0");

	// 				const totalSupplyStaked = JSBI.BigInt(balanceState?.result?.[0]);
	// 				const totalSupplyAvailable = JSBI.BigInt(
	// 					pairTotalSupplyState?.result?.[0]
	// 				);
	// 				const totalStakedAmount = new TokenAmount(
	// 					lpToken,
	// 					JSBI.BigInt(balanceState?.result?.[0])
	// 				);
	// 				const stakedAmount = new TokenAmount(
	// 					lpToken,
	// 					JSBI.BigInt(userPoolInfo?.result?.amount ?? 0)
	// 				);
	// 				const earnedAmount = new TokenAmount(
	// 					psys,
	// 					JSBI.BigInt(pendingRewardInfo?.result?.pending ?? 0)
	// 				);
	// 				const multiplier = JSBI.BigInt(poolInfo?.result?.allocPoint);

	// 				const isSysPool = pair.involvesToken(WSYS[chainId]);
	// 				const isPsysPool = pair.involvesToken(PSYS[chainId]);

	// 				let totalStakedInUsd = new TokenAmount(DAI[chainId], BIG_INT_ZERO);
	// 				const totalStakedInWsys = new TokenAmount(
	// 					WSYS[chainId],
	// 					BIG_INT_ZERO
	// 				);

	// 				if (JSBI.equal(totalSupplyAvailable, BIG_INT_ZERO)) {
	// 					// Default to 0 values above avoiding division by zero errors
	// 				} else if (pair.involvesToken(DAI[chainId])) {
	// 					const pairValueInDAI = JSBI.multiply(
	// 						pair.reserveOf(DAI[chainId]).raw,
	// 						BIG_INT_TWO
	// 					);
	// 					const stakedValueInDAI = JSBI.divide(
	// 						JSBI.multiply(pairValueInDAI, totalSupplyStaked),
	// 						totalSupplyAvailable
	// 					);
	// 					totalStakedInUsd = new TokenAmount(DAI[chainId], stakedValueInDAI);
	// 				} else if (pair.involvesToken(USDC[chainId])) {
	// 					const pairValueInUSDC = JSBI.multiply(
	// 						pair.reserveOf(USDC[chainId]).raw,
	// 						BIG_INT_TWO
	// 					);
	// 					const stakedValueInUSDC = JSBI.divide(
	// 						JSBI.multiply(pairValueInUSDC, totalSupplyStaked),
	// 						totalSupplyAvailable
	// 					);
	// 					totalStakedInUsd = new TokenAmount(
	// 						USDC[chainId],
	// 						stakedValueInUSDC
	// 					);
	// 				} else if (pair.involvesToken(USDT[chainId])) {
	// 					const pairValueInUSDT = JSBI.multiply(
	// 						pair.reserveOf(USDT[chainId]).raw,
	// 						BIG_INT_TWO
	// 					);
	// 					const stakedValueInUSDT = JSBI.divide(
	// 						JSBI.multiply(pairValueInUSDT, totalSupplyStaked),
	// 						totalSupplyAvailable
	// 					);
	// 					totalStakedInUsd = new TokenAmount(
	// 						USDT[chainId],
	// 						stakedValueInUSDT
	// 					);
	// 				} else if (isSysPool) {
	// 					const totalStakedInWsys = calculateTotalStakedAmountInSys(
	// 						totalSupplyStaked,
	// 						totalSupplyAvailable,
	// 						pair.reserveOf(WSYS[chainId]).raw
	// 					);
	// 					totalStakedInUsd =
	// 						totalStakedInWsys &&
	// 						(usdPrice?.quote(totalStakedInWsys) as TokenAmount);
	// 				} else if (isPsysPool) {
	// 					const totalStakedInWsys = calculateTotalStakedAmountInSysFromPsys(
	// 						totalSupplyStaked,
	// 						totalSupplyAvailable,
	// 						sysPsysPair.reserveOf(psys).raw,
	// 						sysPsysPair.reserveOf(WSYS[chainId]).raw,
	// 						pair.reserveOf(psys).raw
	// 					);
	// 					totalStakedInUsd =
	// 						totalStakedInWsys &&
	// 						(usdPrice?.quote(totalStakedInWsys) as TokenAmount);
	// 				} else {
	// 					// Contains no stablecoin, WSYS, nor PSYS
	// 					console.error(
	// 						`Could not identify total staked value for pair ${pair.liquidityToken.address}`
	// 					);
	// 				}

	// 				const getHypotheticalRewardRate = (
	// 					stakedAmount: TokenAmount,
	// 					totalStakedAmount: TokenAmount,
	// 					totalRewardRate: TokenAmount
	// 				): TokenAmount =>
	// 					new TokenAmount(
	// 						psys,
	// 						JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
	// 							? JSBI.divide(
	// 									JSBI.multiply(totalRewardRate.raw, stakedAmount.raw),
	// 									totalStakedAmount.raw
	// 							  )
	// 							: JSBI.BigInt(0)
	// 					);
	// 				const getExtraTokensWeeklyRewardRate = (
	// 					rewardRatePerWeek: TokenAmount,
	// 					token: Token,
	// 					tokenMultiplier: JSBI | undefined
	// 				) => {
	// 					const TEN_EIGHTEEN = JSBI.exponentiate(
	// 						JSBI.BigInt(10),
	// 						JSBI.BigInt(18)
	// 					);
	// 					// const secondToWeekConversion = JSBI.BigInt(60 * 60 * 24 * 7)
	// 					const rewardMultiplier = JSBI.BigInt(tokenMultiplier || 1);

	// 					const unadjustedRewardPerWeek = JSBI.multiply(
	// 						rewardMultiplier,
	// 						rewardRatePerWeek?.raw
	// 					);

	// 					// const finalReward = JSBI.divide(JSBI.multiply(unadjustedRewardPerWeek, secondToWeekConversion), TEN_EIGHTEEN)
	// 					const finalReward = JSBI.divide(
	// 						unadjustedRewardPerWeek,
	// 						TEN_EIGHTEEN
	// 					);

	// 					return new TokenAmount(token, finalReward);
	// 				};

	// 				const getHypotheticalWeeklyRewardRate = (
	// 					stakedAmount: TokenAmount,
	// 					totalStakedAmount: TokenAmount,
	// 					totalRewardRatePerSecond: TokenAmount
	// 				): TokenAmount =>
	// 					new TokenAmount(
	// 						psys,
	// 						JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
	// 							? JSBI.divide(
	// 									JSBI.multiply(
	// 										JSBI.multiply(
	// 											totalRewardRatePerSecond.raw,
	// 											stakedAmount.raw
	// 										),
	// 										BIG_INT_SECONDS_IN_WEEK
	// 									),
	// 									totalStakedAmount.raw
	// 							  )
	// 							: JSBI.BigInt(0)
	// 					);
	// 				// const userRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, poolRewardRate)
	// 				const userRewardRatePerWeek = getHypotheticalWeeklyRewardRate(
	// 					stakedAmount,
	// 					totalStakedAmount,
	// 					poolRewardRate
	// 				);

	// 				memo.push({
	// 					stakingRewardAddress: MINICHEF_ADDRESS,
	// 					tokens,
	// 					earnedAmount,
	// 					// rewardRate: userRewardRate,
	// 					totalRewardRate: poolRewardRate,
	// 					stakedAmount,
	// 					totalStakedAmount,
	// 					totalStakedInWsys,
	// 					totalStakedInUsd,
	// 					multiplier: JSBI.divide(multiplier, JSBI.BigInt(100)),
	// 					periodFinish:
	// 						periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
	// 					isPeriodFinished,
	// 					getHypotheticalRewardRate,
	// 					rewardTokensAddress: rewardTokensAddress?.result?.[0],
	// 					rewardTokensMultiplier: rewardTokensMultiplier?.result?.[0],
	// 					rewardsAddress,
	// 					getExtraTokensWeeklyRewardRate,
	// 					totalRewardRatePerWeek,
	// 					totalRewardRatePerSecond: poolRewardRate,
	// 					rewardRatePerWeek: userRewardRatePerWeek,
	// 					getHypotheticalWeeklyRewardRate,
	// 				});
	// 			}

	// 			return memo;
	// 		}, []);
	// 	}, [
	// 		chainId,
	// 		psys,
	// 		pairAddresses,
	// 		pairTotalSupplies,
	// 		balances,
	// 		poolInfos,
	// 		userInfos,
	// 		pairs,
	// 		pendingRewards,
	// 		rewardTokensAddresses,
	// 		rewardTokensMultipliers,
	// 		rewardsAddresses,
	// 		sysPsysPair,
	// 		sysPsysPairState,
	// 		rewardPerSecond,
	// 		totalAllocPoint,
	// 		rewardsExpiration,
	// 		usdPrice,
	// 	]);

	// 	return arr;
	// }
}

export default FarmServices;
