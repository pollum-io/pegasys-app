import {
	ChainId,
	CurrencyAmount,
	JSBI,
	Token,
	TokenAmount,
	WSYS,
	Pair,
	Percent,
} from "@pollum-io/pegasys-sdk";
import { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	PSYS,
	USDT,
	USDC,
	DAI,
	MINICHEF_ADDRESS,
	BIG_INT_ZERO,
	BIG_INT_TWO,
	BIG_INT_ONE,
	BIG_INT_SECONDS_IN_WEEK,
	ZERO_ADDRESS,
	useWallet,
	DOUBLE_SIDE_STAKING,
	ContractFramework,
} from "pegasys-services";
import { STAKING_REWARDS_INTERFACE } from "../../constants/abis/staking-rewards";
import { PairState, usePair, usePairs } from "../../data/Reserves";
// import {
// 	NEVER_RELOAD,
// 	useMultipleContractSingleData,
// 	useSingleCallResult,
// 	useSingleContractMultipleData,
// } from "../multicall/hooks";
import { tryParseAmount } from "../swap/hooks";
import ERC20_INTERFACE from "../../constants/abis/erc20";
import useUSDCPrice from "../../utils/useUSDCPrice";
import { getRouterContract } from "../../utils";
import { useTokenBalance } from "../../state/wallet/hooks";
import { useTotalSupply } from "../../data/TotalSupply";
import {
	useRewardViaMultiplierContract,
	// useStakingContract,
} from "../../hooks/useContract";
import { SINGLE_SIDE_STAKING_REWARDS_INFO } from "./singleSideConfig";
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from "./doubleSideConfig";
import { REWARDER_VIA_MULTIPLIER_INTERFACE } from "../../constants/abis/rewarderViaMultiplier";
import { useTokens } from "../../hooks/Tokens";
// import PsysBalanceContent from 'src/layout/Header/PsysBalanceContent'
export interface SingleSideStaking {
	rewardToken: Token;
	conversionRouteHops: Token[];
	stakingRewardAddress: string;
	version: number;
}

export interface DoubleSideStaking {
	tokens: [Token, Token];
	stakingRewardAddress: string; // this is set to minichef as standard currently but can be changed on future upgrades
	multiplier?: number;
}

export interface Migration {
	from: DoubleSideStaking;
	to: DoubleSideStaking;
}

export interface BridgeMigrator {
	aeb: string;
	ab: string;
}

export interface StakingInfoBase {
	// the address of the reward contract
	stakingRewardAddress: string;
	// the amount of token currently staked, or undefined if no account
	stakedAmount: TokenAmount;
	// the amount of reward token earned by the active account, or undefined if no account
	earnedAmount: TokenAmount;
	// the total amount of token staked in the contract
	totalStakedAmount: TokenAmount;
	// the amount of token distributed per second to all LPs, constant
	totalRewardRate: TokenAmount;
	// the current amount of token distributed to the active account per second.
	// equivalent to percent of total supply * reward rate
	rewardRate: TokenAmount;
	// when the period ends
	periodFinish: Date | undefined;
	// has the reward period expired
	isPeriodFinished: boolean;
	// calculates a hypothetical amount of token distributed to the active account per second.
	getHypotheticalWeeklyRewardRate: (
		stakedAmount: TokenAmount,
		totalStakedAmount: TokenAmount,
		totalRewardRatePerSecond: TokenAmount
	) => TokenAmount;
	totalRewardRatePerSecond: TokenAmount;
	totalRewardRatePerWeek: TokenAmount;
	rewardRatePerWeek: TokenAmount;
}

export interface SingleSideStakingInfo extends StakingInfoBase {
	// the token being earned
	rewardToken: Token;
	// total staked PSYS in the pool
	totalStakedInPsys: TokenAmount;
	apr: JSBI;
}

export interface DoubleSideStakingInfo extends StakingInfoBase {
	// the tokens involved in this pair
	tokens: [Token, Token];
	// the pool weight
	multiplier: JSBI;
	// total staked SYS in the pool
	totalStakedInWsys: TokenAmount;
	totalStakedInUsd: TokenAmount;
	rewardTokensAddress?: Array<string>;
	rewardTokensMultiplier?: Array<JSBI>;
	rewardsAddress?: string;
	getExtraTokensWeeklyRewardRate?: (
		rewardRatePerWeek: TokenAmount,
		token: Token,
		tokenMultiplier: JSBI | undefined
	) => TokenAmount;
}

