import {
	ChainId,
	JSBI,
	Pair,
	Price,
	Token,
	TokenAmount,
	WSYS,
} from "@pollum-io/pegasys-sdk";
import ethers, { Signer } from "ethers";

import { WrappedTokenInfo } from "types";

import { usePairs } from "hooks";
import { IFarmInfo } from "../dto";
import LpTokenServices from "./lpToken";
import { ContractFramework } from "../frameworks";
import {
	BIG_INT_SECONDS_IN_WEEK,
	BIG_INT_TWO,
	BIG_INT_ZERO,
	DAI,
	PSYS,
	USDC,
	USDT,
	ZERO_ADDRESS,
} from "../constants";

class FarmServices {
	static async getFarmInfos(
		// userTokensBalance: WrappedTokenInfo[],
		tokenPairs: Array<[WrappedTokenInfo, Token]>,
		address: string,
		chainId: ChainId,
		provider:
			| ethers.providers.Provider
			| ethers.providers.Web3Provider
			| ethers.providers.JsonRpcProvider
			| Signer
			| undefined
	): Promise<IFarmInfo[]> {
		const lpTokens = await LpTokenServices.getLpTokens();
		const poolMap = await LpTokenServices.getPoolMap(lpTokens);

		const pairsWithLiquidityToken: IFarmInfo[] = [];

		const walletInfo = {
			walletAddress: address,
			chainId,
			provider,
		};

		await Promise.all(
			tokenPairs.map(async (tokenPair, index) => {
				const lpToken = LpTokenServices.getLpToken(
					tokenPair[0],
					tokenPair[1],
					chainId
				);

				const poolId = poolMap[lpToken.address];
				const pairs = await usePairs(tokenPairs, walletInfo);
				const pair = pairs[index]?.[1];
				if (
					poolId !== undefined &&
					lpToken &&
					lpTokens.includes(lpToken.address) &&
					pair
				) {
					delete poolMap[lpToken.address];

					const contractValues: { [k: string]: any } = {};

					await Promise.all([
						LpTokenServices.getTotalAllocPoint().then(totalAllocPoint => {
							contractValues.totalAllocPoint = totalAllocPoint;
						}),
						LpTokenServices.getRewardPerSec().then(rewardPerSecond => {
							contractValues.rewardPerSecond = rewardPerSecond;
						}),
						LpTokenServices.getBalance(lpToken.address).then(totalStake => {
							contractValues.totalStake = totalStake;
						}),
						LpTokenServices.getTotalSupply(lpToken.address).then(
							totalSupply => {
								contractValues.totalSupply = totalSupply;
							}
						),
						LpTokenServices.getRewarder(poolId).then(rewarder => {
							contractValues.rewarder = rewarder;
						}),
						LpTokenServices.getAllocPoint(poolId).then(allocPoint => {
							contractValues.allocPoint = allocPoint;
						}),
						LpTokenServices.getUserStake(poolId, address).then(userStake => {
							contractValues.userStake = userStake;
						}),
						LpTokenServices.getUserUnclaimedPSYS(poolId, address).then(
							userUnclaimedPSYS => {
								contractValues.userUnclaimedPSYS = userUnclaimedPSYS;
							}
						),
						LpTokenServices.getAvailableLpTokens(lpToken.address, address).then(
							userAvailableLpToken => {
								contractValues.userAvailableLpToken = userAvailableLpToken;
							}
						),
					]);

					const totalStakeJSBI = JSBI.BigInt(
						contractValues.totalStake.toString() ?? 0
					);

					const totalStakedAmount = new TokenAmount(lpToken, totalStakeJSBI);

					const userStakeJSBI = JSBI.BigInt(
						contractValues.userStake.toString() ?? 0
					);

					const userStakedAmount = new TokenAmount(lpToken, userStakeJSBI);

					const userAvailableLpTokenAmount = new TokenAmount(
						lpToken,
						JSBI.BigInt(contractValues.userAvailableLpToken.toString() ?? 0)
					);

					const allocPointAmount = new TokenAmount(
						lpToken,
						JSBI.BigInt(contractValues.allocPoint.toString() ?? 0)
					);

					const totalAllocPointAmount = new TokenAmount(
						lpToken,
						JSBI.BigInt(contractValues.totalAllocPoint.toString() ?? 0)
					);

					const psys = PSYS[chainId ?? ChainId.NEVM];

					const unclaimedPSYSAmount = new TokenAmount(
						psys,
						JSBI.BigInt(contractValues.userUnclaimedPSYS.toString() ?? 0)
					);

					const rewardPerSecAmount = new TokenAmount(
						psys,
						JSBI.BigInt(contractValues.rewardPerSecond.toString() ?? 0)
					);

					const poolRewardRateAmount = new TokenAmount(
						psys,
						JSBI.divide(
							JSBI.multiply(allocPointAmount.raw, rewardPerSecAmount.raw),
							totalAllocPointAmount.raw
						)
					);

					const totalRewardRatePerWeek = new TokenAmount(
						psys,
						JSBI.multiply(poolRewardRateAmount.raw, BIG_INT_SECONDS_IN_WEEK)
					);

					const userRewardRatePerWeek = new TokenAmount(
						psys,
						JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
							? JSBI.divide(
									JSBI.multiply(
										JSBI.multiply(poolRewardRateAmount.raw, userStakeJSBI),
										BIG_INT_SECONDS_IN_WEEK
									),
									totalStakeJSBI
							  )
							: JSBI.BigInt(0)
					);

					const isSuperFarm = contractValues.rewarder !== ZERO_ADDRESS;

					let rewarderMultiplier: bigint | undefined;

					if (isSuperFarm) {
						rewarderMultiplier = await LpTokenServices.getRewardMultiplier(
							contractValues.rewarder
						);
					}

					const aprs = await LpTokenServices.getAprs(poolId, isSuperFarm);

					let totalStakedInUsd = new TokenAmount(DAI[chainId], BIG_INT_ZERO);

					const usdcPair = new Pair(
						new TokenAmount(WSYS[ChainId.NEVM], "1"),
						new TokenAmount(USDC[ChainId.NEVM], "1"),
						chainId
					);

					const sysPsysPair = new Pair(
						new TokenAmount(WSYS[ChainId.NEVM], "1"),
						new TokenAmount(psys, "1"),
						chainId
					);

					const price = usdcPair.priceOf(WSYS[chainId]);
					const usdPrice = new Price(
						WSYS[ChainId.NEVM],
						USDC[ChainId.NEVM],
						price.denominator,
						price.numerator
					);

					const totalSupplyJSBI = JSBI.BigInt(contractValues.totalSupply ?? 0);

					if (!JSBI.equal(totalSupplyJSBI, BIG_INT_ZERO)) {
						if (pair.involvesToken(DAI[chainId])) {
							const pairValueInDAI = JSBI.multiply(
								pair.reserveOf(DAI[chainId]).raw,
								BIG_INT_TWO
							);

							const stakedValueInDAI = JSBI.divide(
								JSBI.multiply(pairValueInDAI, totalStakeJSBI),
								totalSupplyJSBI
							);

							totalStakedInUsd = new TokenAmount(
								DAI[chainId],
								stakedValueInDAI
							);
						} else if (pair.involvesToken(USDC[chainId])) {
							const pairValueInUSDC = JSBI.multiply(
								pair.reserveOf(USDC[chainId]).raw,
								BIG_INT_TWO
							);

							const stakedValueInUSDC = JSBI.divide(
								JSBI.multiply(pairValueInUSDC, totalStakeJSBI),
								totalSupplyJSBI
							);

							totalStakedInUsd = new TokenAmount(
								USDC[chainId],
								stakedValueInUSDC
							);
						} else if (pair.involvesToken(USDT[chainId])) {
							const pairValueInUSDT = JSBI.multiply(
								pair.reserveOf(USDT[chainId]).raw,
								BIG_INT_TWO
							);

							const stakedValueInUSDT = JSBI.divide(
								JSBI.multiply(pairValueInUSDT, totalStakeJSBI),
								totalSupplyJSBI
							);

							totalStakedInUsd = new TokenAmount(
								USDT[chainId],
								stakedValueInUSDT
							);
						} else if (pair.involvesToken(WSYS[chainId])) {
							const totalStakedInWsys = new TokenAmount(
								WSYS[ChainId.NEVM],
								JSBI.GT(totalSupplyJSBI, 0)
									? JSBI.divide(
											JSBI.multiply(
												JSBI.multiply(
													totalStakeJSBI,
													pair.reserveOf(WSYS[chainId]).raw
												),
												JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
											),
											totalSupplyJSBI
									  )
									: JSBI.BigInt(1)
							);

							if (JSBI.greaterThan(totalStakedInWsys.raw, JSBI.BigInt(0))) {
								totalStakedInUsd = usdPrice.quote(
									totalStakedInWsys
								) as TokenAmount;
							}
						} else if (pair.involvesToken(PSYS[chainId])) {
							const oneToken = JSBI.BigInt(1000000000000000000);
							const sysPsysRatio = JSBI.divide(
								JSBI.multiply(
									oneToken,
									sysPsysPair.reserveOf(WSYS[chainId]).raw
								),
								sysPsysPair.reserveOf(psys).raw
							);
							const valueOfPsysInSys = JSBI.divide(
								JSBI.multiply(pair.reserveOf(psys).raw, sysPsysRatio),
								oneToken
							);

							const totalStakedInWsys = new TokenAmount(
								WSYS[ChainId.NEVM],
								JSBI.EQ(totalSupplyJSBI, JSBI.BigInt(0))
									? JSBI.BigInt(0)
									: JSBI.divide(
											JSBI.multiply(
												JSBI.multiply(totalStakeJSBI, valueOfPsysInSys),
												JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
											),
											totalSupplyJSBI
									  )
							);

							if (totalStakedInWsys) {
								totalStakedInUsd = usdPrice?.quote(
									totalStakedInWsys
								) as TokenAmount;
							}
						}
					}

					const userStakePercentage = JSBI.divide(
						userStakeJSBI,
						totalStakeJSBI
					);

					const userStakeInUsd = JSBI.multiply(
						userStakePercentage,
						totalStakedInUsd.raw
					);

					pairsWithLiquidityToken.push({
						tokenA: tokenPair[0],
						tokenB: tokenPair[1],
						poolId,
						totalStakedAmount,
						totalStakedInUsd,
						userStakeInUsd,
						userStakedAmount,
						userAvailableLpTokenAmount,
						unclaimedPSYSAmount,
						totalRewardRatePerWeek,
						userRewardRatePerWeek,
						rewarderMultiplier,
						poolRewardRateAmount,
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
			methodName: "withdraw",
			contract,
			args: [poolId, `0x${amount}`, address],
		});
	}

	static async withdrawAndClaim(
		poolId: number,
		amount: string,
		address: string
	) {
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

	static async deposit(
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
}

export default FarmServices;
