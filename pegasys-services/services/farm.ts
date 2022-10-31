import {
	ChainId,
	JSBI,
	Pair,
	Token,
	TokenAmount,
	WSYS,
} from "@pollum-io/pegasys-sdk";

import { usePairs as getPairs } from "hooks";

import {
	IFarmInfo,
	IFarmServicesClaim,
	IFarmServicesDeposit,
	IFarmServicesGetExtraReward,
	IFarmServicesGetFarmOpportunities,
	IFarmServicesGetPoolRewardRate,
	IFarmServicesGetStake,
	IFarmServicesGetTotalStake,
	IFarmServicesGetUnclaimed,
	IFarmServicesGetUnstake,
	IFarmServicesWithdraw,
} from "../dto";
import TokenServices from "./token";
import LpTokenServices from "./lpToken";
import { ContractFramework } from "../frameworks";
import {
	BIG_INT_ONE,
	BIG_INT_SECONDS_IN_WEEK,
	BIG_INT_TWO,
	BIG_INT_ZERO,
	DAI,
	PSYS,
	USDC,
	USDT,
	ZERO_ADDRESS,
} from "../constants";
import PairServices from "./pair";

class FarmServices {
	private static async getTotalStake({
		stakeToken,
		...props
	}: IFarmServicesGetTotalStake) {
		const totalStake = await LpTokenServices.getBalance({
			...props,
			contractAddress: stakeToken.address,
		});

		const totalStakeJSBI = JSBI.BigInt(totalStake.toString() ?? 0);

		return new TokenAmount(stakeToken, totalStakeJSBI);
	}

	private static async getStake({
		stakeToken,
		...props
	}: IFarmServicesGetStake) {
		const stake = await LpTokenServices.getUserStake(props);

		const stakeJSBI = JSBI.BigInt(stake.toString() ?? 0);

		return new TokenAmount(stakeToken, stakeJSBI);
	}

	private static async getUnstake({
		stakeToken,
		...props
	}: IFarmServicesGetUnstake) {
		const unstake = await LpTokenServices.getAvailableLpTokens({
			...props,
			contractAddress: stakeToken.address,
		});

		const unstakeJSBI = JSBI.BigInt(unstake.toString() ?? 0);

		return new TokenAmount(stakeToken, unstakeJSBI);
	}

	private static async getUnclaimed({
		rewardToken,
		...props
	}: IFarmServicesGetUnclaimed) {
		const unclaimed = await LpTokenServices.getUserUnclaimedPSYS(props);

		const unclaimedJSBI = JSBI.BigInt(unclaimed.toString() ?? 0);

		return new TokenAmount(rewardToken, unclaimedJSBI);
	}

	private static async getPoolRewardRate({
		stakeToken,
		rewardToken,
		poolId,
		chainId,
		provider,
		farmContract,
	}: IFarmServicesGetPoolRewardRate) {
		const allocPoint = await LpTokenServices.getAllocPoint({
			poolId,
			farmContract,
			provider,
			chainId,
		});

		const allocPointAmount = new TokenAmount(
			stakeToken,
			JSBI.BigInt(allocPoint.toString() ?? 0)
		);

		const totalAllocPoint = await LpTokenServices.getTotalAllocPoint({
			farmContract,
			provider,
			chainId,
		});

		const totalAllocPointAmount = new TokenAmount(
			stakeToken,
			JSBI.BigInt(totalAllocPoint.toString() ?? 0)
		);

		const rewardPerSec = await LpTokenServices.getRewardPerSec({
			farmContract,
			chainId,
			provider,
		});

		const rewardPerSecAmount = new TokenAmount(
			rewardToken,
			JSBI.BigInt(rewardPerSec.toString() ?? 0)
		);

		const poolRewardRateAmount = new TokenAmount(
			rewardToken,
			JSBI.divide(
				JSBI.multiply(allocPointAmount.raw, rewardPerSecAmount.raw),
				totalAllocPointAmount.raw
			)
		);

		return poolRewardRateAmount;
	}

	private static getTotalRewardPerWeek(
		rewardToken: Token,
		poolRewardRate: TokenAmount
	) {
		const totalRewardRatePerWeek = new TokenAmount(
			rewardToken,
			JSBI.multiply(poolRewardRate.raw, BIG_INT_SECONDS_IN_WEEK)
		);

		return totalRewardRatePerWeek;
	}