export interface StakingInfo extends DoubleSideStakingInfo {
	swapFeeApr?: number;
	stakingApr?: number;
	combinedApr?: number;
}

const calculateTotalStakedAmountInSysFromPsys = (
	amountStaked: JSBI,
	amountAvailable: JSBI,
	sysPsysPairReserveOfPsys: JSBI,
	sysPsysPairReserveOfWsys: JSBI,
	reserveInPsys: JSBI
): TokenAmount => {
	if (JSBI.EQ(amountAvailable, JSBI.BigInt(0))) {
		return new TokenAmount(WSYS[ChainId.NEVM], JSBI.BigInt(0));
	}

	const oneToken = JSBI.BigInt(1000000000000000000);
	const sysPsysRatio = JSBI.divide(
		JSBI.multiply(oneToken, sysPsysPairReserveOfWsys),
		sysPsysPairReserveOfPsys
	);
	const valueOfPsysInSys = JSBI.divide(
		JSBI.multiply(reserveInPsys, sysPsysRatio),
		oneToken
	);

	return new TokenAmount(
		WSYS[ChainId.NEVM],
		JSBI.divide(
			JSBI.multiply(
				JSBI.multiply(amountStaked, valueOfPsysInSys),
				JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
			),
			amountAvailable
		)
	);
};

const calculateRewardRateInPsys = (
	rewardRate: JSBI,
	valueOfPsys: JSBI | null
): JSBI => {
	if (!valueOfPsys || JSBI.EQ(valueOfPsys, 0)) return JSBI.BigInt(0);

	// TODO: Handle situation where stakingToken and rewardToken have different decimals
	const oneToken = JSBI.BigInt(1000000000000000000);

	return JSBI.divide(
		JSBI.multiply(rewardRate, oneToken), // Multiply first for precision
		valueOfPsys
	);
};

const calculateApr = (rewardRatePerSecond: JSBI, totalSupply: JSBI): JSBI => {
	if (JSBI.EQ(totalSupply, 0)) {
		return JSBI.BigInt(0);
	}

	const rewardsPerYear = JSBI.multiply(
		rewardRatePerSecond,
		JSBI.BigInt(31536000) // Seconds in year
	);

	return JSBI.divide(
		JSBI.multiply(rewardsPerYear, JSBI.BigInt(100)),
		totalSupply
	);
};

const calculateTotalStakedAmountInSys = (
	amountStaked: JSBI,
	amountAvailable: JSBI,
	reserveInWsys: JSBI
): TokenAmount => {
	if (JSBI.GT(amountAvailable, 0)) {
		// take the total amount of LP tokens staked, multiply by SYS value of all LP tokens, divide by all LP tokens
		return new TokenAmount(
			WSYS[ChainId.NEVM],
			JSBI.divide(
				JSBI.multiply(
					JSBI.multiply(amountStaked, reserveInWsys),
					JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
				),
				amountAvailable
			)
		);
	}
	return new TokenAmount(WSYS[ChainId.NEVM], JSBI.BigInt(0));
};

// based on typed value
export function useDerivedStakeInfo(
	typedValue: string,
	stakingToken: Token,
	userLiquidityUnstaked: TokenAmount | undefined
): {
	parsedAmount?: CurrencyAmount;
	error?: string;
} {
	const { address } = useWallet();
	const { t } = useTranslation();

	const parsedInput: CurrencyAmount | undefined = tryParseAmount(
		typedValue,
		stakingToken
	);

	const parsedAmount =
		parsedInput &&
		userLiquidityUnstaked &&
		JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
			? parsedInput
			: undefined;

	let error: string | undefined;
	if (!address) {
		error = t("stakeHooks.connectWallet");
	}
	if (!parsedAmount) {
		error = error ?? t("stakeHooks.enterAmount");
	}

	return {
		parsedAmount,
		error,
	};
}

export const useMinichefPools = (): { [key: string]: number } => {
	const contract = ContractFramework.StakingContract(MINICHEF_ADDRESS);

	const lpTokens = 



	const lpTokens = useSingleCallResult(minichefContract, "lpTokens", []).result;
	const lpTokensArr = lpTokens?.[0];

	return useMemo(() => {
		const poolMap: { [key: string]: number } = {};
		if (lpTokensArr) {
			lpTokensArr.forEach((address: string, index: number) => {
				poolMap[address] = index;
			});
		}
		return poolMap;
	}, [lpTokensArr]);
};

