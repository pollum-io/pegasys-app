import {
	ChainId,
	JSBI,
	Token,
	TokenAmount,
	WSYS,
} from "@pollum-io/pegasys-sdk";

import { BigNumber } from "ethers";
import { ITransactionResponse } from "types";
import { IEarnInfo, IStakeInfo, TContract, IStakeContractValues } from "../dto";
import { ContractFramework } from "../frameworks";
import { BIG_INT_SECONDS_IN_WEEK, BIG_INT_ZERO, PSYS } from "../constants";

class StakeServices {
	// static async getStakeInfos(
	// 	address: string,
	// 	chainId: ChainId
	// ): Promise<IEarnInfo> {
	// 	const psys = PSYS[ChainId.NEVM];
	// 	const wsys = WSYS[ChainId.NEVM];

	// 	const contract = ContractFramework.StakeContract(chainId);

	// 	// const balance = await ContractFramework.call({
	// 	// 	contract,
	// 	// 	methodName: "balanceOf",
	// 	// 	args: [address],
	// 	// });

	// 	// const earned = await ContractFramework.call({
	// 	// 	contract,
	// 	// 	methodName: "earned",
	// 	// 	args: [address],
	// 	// });

	// 	// const totalSupply = await ContractFramework.call({
	// 	// 	contract,
	// 	// 	methodName: "totalSupply",
	// 	// });

	// 	const rewardRate = await ContractFramework.call({
	// 		contract,
	// 		methodName: "rewardRate",
	// 	});

	// 	const periodFinish = await ContractFramework.call({
	// 		contract,
	// 		methodName: "periodFinish",
	// 	});

	// 	const routerContract = ContractFramework.RouterContract(ChainId.NEVM);

	// 	const amountIn = `1${"0".repeat(18)}`; // 1 PSYS

	// 	const amountsOut = await ContractFramework.call({
	// 		contract: routerContract,
	// 		methodName: "getAmountsOut",
	// 		args: [amountIn, [psys.address, wsys.address, psys.address]],
	// 	});

	// 	const valueOfPsys = JSBI.BigInt(amountsOut.slice(-1)?.[0] ?? 0);

	// 	const periodFinishMs = periodFinish?.mul(1000)?.toNumber();

	// 	const isPeriodFinished =
	// 		periodFinishMs === 0 ? false : periodFinishMs < Date.now();

	// 	// const totalSupplyStaked = JSBI.BigInt(totalSupply);

	// 	// const stakedAmount = new TokenAmount(psys, JSBI.BigInt(balance ?? 0));

	// 	// const totalStakedAmount = new TokenAmount(psys, totalSupplyStaked);

	// 	const totalRewardRatePerSecond = new TokenAmount(
	// 		psys,
	// 		JSBI.BigInt(isPeriodFinished ? 0 : rewardRate)
	// 	);

	// 	const totalRewardRatePerWeek = new TokenAmount(
	// 		psys,
	// 		JSBI.multiply(totalRewardRatePerSecond.raw, BIG_INT_SECONDS_IN_WEEK)
	// 	);

	// 	// const earnedAmount = new TokenAmount(psys, JSBI.BigInt(earned ?? 0));

	// 	// TODO: Handle situation where stakingToken and rewardToken have different decimals
	// 	const oneToken = JSBI.BigInt(amountIn);

	// 	const rewardRateInPsys =
	// 		!valueOfPsys || JSBI.EQ(valueOfPsys, 0)
	// 			? JSBI.BigInt(0)
	// 			: JSBI.divide(
	// 				JSBI.multiply(totalRewardRatePerSecond.raw, oneToken), // Multiply first for precision
	// 				valueOfPsys
	// 			);

	// 	let apr: JSBI;

	// 	if (isPeriodFinished || JSBI.EQ(totalSupplyStaked, 0)) {
	// 		apr = JSBI.BigInt(0);
	// 	} else {
	// 		const rewardsPerYear = JSBI.multiply(
	// 			rewardRateInPsys,
	// 			JSBI.BigInt(31536000) // Seconds in year
	// 		);