	private static getRewardPerWeek(
		rewardToken: Token,
		poolRewardRate: TokenAmount,
		totalStaked: TokenAmount,
		staked: TokenAmount
	) {
		const rewardRatePerWeek = new TokenAmount(
			rewardToken,
			JSBI.greaterThan(totalStaked.raw, BIG_INT_ZERO)
				? JSBI.divide(
						JSBI.multiply(
							JSBI.multiply(poolRewardRate.raw, staked.raw),
							BIG_INT_SECONDS_IN_WEEK
						),
						totalStaked.raw
				  )
				: BIG_INT_ZERO
		);

		return rewardRatePerWeek;
	}

	private static getRates(
		rewardToken: Token,
		poolRewardRate: TokenAmount,
		totalStake: TokenAmount,
		stake: TokenAmount
	) {
		const totalRewardRatePerWeek = this.getTotalRewardPerWeek(
			rewardToken,
			poolRewardRate
		);

		const rewardRatePerWeek = this.getRewardPerWeek(
			rewardToken,
			poolRewardRate,
			totalStake,
			stake
		);

		return {
			totalRewardRatePerWeek,
			rewardRatePerWeek,
		};
	}

	private static getReservePrice(
		reserve: TokenAmount,
		totalStake: TokenAmount,
		totalSupply: JSBI
	) {
		const pairValueInDAI = JSBI.multiply(reserve.raw, BIG_INT_TWO);

		const stakedValueInDAI = JSBI.divide(
			JSBI.multiply(pairValueInDAI, totalStake.raw),
			totalSupply
		);

		return new TokenAmount(reserve.token, stakedValueInDAI);
	}

	private static async getTotalStakeInUsd(
		pair: Pair,
		stakeToken: Token,
		totalStake: TokenAmount,
		chainId?: ChainId | null
	) {
		const dai = DAI[chainId ?? ChainId.NEVM];

		let totalStakedInUsd = new TokenAmount(dai, BIG_INT_ZERO);

		const totalSupply = await LpTokenServices.getTotalSupply({
			contractAddress: stakeToken.address,
		});

		const totalSupplyJSBI = JSBI.BigInt(totalSupply ?? 0);

		if (JSBI.equal(totalSupplyJSBI, BIG_INT_ZERO)) {
			return 0;
		}

		const usdc = USDC[chainId ?? ChainId.NEVM];
		const usdt = USDT[chainId ?? ChainId.NEVM];
		const wsys = WSYS[chainId ?? ChainId.NEVM];
		const psys = PSYS[chainId ?? ChainId.NEVM];

		const usdPrice = await TokenServices.getUsdcPrice(wsys, chainId);

		if (pair.involvesToken(dai)) {
			totalStakedInUsd = this.getReservePrice(
				pair.reserveOf(dai),
				totalStake,
				totalSupplyJSBI
			);
		} else if (pair.involvesToken(usdc)) {
			totalStakedInUsd = this.getReservePrice(
				pair.reserveOf(usdc),
				totalStake,
				totalSupplyJSBI
			);
		} else if (pair.involvesToken(usdt)) {
			totalStakedInUsd = this.getReservePrice(
				pair.reserveOf(usdt),
				totalStake,
				totalSupplyJSBI
			);
		} else if (pair.involvesToken(wsys)) {
			const totalStakedInWsys = JSBI.GT(totalSupplyJSBI, BIG_INT_ZERO)
				? new TokenAmount(
						wsys,
						JSBI.divide(
							JSBI.multiply(
								JSBI.multiply(totalStake.raw, pair.reserveOf(wsys).raw),
								BIG_INT_TWO // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
							),
							totalSupplyJSBI
						)
				  )
				: new TokenAmount(wsys, BIG_INT_ZERO);

			if (JSBI.greaterThan(totalStakedInWsys.raw, BIG_INT_ZERO)) {
				totalStakedInUsd = usdPrice?.quote(totalStakedInWsys) as TokenAmount;
			}
		} else if (pair.involvesToken(psys)) {
			const [[sysPsysPairState, sysPsysPair]] = await PairServices.getPairs([
				[wsys, psys],
			]);

			const oneToken = JSBI.BigInt(`1${"0".repeat(18)}`);

			const sysPsysRatio = JSBI.divide(
				JSBI.multiply(
					oneToken,
					sysPsysPair?.reserveOf(wsys).raw ?? BIG_INT_ZERO
				),
				sysPsysPair?.reserveOf(psys).raw ?? BIG_INT_ONE
			);

			const valueOfPsysInSys = JSBI.divide(
				JSBI.multiply(pair.reserveOf(psys).raw, sysPsysRatio),
				oneToken
			);

			const totalStakedInWsys = new TokenAmount(
				wsys,
				JSBI.EQ(totalSupplyJSBI, BIG_INT_ZERO)
					? BIG_INT_ZERO
					: JSBI.divide(
							JSBI.multiply(
								JSBI.multiply(totalStake.raw, valueOfPsysInSys),
								BIG_INT_TWO // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
							),
							totalSupplyJSBI
					  )
			);

			totalStakedInUsd = usdPrice?.quote(totalStakedInWsys) as TokenAmount;
		}

		return Number(totalStakedInUsd.toSignificant());
	}