// export const useMinichefStakingInfos = (
// 	pairToFilterBy?: Pair | null
// ): DoubleSideStakingInfo[] => {
// 	const { chainId, address } = useWallet();
// 	const minichefContract = useStakingContract(MINICHEF_ADDRESS);
// 	const poolMap = useMinichefPools();
// 	const psys = PSYS[chainId || ChainId.NEVM];

// 	const info = useMemo(
// 		() =>
// 			chainId
// 				? DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.[version]?.filter(item =>
// 						pairToFilterBy === undefined
// 							? true
// 							: pairToFilterBy === null
// 							? false
// 							: pairToFilterBy.involvesToken(item.tokens[0]) &&
// 							  pairToFilterBy.involvesToken(item.tokens[1])
// 				  ) ?? []
// 				: [],
// 		[chainId, pairToFilterBy]
// 	);

// 	const tokens = useMemo(() => info.map(({ tokens }) => tokens), [info]);
// 	const pairs = usePairs(tokens);

// 	const pairAddresses = useMemo(
// 		() => pairs.map(([state, pair]) => pair?.liquidityToken.address),
// 		[pairs]
// 	);

// 	const pairTotalSupplies = useMultipleContractSingleData(
// 		pairAddresses,
// 		ERC20_INTERFACE,
// 		"totalSupply"
// 	);
// 	const balances = useMultipleContractSingleData(
// 		pairAddresses,
// 		ERC20_INTERFACE,
// 		"balanceOf",
// 		[MINICHEF_ADDRESS]
// 	);

// 	const [sysPsysPairState, sysPsysPair] = usePair(
// 		WSYS[chainId || ChainId.NEVM],
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

// 	const rewardPerSecond = useSingleCallResult(
// 		minichefContract,
// 		"rewardPerSecond",
// 		[]
// 	).result;
// 	const totalAllocPoint = useSingleCallResult(
// 		minichefContract,
// 		"totalAllocPoint",
// 		[]
// 	).result;
// 	const rewardsExpiration = useSingleCallResult(
// 		minichefContract,
// 		"rewardsExpiration",
// 		[]
// 	).result;
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
// 						JSBI.multiply(poolAllocPointAmount.raw, rewardRatePerSecAmount.raw),
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
// 						: periodFinishMs < Date.now() || poolAllocPointAmount.equalTo("0");

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
// 				const totalStakedInWsys = new TokenAmount(WSYS[chainId], BIG_INT_ZERO);

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
// 					totalStakedInUsd = new TokenAmount(USDC[chainId], stakedValueInUSDC);
// 				} else if (pair.involvesToken(USDT[chainId])) {
// 					const pairValueInUSDT = JSBI.multiply(
// 						pair.reserveOf(USDT[chainId]).raw,
// 						BIG_INT_TWO
// 					);
// 					const stakedValueInUSDT = JSBI.divide(
// 						JSBI.multiply(pairValueInUSDT, totalSupplyStaked),
// 						totalSupplyAvailable
// 					);
// 					totalStakedInUsd = new TokenAmount(USDT[chainId], stakedValueInUSDT);
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
// };


// export const useMinichefStakingInfos = (pairToFilterBy?: Pair | null): DoubleSideStakingInfo[] => {
// 	const { chainId, address } = useWallet()

// 	const minichefContract = ContractFramework.StakingContract(MINICHEF_ADDRESS)
// 	const poolMap = useMinichefPools()
// 	const psys = PSYS[chainId as ChainId || ChainId.NEVM]
  
// 	const info = useMemo(
// 	  () =>
// 		chainId
// 		  ? DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.[version]?.filter(item =>
// 			  pairToFilterBy === undefined
// 				? true
// 				: pairToFilterBy === null
// 				? false
// 				: pairToFilterBy.involvesToken(item.tokens[0]) && pairToFilterBy.involvesToken(item.tokens[1])
// 			) ?? []
// 		  : [],
// 	  [chainId, pairToFilterBy, version]
// 	)
  
// 	const tokens = useMemo(() => info.map(({ tokens }) => tokens), [info])
// 	const pairs = usePairs(tokens)
  
// 	const pairAddresses = useMemo(() => {
// 	  return pairs.map(([state, pair]) => pair?.liquidityToken.address)
// 	}, [pairs])
  
// 	const pairTotalSupplies = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'totalSupply')
// 	const balances = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'balanceOf', [MINICHEF_ADDRESS])
  
// 	const [sysPsysPairState, sysPsysPair] = usePair(WSYS[chainId || ChainId.NEVM], psys)
  