	// 		apr = JSBI.divide(
	// 			JSBI.multiply(rewardsPerYear, JSBI.BigInt(100)),
	// 			totalSupplyStaked
	// 		);
	// 	}

	// 	const individualRewardRate = new TokenAmount(
	// 		psys,
	// 		JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
	// 			? JSBI.divide(
	// 				JSBI.multiply(totalRewardRatePerWeek.raw, stakedAmount.raw),
	// 				totalStakedAmount.raw
	// 			)
	// 			: JSBI.BigInt(0)
	// 	);

	// 	const individualWeeklyRewardRate = new TokenAmount(
	// 		psys,
	// 		JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
	// 			? JSBI.divide(
	// 				JSBI.multiply(
	// 					JSBI.multiply(totalRewardRatePerSecond.raw, stakedAmount.raw),
	// 					BIG_INT_SECONDS_IN_WEEK
	// 				),
	// 				totalStakedAmount.raw
	// 			)
	// 			: JSBI.BigInt(0)
	// 	);

	// 	// const tokenContract = ContractFramework.TokenContract(psys.address);

	// 	// const unstakedPsys = await ContractFramework.call({
	// 	// 	contract: tokenContract,
	// 	// 	methodName: "balanceOf",
	// 	// 	args: [address],
	// 	// });

	// 	// const unstakedPsysAmount = new TokenAmount(psys, unstakedPsys);

	// 	return {
	// 		stakeToken: psys,
	// 		rewardToken: psys,
	// 		stakedAmount,
	// 		unstakedAmount: unstakedPsysAmount,
	// 		unclaimedAmount: earnedAmount,
	// 		totalStakedAmount,
	// 		rewardRatePerWeek: individualWeeklyRewardRate,
	// 		totalRewardRatePerWeek,
	// 		stakedInUsd: JSBI,
	// 		totalStakedInUsd: TokenAmount,

	// 		// rewardToken: psys,
	// 		periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
	// 		isPeriodFinished,
	// 		// earnedAmount,
	// 		// rewardRate: individualRewardRate,
	// 		// totalRewardRate: totalRewardRatePerWeek,
	// 		// totalStakedInPsys: totalStakedAmount,
	// 		apr,
	// 		// unstakedPsysAmount,
	// 		// totalRewardRatePerWeek,
	// 		// totalRewardRatePerSecond,
	// 		// rewardRatePerWeek: individualWeeklyRewardRate,
	// 	};
	// }

	private static async getTotalStakedAmount(props: {
		chainId?: ChainId;
		contract?: TContract;
		stakeToken: Token;
	}) {
		const contract =
			props.contract ?? ContractFramework.StakeContract(props.chainId);

		const totalSupply = await ContractFramework.call({
			contract,
			methodName: "totalSupply",
		});

		const totalStakedAmount = new TokenAmount(
			props.stakeToken,
			JSBI.BigInt(totalSupply ?? BIG_INT_ZERO)
		);

		return totalStakedAmount;
	}

	private static async getStakedAmount(props: {
		address: string;
		chainId?: ChainId;
		contract?: TContract;
		stakeToken: Token;
	}) {
		const contract =
			props.contract ?? ContractFramework.StakeContract(props.chainId);

		const balance = await ContractFramework.call({
			contract,
			methodName: "balanceOf",
			args: [props.address],
		});

		const stakedAmount = new TokenAmount(
			props.stakeToken,
			JSBI.BigInt(balance ?? BIG_INT_ZERO)
		);

		return stakedAmount;
	}

	private static async getUnstake(props: {
		stakeToken: Token;
		address: string;
	}) {
		const contract = ContractFramework.TokenContract(props.stakeToken.address);

		const unstake = await ContractFramework.call({
			contract,
			methodName: "balanceOf",
			args: [props.address],
		});

		return new TokenAmount(
			props.stakeToken,
			JSBI.BigInt(unstake.toString() ?? BIG_INT_ZERO)
		);
	}