	private static getStakeInUsd(
		totalStake: TokenAmount,
		stakedAmount: TokenAmount,
		totalStakedInUsd: number
	) {
		const stakedInUsd = JSBI.multiply(
			JSBI.BigInt(Math.floor(totalStakedInUsd)),
			JSBI.divide(stakedAmount.raw, totalStake.raw)
		);

		return Number(stakedInUsd.toString());
	}

	private static async getExtraReward({
		poolId,
		provider,
		chainId,
		totalRewardRatePerWeek,
		rewardRatePerWeek,
		farmContract,
		unclaimed,
	}: IFarmServicesGetExtraReward) {
		const rewarder = await LpTokenServices.getRewarder({
			poolId,
			farmContract,
			chainId,
			provider,
		});

		if (rewarder === ZERO_ADDRESS) {
			return {};
		}

		const { multiplier, rewardAddress } =
			await LpTokenServices.getExtraRewarder(rewarder);

		if (!rewardAddress) {
			return {};
		}

		const extraRewardToken = await TokenServices.getToken({
			chainId,
			contractAddress: rewardAddress,
		});

		const TEN_EIGHTEEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18));

		const rewardMultiplier = JSBI.BigInt(multiplier.toString() ?? 1);

		const unadjustedRewardPerWeek = JSBI.multiply(
			rewardMultiplier,
			rewardRatePerWeek?.raw
		);

		const finalReward = JSBI.divide(unadjustedRewardPerWeek, TEN_EIGHTEEN);

		const extraRewardRatePerWeek = new TokenAmount(
			extraRewardToken,
			finalReward
		);

		const unadjustedTotalRewardPerWeek = JSBI.multiply(
			rewardMultiplier,
			totalRewardRatePerWeek?.raw
		);

		const finalTotalReward = JSBI.divide(
			unadjustedTotalRewardPerWeek,
			TEN_EIGHTEEN
		);

		const extraTotalRewardRatePerWeek = new TokenAmount(
			extraRewardToken,
			finalTotalReward
		);

		const unadjustedUnclaimed = JSBI.multiply(rewardMultiplier, unclaimed?.raw);

		const finalUnclaimed = JSBI.divide(unadjustedUnclaimed, TEN_EIGHTEEN);

		const extraUnclaimed = new TokenAmount(extraRewardToken, finalUnclaimed);

		return {
			extraRewardToken,
			extraRewardRatePerWeek,
			extraTotalRewardRatePerWeek,
			extraUnclaimed,
		};
	}

	static async getFarmOpportunities({
		tokenPairs,
		walletAddress,
		chainId,
		provider,
		farmContract,
	}: IFarmServicesGetFarmOpportunities) {
		const stakeTokens = await LpTokenServices.getLpTokens({
			chainId,
			farmContract,
		});

		const poolMap = await LpTokenServices.getPoolMap({
			tokenAddresses: stakeTokens,
			farmContract,
			chainId,
		});

		const rewardToken = PSYS[chainId ?? ChainId.NEVM];

		const walletInfo = {
			walletAddress,
			chainId: chainId ?? ChainId.NEVM,
			provider,
		};

		const pairs = await getPairs(tokenPairs, walletInfo);

		const pairsWithLiquidityToken: IFarmInfo[] = [];

		await Promise.all(
			tokenPairs.map(async (tokenPair, index) => {
				const stakeToken = LpTokenServices.getLpToken(
					tokenPair[0],
					tokenPair[1],
					chainId
				);

				const poolId = poolMap[stakeToken.address];
				const pair = pairs[index]?.[1];

				if (
					poolId !== undefined &&
					stakeToken &&
					stakeTokens.includes(stakeToken.address) &&
					pair
				) {
					delete poolMap[stakeToken.address];

					const values: { [k: string]: TokenAmount } = {};

					await Promise.all([
						this.getPoolRewardRate({
							stakeToken,
							rewardToken,
							poolId,
							farmContract,
						}).then(value => {
							values.poolRewardRate = value;
						}),
						this.getTotalStake({ stakeToken }).then(value => {
							values.totalStake = value;
						}),
						this.getStake({
							stakeToken,
							poolId,
							walletAddress,
							farmContract,
						}).then(value => {
							values.stake = value;
						}),
						this.getUnstake({ stakeToken, walletAddress }).then(value => {
							values.unstake = value;
						}),
						this.getUnclaimed({
							rewardToken,
							poolId,
							walletAddress,
							farmContract,
						}).then(value => {
							values.unclaimed = value;
						}),
					]);

					const { rewardRatePerWeek, totalRewardRatePerWeek } = this.getRates(
						rewardToken,
						values.poolRewardRate,
						values.totalStake,
						values.stake
					);

					const totalStakedInUsd = await this.getTotalStakeInUsd(
						pair,
						stakeToken,
						values.totalStake,
						chainId
					);

					const stakedInUsd = this.getStakeInUsd(
						values.totalStake,
						values.stake,
						totalStakedInUsd
					);

					const {
						extraRewardToken,
						extraRewardRatePerWeek,
						extraTotalRewardRatePerWeek,
						extraUnclaimed,
					} = await this.getExtraReward({
						totalRewardRatePerWeek,
						rewardRatePerWeek,
						poolId,
						chainId,
						farmContract,
						unclaimed: values.unclaimed,
					});

					const { swapFeeApr, superFarmApr, combinedApr } =
						await LpTokenServices.getAprs(poolId, !!extraRewardToken);

					let tokenA: Token;
					let tokenB: Token;

					if (tokenPair[0].symbol === "WSYS") {
						const {
							decimals,
							address: tokenAaddress,
							chainId,
							name,
						} = tokenPair[0];

						tokenA = new Token(chainId, tokenAaddress, decimals, "SYS", name);
					} else {
						tokenA = tokenPair[0] as Token;
					}

					if (tokenPair[1].symbol === "WSYS") {
						const {
							decimals,
							address: tokenBaddress,
							chainId,
							name,
						} = tokenPair[1];

						tokenB = new Token(chainId, tokenBaddress, decimals, "SYS", name);
					} else {
						tokenB = tokenPair[1] as Token;
					}

					pairsWithLiquidityToken.push({
						stakeToken,
						rewardToken,
						stakedAmount: values.stake,
						unstakedAmount: values.unstake,
						unclaimedAmount: values.unclaimed,
						totalStakedAmount: values.totalStake,
						rewardRatePerWeek,
						totalRewardRatePerWeek,
						stakedInUsd,
						totalStakedInUsd,
						tokenA,
						tokenB,
						extraRewardToken,
						extraRewardRatePerWeek,
						extraTotalRewardRatePerWeek,
						extraUnclaimed,
						swapFeeApr,
						superFarmApr,
						combinedApr,
						poolId,
						pair,
					});
				}
			})
		);

		return pairsWithLiquidityToken;
	}

	static async withdraw({
		poolId,
		amount,
		address,
		chainId,
		farmContract,
	}: IFarmServicesWithdraw) {
		let txHash = "";
		const contract =
			farmContract ?? ContractFramework.FarmContract({ chainId });

		const res = await ContractFramework.call({
			methodName: "withdraw",
			contract,
			args: [poolId, `0x${amount}`, address],
		});

		txHash = `${res?.hash}`;

		return {
			hash: txHash,
			response: res ?? null,
		};
	}

	static async withdrawAndClaim({
		poolId,
		amount,
		address,
		chainId,
		farmContract,
	}: IFarmServicesWithdraw) {
		let txHash = "";
		const contract =
			farmContract ?? ContractFramework.FarmContract({ chainId });

		const res = await ContractFramework.call({
			methodName: "withdrawAndHarvest",
			contract,
			args: [poolId, `0x${amount}`, address],
		});

		txHash = `${res?.hash}`;

		return {
			hash: txHash,
			response: res ?? null,
		};
	}

	static async claim({
		poolId,
		address,
		farmContract,
		chainId,
	}: IFarmServicesClaim) {
		let txHash = "";
		const contract =
			farmContract ?? ContractFramework.FarmContract({ chainId });

		const res = await ContractFramework.call({
			methodName: "harvest",
			contract,
			args: [poolId, address],
		});

		txHash = `${res?.hash}`;

		return {
			hash: txHash,
			response: res ?? null,
		};
	}

	static async deposit({
		poolId,
		amount,
		address,
		signatureData,
		chainId,
		farmContract,
	}: IFarmServicesDeposit) {
		let txHash = "";
		if (signatureData) {
			const contract =
				farmContract ?? ContractFramework.FarmContract({ chainId });

			const res = await ContractFramework.call({
				methodName: "depositWithPermit",
				contract,
				args: [
					poolId,
					`0x${amount}`,
					address,
					signatureData.deadline.toNumber(),
					signatureData.v,
					signatureData.r,
					signatureData.s,
				],
			});

			txHash = `${res?.hash}`;

			return {
				hash: txHash,
				response: res ?? null,
			};
		}

		return {
			hash: txHash,
			response: null,
		};
	}
}

export default FarmServices;