// 	const poolIdArray = useMemo(() => {
// 	  if (!pairAddresses || !poolMap) return []
// 	  // TODO: clean up this logic. seems like a lot of work to ensure correct types
// 	  const NOT_FOUND = -1
// 	  const results = pairAddresses.map(address => poolMap[address ?? ''] ?? NOT_FOUND)
// 	  if (results.some(result => result === NOT_FOUND)) return []
// 	  return results
// 	}, [poolMap, pairAddresses])
  
// 	const poolsIdInput = useMemo(() => {
// 	  if (!poolIdArray) return []
// 	  return poolIdArray.map(pid => [pid])
// 	}, [poolIdArray])
// 	const poolInfos = useSingleContractMultipleData(minichefContract, 'poolInfo', poolsIdInput ?? [])
  
// 	const userInfoInput = useMemo(() => {
// 	  if (!poolIdArray || !account) return []
// 	  return poolIdArray.map(pid => [pid, account])
// 	}, [poolIdArray, account])
// 	const userInfos = useSingleContractMultipleData(minichefContract, 'userInfo', userInfoInput ?? [])
  
// 	const pendingRewards = useSingleContractMultipleData(minichefContract, 'pendingReward', userInfoInput ?? [])
  
// 	const rewarders = useSingleContractMultipleData(minichefContract, 'rewarder', poolsIdInput ?? [])
  
// 	const rewardsAddresses = useMemo(() => {
// 	  if ((rewarders || []).length === 0) return []
// 	  if (rewarders.some(item => item.loading)) return []
// 	  return rewarders.map(reward => reward?.result?.[0])
// 	}, [rewarders])
  
// 	const rewardTokensAddresses = useMultipleContractSingleData(
// 	  rewardsAddresses,
// 	  REWARDER_VIA_MULTIPLIER_INTERFACE,
// 	  'getRewardTokens',
// 	  []
// 	)
  
// 	const rewardTokensMultipliers = useMultipleContractSingleData(
// 	  rewardsAddresses,
// 	  REWARDER_VIA_MULTIPLIER_INTERFACE,
// 	  'getRewardMultipliers',
// 	  []
// 	)
  
// 	const rewardPerSecond = useSingleCallResult(minichefContract, 'rewardPerSecond', []).result
// 	const totalAllocPoint = useSingleCallResult(minichefContract, 'totalAllocPoint', []).result
// 	const rewardsExpiration = useSingleCallResult(minichefContract, 'rewardsExpiration', []).result
// 	const usdPrice = useUSDCPrice(WSYS[chainId ? chainId : ChainId.NEVM])
  
// 	const arr = useMemo(() => {
// 	  if (!chainId || !psys) return []
  
// 	  return pairAddresses.reduce<any[]>((memo, pairAddress, index) => {
// 		const pairTotalSupplyState = pairTotalSupplies[index]
// 		const balanceState = balances[index]
// 		const poolInfo = poolInfos[index]
// 		const userPoolInfo = userInfos[index]
// 		const [pairState, pair] = pairs[index]
// 		const pendingRewardInfo = pendingRewards[index]
// 		const rewardTokensAddress = rewardTokensAddresses[index]
// 		const rewardTokensMultiplier = rewardTokensMultipliers[index]
// 		const rewardsAddress = rewardsAddresses[index]
  
// 		if (
// 		  pairTotalSupplyState?.loading === false &&
// 		  poolInfo?.loading === false &&
// 		  balanceState?.loading === false &&
// 		  pair &&
// 		  sysPsysPair &&
// 		  pairState !== PairState.LOADING &&
// 		  sysPsysPairState !== PairState.LOADING &&
// 		  rewardPerSecond &&
// 		  totalAllocPoint &&
// 		  rewardsExpiration?.[0] &&
// 		  rewardTokensAddress?.loading === false
// 		) {
// 		  if (
// 			balanceState?.error ||
// 			pairTotalSupplyState.error ||
// 			pairState === PairState.INVALID ||
// 			pairState === PairState.NOT_EXISTS ||
// 			sysPsysPairState === PairState.INVALID ||
// 			sysPsysPairState === PairState.NOT_EXISTS
// 		  ) {
// 			console.error('Failed to load staking rewards info')
// 			return memo
// 		  }
  
// 		  // get the LP token
// 		  const token0 = pair?.token0
// 		  const token1 = pair?.token1
// 		  const tokens = [token0, token1]
// 		  const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'), chainId)
// 		  const lpToken = dummyPair.liquidityToken
  
