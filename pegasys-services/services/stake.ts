import { ChainId, JSBI, TokenAmount, WSYS } from "@pollum-io/pegasys-sdk";

import { ContractFramework } from "../frameworks";
import {
	BIG_INT_ONE,
	BIG_INT_ONE_WEEK_IN_SECONDS,
	BIG_INT_TWO,
	BIG_INT_ZERO,
	PegasysTokens,
} from "../constants";
import {
	IStakeInfo,
	IStakeServicesClaim,
	IStakeServicesStake,
	IStakeServicesGetApr,
	IStakeServicesUnstake,
	IStakeServicesGetUnstake,
	IStakeServicesGetUnclaimed,
	IStakeServicesGetStakeReward,
	IStakeServicesGetPeriodFinish,
	IStakeServicesGetStakedAmount,
	IStakeServicesUnstakeAndClaim,
	IStakeServicesGetTotalStakedAmount,
	IStakeServicesGetStakeOpportunities,
	IStakeServicesGetDollarValues,
} from "../dto";
import PairServices from "./pair";
import TokenServices from "./token";

class StakeServices {
	private static async getTotalStakedAmount({
		stakeContract,
		chainId,
		stakeToken,
		provider,
	}: IStakeServicesGetTotalStakedAmount) {
		const contract =
			stakeContract ??
			ContractFramework.StakeContract({
				chainId,
				provider,
			});

		const totalSupply = await ContractFramework.call({
			contract,
			methodName: "totalSupply",
		});

		const totalStakedAmount = new TokenAmount(
			stakeToken,
			JSBI.BigInt(totalSupply ?? BIG_INT_ZERO)
		);

		return totalStakedAmount;
	}

	private static async getStakedAmount({
		chainId,
		provider,
		stakeToken,
		stakeContract,
		walletAddress,
	}: IStakeServicesGetStakedAmount) {
		const contract =
			stakeContract ?? ContractFramework.StakeContract({ chainId, provider });

		const balance = await ContractFramework.call({
			contract,
			methodName: "balanceOf",
			args: [walletAddress],
		});

		const stakedAmount = new TokenAmount(
			stakeToken,
			balance ? JSBI.BigInt(balance) : BIG_INT_ZERO
		);

		return stakedAmount;
	}

	private static async getUnstake({
		stakeToken,
		walletAddress,
		provider,
	}: IStakeServicesGetUnstake) {
		const contract = ContractFramework.TokenContract({
			address: stakeToken.address,
			provider,
		});

		const unstake = await ContractFramework.call({
			contract,
			methodName: "balanceOf",
			args: [walletAddress],
		});

		return new TokenAmount(
			stakeToken,
			JSBI.BigInt(unstake.toString() ?? BIG_INT_ZERO)
		);
	}

	private static async getUnclaimed({
		chainId,
		stakeContract,
		rewardToken,
		walletAddress,
		provider,
	}: IStakeServicesGetUnclaimed) {
		const contract =
			stakeContract ?? ContractFramework.StakeContract({ chainId, provider });

		const unclaimed = await ContractFramework.call({
			contract,
			methodName: "earned",
			args: [walletAddress],
		});

		return new TokenAmount(
			rewardToken,
			JSBI.BigInt(unclaimed.toString() ?? BIG_INT_ZERO)
		);
	}

	private static async getApr({
		chainId,
		provider,
		totalRewardRatePerSecond,
		isPeriodFinished,
		totalStaked,
	}: IStakeServicesGetApr) {
		const tokens = PegasysTokens[chainId ?? ChainId.NEVM];

		const psys = tokens.PSYS;
		const wsys = tokens.WSYS;

		const contract = ContractFramework.RouterContract({
			chainId,
			provider,
		});

		const amountIn = `1${"0".repeat(18)}`; // 1 PSYS

		const amountsOut = await ContractFramework.call({
			contract,
			methodName: "getAmountsOut",
			args: [amountIn, [psys.address, wsys.address, psys.address]],
		});

		const valueOfPsys = JSBI.BigInt(amountsOut.slice(-1)?.[0] ?? 0);

		// TODO: Handle situation where stakingToken and rewardToken have different decimals
		const oneToken = JSBI.BigInt(amountIn);

		const rewardRateInPsys =
			!valueOfPsys || JSBI.EQ(valueOfPsys, 0)
				? JSBI.BigInt(0)
				: JSBI.divide(
						JSBI.multiply(totalRewardRatePerSecond.raw, oneToken), // Multiply first for precision
						valueOfPsys
				  );

		let apr: JSBI;

		if (isPeriodFinished || JSBI.EQ(totalStaked.raw, BIG_INT_ZERO)) {
			apr = JSBI.BigInt(0);
		} else {
			const rewardsPerYear = JSBI.multiply(
				rewardRateInPsys,
				JSBI.BigInt(31536000) // Seconds in year
			);

			apr = JSBI.divide(
				JSBI.multiply(rewardsPerYear, JSBI.BigInt(100)),
				totalStaked.raw
			);
		}

		return apr;
	}