	private static async getUnclaimed(props: {
		rewardToken: Token;
		address: string;
		chainId?: ChainId;
		contract?: TContract;
	}) {
		const contract =
			props.contract ?? ContractFramework.StakeContract(props.chainId);

		const unclaimed = await ContractFramework.call({
			contract,
			methodName: "earned",
			args: [props.address],
		});

		return new TokenAmount(
			props.rewardToken,
			JSBI.BigInt(unclaimed.toString() ?? BIG_INT_ZERO)
		);
	}

	// private static async getValueOfPsys(props: {
	// 	chainId?: ChainId
	// }) {
	// 	const psys = PSYS[props.chainId ?? ChainId.NEVM];
	// 	const wsys = WSYS[props.chainId ?? ChainId.NEVM];

	// 	const contract = ContractFramework.RouterContract(props.chainId ?? ChainId.NEVM);

	// 	const amountIn = `1${"0".repeat(18)}`; // 1 PSYS

	// 	const amountsOut = await ContractFramework.call({
	// 		contract,
	// 		methodName: "getAmountsOut",
	// 		args: [amountIn, [psys.address, wsys.address, psys.address]],
	// 	});

	// 	const valueOfPsys = JSBI.BigInt(amountsOut.slice(-1)?.[0] ?? 0);

	// 	return valueOfPsys
	// }

	private static async getApr(props: {
		chainId?: ChainId;
		totalRewardRatePerSecond: TokenAmount;
		isPeriodFinished: boolean;
		totalStaked: TokenAmount;
	}) {
		const psys = PSYS[props.chainId ?? ChainId.NEVM];
		const wsys = WSYS[props.chainId ?? ChainId.NEVM];

		const contract = ContractFramework.RouterContract(
			props.chainId ?? ChainId.NEVM
		);

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
						JSBI.multiply(props.totalRewardRatePerSecond.raw, oneToken), // Multiply first for precision
						valueOfPsys
				  );

		let apr: JSBI;

		if (
			props.isPeriodFinished ||
			JSBI.EQ(props.totalStaked.raw, BIG_INT_ZERO)
		) {
			apr = JSBI.BigInt(0);
		} else {
			const rewardsPerYear = JSBI.multiply(
				rewardRateInPsys,
				JSBI.BigInt(31536000) // Seconds in year
			);

			apr = JSBI.divide(
				JSBI.multiply(rewardsPerYear, JSBI.BigInt(100)),
				props.totalStaked.raw
			);
		}