// 		  const poolAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(poolInfo?.result?.['allocPoint']))
// 		  const totalAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(totalAllocPoint?.[0]))
// 		  const rewardRatePerSecAmount = new TokenAmount(psys, JSBI.BigInt(rewardPerSecond?.[0]))
// 		  const poolRewardRate = new TokenAmount(
// 			psys,
// 			JSBI.divide(JSBI.multiply(poolAllocPointAmount.raw, rewardRatePerSecAmount.raw), totalAllocPointAmount.raw)
// 		  )
  
// 		  const totalRewardRatePerWeek = new TokenAmount(psys, JSBI.multiply(poolRewardRate.raw, BIG_INT_SECONDS_IN_WEEK))
  
// 		  const periodFinishMs = rewardsExpiration?.[0]?.mul(1000)?.toNumber()
// 		  // periodFinish will be 0 immediately after a reward contract is initialized
// 		  const isPeriodFinished =
// 			periodFinishMs === 0 ? false : periodFinishMs < Date.now() || poolAllocPointAmount.equalTo('0')
  
// 		  const totalSupplyStaked = JSBI.BigInt(balanceState?.result?.[0])
// 		  const totalSupplyAvailable = JSBI.BigInt(pairTotalSupplyState?.result?.[0])
// 		  const totalStakedAmount = new TokenAmount(lpToken, JSBI.BigInt(balanceState?.result?.[0]))
// 		  const stakedAmount = new TokenAmount(lpToken, JSBI.BigInt(userPoolInfo?.result?.['amount'] ?? 0))
// 		  const earnedAmount = new TokenAmount(psys, JSBI.BigInt(pendingRewardInfo?.result?.['pending'] ?? 0))
// 		  const multiplier = JSBI.BigInt(poolInfo?.result?.['allocPoint'])
  
// 		  const isSysPool = pair.involvesToken(WSYS[chainId])
// 		  const isPsysPool = pair.involvesToken(PSYS[chainId])
  
// 		  let totalStakedInUsd = new TokenAmount(DAI[chainId], BIG_INT_ZERO)
// 		  const totalStakedInWsys = new TokenAmount(WSYS[chainId], BIG_INT_ZERO)
  
// 		  if (JSBI.equal(totalSupplyAvailable, BIG_INT_ZERO)) {
// 			// Default to 0 values above avoiding division by zero errors
// 		  } else if (pair.involvesToken(DAI[chainId])) {
// 			const pairValueInDAI = JSBI.multiply(pair.reserveOf(DAI[chainId]).raw, BIG_INT_TWO)
// 			const stakedValueInDAI = JSBI.divide(JSBI.multiply(pairValueInDAI, totalSupplyStaked), totalSupplyAvailable)
// 			totalStakedInUsd = new TokenAmount(DAI[chainId], stakedValueInDAI)
// 		  } else if (pair.involvesToken(USDC[chainId])) {
// 			const pairValueInUSDC = JSBI.multiply(pair.reserveOf(USDC[chainId]).raw, BIG_INT_TWO)
// 			const stakedValueInUSDC = JSBI.divide(JSBI.multiply(pairValueInUSDC, totalSupplyStaked), totalSupplyAvailable)
// 			totalStakedInUsd = new TokenAmount(USDC[chainId], stakedValueInUSDC)
// 		  } else if (pair.involvesToken(USDT[chainId])) {
// 			const pairValueInUSDT = JSBI.multiply(pair.reserveOf(USDT[chainId]).raw, BIG_INT_TWO)
// 			const stakedValueInUSDT = JSBI.divide(JSBI.multiply(pairValueInUSDT, totalSupplyStaked), totalSupplyAvailable)
// 			totalStakedInUsd = new TokenAmount(USDT[chainId], stakedValueInUSDT)
// 		  } else if (isSysPool) {
// 			const totalStakedInWsys = calculateTotalStakedAmountInSys(
// 			  totalSupplyStaked,
// 			  totalSupplyAvailable,
// 			  pair.reserveOf(WSYS[chainId]).raw
// 			)
// 			totalStakedInUsd = totalStakedInWsys && (usdPrice?.quote(totalStakedInWsys) as TokenAmount)
// 		  } else if (isPsysPool) {
// 			const totalStakedInWsys = calculateTotalStakedAmountInSysFromPsys(
// 			  totalSupplyStaked,
// 			  totalSupplyAvailable,
// 			  sysPsysPair.reserveOf(psys).raw,
// 			  sysPsysPair.reserveOf(WSYS[chainId]).raw,
// 			  pair.reserveOf(psys).raw
// 			)
// 			totalStakedInUsd = totalStakedInWsys && (usdPrice?.quote(totalStakedInWsys) as TokenAmount)
// 		  } else {
// 			// Contains no stablecoin, WSYS, nor PSYS
// 			console.error(`Could not identify total staked value for pair ${pair.liquidityToken.address}`)
// 		  }
  