	private static async getPeriodFinish({
		chainId,
		provider,
		stakeContract,
	}: IStakeServicesGetPeriodFinish) {
		const contract =
			stakeContract ?? ContractFramework.StakeContract({ chainId, provider });

		const periodFinish = await ContractFramework.call({
			contract,
			methodName: "periodFinish",
		});

		const periodFinishMs = periodFinish?.mul(1000)?.toNumber();

		return periodFinishMs;
	}

	private static async getStakeReward({
		chainId,
		stakeContract,
		provider,
		rewardToken,
		isPeriodFinished,
		totalStaked,
		staked,
	}: IStakeServicesGetStakeReward) {
		const contract =
			stakeContract ?? ContractFramework.StakeContract({ chainId, provider });

		const rewardRate = await ContractFramework.call({
			contract,
			methodName: "rewardRate",
		});

		const totalRewardRatePerSecond = new TokenAmount(
			rewardToken,
			isPeriodFinished ? BIG_INT_ZERO : JSBI.BigInt(rewardRate)
		);

		const totalRewardRatePerWeek = new TokenAmount(
			rewardToken,
			JSBI.multiply(totalRewardRatePerSecond.raw, BIG_INT_ONE_WEEK_IN_SECONDS)
		);

		const rewardRatePerWeek = new TokenAmount(
			rewardToken,
			JSBI.greaterThan(totalStaked.raw, BIG_INT_ZERO)
				? JSBI.divide(
						JSBI.multiply(
							JSBI.multiply(totalRewardRatePerSecond.raw, staked.raw),
							BIG_INT_ONE_WEEK_IN_SECONDS
						),
						totalStaked.raw
				  )
				: BIG_INT_ZERO
		);

		return {
			totalRewardRatePerSecond,
			totalRewardRatePerWeek,
			rewardRatePerWeek,
		};
	}

	static async getDollarValues({
		chainId,
		totalStaked,
		staked,
		unclaimedAmount,
		rewardRatePerWeek,
	}: IStakeServicesGetDollarValues) {
		const tokens = PegasysTokens[chainId ?? ChainId.NEVM];

		const psys = tokens.PSYS;
		const wsys = tokens.WSYS;

		const [[sysPsysPairState, sysPsysPair]] = await PairServices.getPairs([
			[wsys, psys],
		]);

		const oneToken = JSBI.BigInt(`1${"0".repeat(18)}`);

		const sysPsysRatio = JSBI.divide(
			JSBI.multiply(oneToken, sysPsysPair?.reserveOf(wsys).raw ?? BIG_INT_ZERO),
			sysPsysPair?.reserveOf(psys).raw ?? BIG_INT_ONE
		);

		const totalStakedValueOfPsysInSys = JSBI.divide(
			JSBI.multiply(totalStaked.raw, sysPsysRatio),
			oneToken
		);

		const stakedValueOfPsysInSys = JSBI.divide(
			JSBI.multiply(staked.raw, sysPsysRatio),
			oneToken
		);

		const unclaimedValueOfPsysInSys = JSBI.divide(
			JSBI.multiply(unclaimedAmount.raw, sysPsysRatio),
			oneToken
		);

		const rewardRateValueOfPsysInSys = JSBI.divide(
			JSBI.multiply(rewardRatePerWeek.raw, sysPsysRatio),
			oneToken
		);

		const totalStakedInWsys = new TokenAmount(
			wsys,
			JSBI.divide(
				JSBI.multiply(
					JSBI.multiply(totalStaked.raw, totalStakedValueOfPsysInSys),
					BIG_INT_TWO // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
				),
				totalStaked.raw
			)
		);

		const stakedInWsys = new TokenAmount(
			wsys,
			JSBI.divide(
				JSBI.multiply(
					JSBI.multiply(staked.raw, stakedValueOfPsysInSys),
					BIG_INT_TWO // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
				),
				totalStaked.raw
			)
		);

		const unclaimedInWsys = new TokenAmount(
			wsys,
			JSBI.divide(
				JSBI.multiply(
					JSBI.multiply(unclaimedAmount.raw, unclaimedValueOfPsysInSys),
					BIG_INT_TWO // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
				),
				totalStaked.raw
			)
		);

		const rewardRateInWsys = new TokenAmount(
			wsys,
			JSBI.divide(
				JSBI.multiply(
					JSBI.multiply(rewardRatePerWeek.raw, rewardRateValueOfPsysInSys),
					BIG_INT_TWO // this is b/c the value of LP shares are ~double the value of the wsys they entitle owner to
				),
				totalStaked.raw
			)
		);

		const usdPrice = await TokenServices.getUsdcPrice(wsys, chainId);

		return {
			totalStakedInUsd: Number(usdPrice?.quote(totalStakedInWsys).raw),
			stakedInUsd: Number(usdPrice?.quote(stakedInWsys).raw),
			unclaimedInUsd: Number(usdPrice?.quote(unclaimedInWsys).raw),
			rewardRateInUsd: Number(usdPrice?.quote(rewardRateInWsys).raw),
		};
	}