		return apr;
	}

	private static async getPeriodFinish(props: {
		contract?: TContract;
		chainId?: ChainId;
	}) {
		const contract =
			props.contract ?? ContractFramework.StakeContract(props.chainId);

		const periodFinish = await ContractFramework.call({
			contract,
			methodName: "periodFinish",
		});

		const periodFinishMs = periodFinish?.mul(1000)?.toNumber();

		return periodFinishMs;
	}

	private static async getStakeReward(props: {
		contract?: TContract;
		chainId?: ChainId;
		rewardToken: Token;
		isPeriodFinished?: boolean;
		totalStaked: TokenAmount;
		staked: TokenAmount;
	}) {
		const contract =
			props.contract ?? ContractFramework.StakeContract(props.chainId);

		const rewardRate = await ContractFramework.call({
			contract,
			methodName: "rewardRate",
		});

		const totalRewardRatePerSecond = new TokenAmount(
			props.rewardToken,
			props.isPeriodFinished ? BIG_INT_ZERO : JSBI.BigInt(rewardRate)
		);

		const totalRewardRatePerWeek = new TokenAmount(
			props.rewardToken,
			JSBI.multiply(totalRewardRatePerSecond.raw, BIG_INT_SECONDS_IN_WEEK)
		);

		const rewardRatePerWeek = new TokenAmount(
			props.rewardToken,
			JSBI.greaterThan(props.totalStaked.raw, BIG_INT_ZERO)
				? JSBI.divide(
						JSBI.multiply(
							JSBI.multiply(totalRewardRatePerSecond.raw, props.staked.raw),
							BIG_INT_SECONDS_IN_WEEK
						),
						props.totalStaked.raw
				  )
				: BIG_INT_ZERO
		);

		return {
			totalRewardRatePerSecond,
			totalRewardRatePerWeek,
			rewardRatePerWeek,
		};
	}

	private static async getPsysUsdPrice() {}

	static async getStakeOpportunities(address: string, chainId: ChainId) {
		const stakeContract = ContractFramework.StakeContract(chainId);

		const psys = PSYS[chainId ?? ChainId.NEVM];

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
						address,
						contract: stakeContract,
						stakeToken,
					}).then(stake => {
						values.stake = stake;
					}),
					this.getTotalStakedAmount({
						contract: stakeContract,
						stakeToken,
					}).then(totalStake => {
						values.totalStake = totalStake;
					}),
					this.getUnstake({
						address,
						stakeToken,
					}).then(unstaked => {
						values.unstaked = unstaked;
					}),
					this.getUnclaimed({
						address,
						contract: stakeContract,
						rewardToken,
					}).then(unclaimed => {
						values.unclaimed = unclaimed;
					}),
					this.getPeriodFinish({
						contract: stakeContract,
						chainId,
					}).then(periodFinishMs => {
						values.periodFinishMs = periodFinishMs;
					}),
				]);

				const {
					rewardRatePerWeek,
					totalRewardRatePerWeek,
					totalRewardRatePerSecond,
				} = await this.getStakeReward({
					contract: stakeContract,
					chainId,
					rewardToken,
					isPeriodFinished: !!values.periodFinishMs,
					totalStaked: values.totalStake,
					staked: values.stake,
				});

				const apr = await this.getApr({
					chainId,
					totalRewardRatePerSecond,
					isPeriodFinished: !!values.periodFinishMs,
					totalStaked: values.totalStake,
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
					totalStakedInUsd: 0,
					stakedInUsd: 0,
					periodFinish: values.periodFinishMs
						? new Date(values.periodFinishMs)
						: undefined,
					isPeriodFinished: !!values.periodFinishMs,
					apr,
					rewardRatePerWeekInUsd: 0,
					totalRewardRatePerWeekInUsd: 0,
				});
			})
		);

		return stakeOpportunities;
	}

	static async unstakeAndClaim() {
		let txHash = "";
		let txResponse: ITransactionResponse | any = null;
		const contract = ContractFramework.StakeContract(ChainId.NEVM);

		await ContractFramework.call({
			methodName: "exit",
			contract,
		}).then((res: ITransactionResponse) => {
			txHash = `${res?.hash}`;
			txResponse = res;
		});

		return {
			hash: txHash,
			response: txResponse,
		};
	}

	static async unstake(amount: string) {
		let txHash = "";
		let txResponse: ITransactionResponse | any = null;
		const contract = ContractFramework.StakeContract(ChainId.NEVM);

		await ContractFramework.call({
			methodName: "withdraw",
			contract,
			args: [`0x${amount}`],
		}).then((res: ITransactionResponse) => {
			txHash = `${res?.hash}`;
			txResponse = res;
		});

		return {
			hash: txHash,
			response: txResponse,
		};
	}

	static async stake(
		amount: string,
		signatureData: {
			v: number;
			r: string;
			s: string;
			deadline: BigNumber;
		}
	) {
		let txHash = "";
		let txResponse: ITransactionResponse | any = null;
		const contract = ContractFramework.StakeContract(ChainId.NEVM);

		await ContractFramework.call({
			methodName: "stakeWithPermit",
			contract,
			args: [
				`0x${amount}`,
				signatureData.deadline.toNumber(),
				signatureData.v,
				signatureData.r,
				signatureData.s,
			],
		}).then((res: ITransactionResponse) => {
			txHash = `${res?.hash}`;
			txResponse = res;
		});

		return {
			hash: txHash,
			response: txResponse,
		};
	}

	static async claim() {
		let txHash = "";
		let txResponse: ITransactionResponse | any = null;
		const contract = ContractFramework.StakeContract(ChainId.NEVM);

		await ContractFramework.call({
			methodName: "getReward",
			contract,
		}).then((res: ITransactionResponse) => {
			txHash = `${res?.hash}`;
			txResponse = res;
		});

		return {
			hash: txHash,
			response: txResponse,
		};
	}
}

export default StakeServices;