// 		  const getHypotheticalRewardRate = (
// 			stakedAmount: TokenAmount,
// 			totalStakedAmount: TokenAmount,
// 			totalRewardRate: TokenAmount
// 		  ): TokenAmount => {
// 			return new TokenAmount(
// 			  psys,
// 			  JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
// 				? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
// 				: JSBI.BigInt(0)
// 			)
// 		  }
  
// 		  const getExtraTokensWeeklyRewardRate = (
// 			rewardRatePerWeek: TokenAmount,
// 			token: Token,
// 			tokenMultiplier: JSBI | undefined
// 		  ) => {
// 			const TEN_EIGHTEEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
// 			// const secondToWeekConversion = JSBI.BigInt(60 * 60 * 24 * 7)
// 			const rewardMultiplier = JSBI.BigInt(tokenMultiplier || 1)
  
// 			const unadjustedRewardPerWeek = JSBI.multiply(rewardMultiplier, rewardRatePerWeek?.raw)
  
// 			// const finalReward = JSBI.divide(JSBI.multiply(unadjustedRewardPerWeek, secondToWeekConversion), TEN_EIGHTEEN)
// 			const finalReward = JSBI.divide(unadjustedRewardPerWeek, TEN_EIGHTEEN)
  
// 			return new TokenAmount(token, finalReward)
// 		  }
  
// 		  const getHypotheticalWeeklyRewardRate = (
// 			stakedAmount: TokenAmount,
// 			totalStakedAmount: TokenAmount,
// 			totalRewardRatePerSecond: TokenAmount
// 		  ): TokenAmount => {
// 			return new TokenAmount(
// 			  psys,
// 			  JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
// 				? JSBI.divide(
// 					JSBI.multiply(JSBI.multiply(totalRewardRatePerSecond.raw, stakedAmount.raw), BIG_INT_SECONDS_IN_WEEK),
// 					totalStakedAmount.raw
// 				  )
// 				: JSBI.BigInt(0)
// 			)
// 		  }
  
// 		  //const userRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, poolRewardRate)
// 		  const userRewardRatePerWeek = getHypotheticalWeeklyRewardRate(stakedAmount, totalStakedAmount, poolRewardRate)
  
// 		  memo.push({
// 			stakingRewardAddress: MINICHEF_ADDRESS,
// 			tokens,
// 			earnedAmount,
// 			//rewardRate: userRewardRate,
// 			totalRewardRate: poolRewardRate,
// 			stakedAmount,
// 			totalStakedAmount,
// 			totalStakedInWsys,
// 			totalStakedInUsd,
// 			multiplier: JSBI.divide(multiplier, JSBI.BigInt(100)),
// 			periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
// 			isPeriodFinished,
// 			getHypotheticalRewardRate,
// 			rewardTokensAddress: rewardTokensAddress?.result?.[0],
// 			rewardTokensMultiplier: rewardTokensMultiplier?.result?.[0],
// 			rewardsAddress,
// 			getExtraTokensWeeklyRewardRate,
// 			totalRewardRatePerWeek: totalRewardRatePerWeek,
// 			totalRewardRatePerSecond: poolRewardRate,
// 			rewardRatePerWeek: userRewardRatePerWeek,
// 			getHypotheticalWeeklyRewardRate
// 		  })
// 		}
  
// 		return memo
// 	  }, [])
// 	}, [
// 	  chainId,
// 	  psys,
// 	  pairAddresses,
// 	  pairTotalSupplies,
// 	  balances,
// 	  poolInfos,
// 	  userInfos,
// 	  pairs,
// 	  pendingRewards,
// 	  rewardTokensAddresses,
// 	  rewardTokensMultipliers,
// 	  rewardsAddresses,
// 	  sysPsysPair,
// 	  sysPsysPairState,
// 	  rewardPerSecond,
// 	  totalAllocPoint,
// 	  rewardsExpiration,
// 	  usdPrice
// 	])
  
// 	return arr
//   }