	static async getStakeOpportunities({
		chainId,
		walletAddress,
		provider,
		stakeContract: contract,
	}: IStakeServicesGetStakeOpportunities) {
		const stakeContract =
			contract ??
			ContractFramework.StakeContract({
				chainId,
				provider,
			});

		const psys = PegasysTokens[chainId ?? ChainId.NEVM].PSYS;

		const opportunities = [
			{
				stakeToken: psys,
				rewardToken: psys,
			},
		];

		const stakeOpportunities: IStakeInfo[] = [];

		await Promise.all(
			opportunities.map(async ({ stakeToken, rewardToken }) => {
				const values: { [k: string]: any } = {};

				await Promise.all([
					this.getStakedAmount({
						walletAddress,
						stakeContract,
						stakeToken,
					}).then(stake => {
						values.stake = stake;
					}),
					this.getTotalStakedAmount({
						stakeContract,
						stakeToken,
					}).then(totalStake => {
						values.totalStake = totalStake;
					}),
					this.getUnstake({
						walletAddress,
						stakeToken,
						provider,
					}).then(unstaked => {
						values.unstaked = unstaked;
					}),
					this.getUnclaimed({
						walletAddress,
						stakeContract,
						rewardToken,
					}).then(unclaimed => {
						values.unclaimed = unclaimed;
					}),
					this.getPeriodFinish({
						stakeContract,
					}).then(periodFinishMs => {
						values.periodFinishMs = periodFinishMs;
					}),
				]);

				const isPeriodFinished =
					values.periodFinishMs === 0
						? false
						: values.periodFinishMs < Date.now();

				const {
					rewardRatePerWeek,
					totalRewardRatePerWeek,
					totalRewardRatePerSecond,
				} = await this.getStakeReward({
					stakeContract,
					rewardToken,
					isPeriodFinished,
					totalStaked: values.totalStake,
					staked: values.stake,
					provider,
				});

				const apr = await this.getApr({
					chainId,
					provider,
					totalRewardRatePerSecond,
					isPeriodFinished,
					totalStaked: values.totalStake,
				});

				const {
					totalStakedInUsd,
					stakedInUsd,
					unclaimedInUsd,
					rewardRateInUsd,
				} = await this.getDollarValues({
					chainId,
					totalStaked: values.totalStake,
					staked: values.stake,
					unclaimedAmount: values.unclaimed,
					rewardRatePerWeek,
				});

				stakeOpportunities.push({
					rewardToken,
					stakeToken,
					tokenA: psys,
					stakedAmount: values.stake,
					totalStakedAmount: values.totalStake,
					unclaimedAmount: values.unclaimed,
					unstakedAmount: values.unstaked,
					rewardRatePerWeek,
					totalRewardRatePerWeek,
					totalStakedInUsd,
					stakedInUsd,
					periodFinish: values.periodFinishMs
						? new Date(values.periodFinishMs)
						: undefined,
					isPeriodFinished: !!values.periodFinishMs,
					apr,
					rewardRatePerWeekInUsd: rewardRateInUsd,
					unclaimedInUsd,
				});
			})
		);

		return stakeOpportunities;
	}

	static async unstakeAndClaim({
		chainId,
		provider,
		stakeContract,
	}: IStakeServicesUnstakeAndClaim) {
		let txHash = "";
		const contract =
			stakeContract ??
			ContractFramework.StakeContract({
				chainId,
				provider,
			});

		const res = await ContractFramework.call({
			methodName: "exit",
			contract,
		});

		txHash = `${res?.hash}`;

		return {
			hash: txHash,
			response: res ?? null,
		};
	}

	static async unstake({
		amount,
		chainId,
		provider,
		stakeContract,
	}: IStakeServicesUnstake) {
		let txHash = "";
		const contract =
			stakeContract ??
			ContractFramework.StakeContract({
				chainId,
				provider,
			});

		const res = await ContractFramework.call({
			methodName: "withdraw",
			contract,
			args: [`0x${amount}`],
		});

		txHash = `${res?.hash}`;

		return {
			hash: txHash,
			response: res ?? null,
		};
	}

	static async stake({
		signatureData,
		amount,
		chainId,
		provider,
		stakeContract,
	}: IStakeServicesStake) {
		let txHash = "";
		const contract =
			stakeContract ?? ContractFramework.StakeContract({ chainId, provider });

		const res = await ContractFramework.call({
			methodName: "stakeWithPermit",
			contract,
			args: [
				`0x${amount}`,
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

	static async claim({
		stakeContract,
		provider,
		chainId,
	}: IStakeServicesClaim) {
		let txHash = "";
		const contract =
			stakeContract ?? ContractFramework.StakeContract({ chainId, provider });

		const res = await ContractFramework.call({
			methodName: "getReward",
			contract,
		});

		txHash = `${res?.hash}`;

		return {
			hash: txHash,
			response: res ?? null,
		};
	}
}

export default StakeServices;
