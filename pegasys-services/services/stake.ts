import { ChainId, JSBI, TokenAmount, WSYS } from "@pollum-io/pegasys-sdk";

import { IStakeInfo } from "../dto";
import { ContractFramework } from "../frameworks";
import { BIG_INT_SECONDS_IN_WEEK, PSYS } from "../constants";

class StakeServices {
	static async getStakeInfos(
		address: string,
		chainId: ChainId
	): Promise<IStakeInfo[]> {
		const psys = PSYS[ChainId.NEVM];
		const wsys = WSYS[ChainId.NEVM];

		const contract = ContractFramework.StakeContract(chainId);

		const balance = await ContractFramework.call({
			contract,
			methodName: "balanceOf",
			args: [address],
		});

		const earned = await ContractFramework.call({
			contract,
			methodName: "earned",
			args: [address],
		});

		const totalSupply = await ContractFramework.call({
			contract,
			methodName: "totalSupply",
		});

		const rewardRate = await ContractFramework.call({
			contract,
			methodName: "rewardRate",
		});

		const periodFinish = await ContractFramework.call({
			contract,
			methodName: "periodFinish",
		});

		const routerContract = ContractFramework.RouterContract(ChainId.NEVM);

		const amountIn = `1${"0".repeat(18)}`; // 1 PSYS

		const amountsOut = await ContractFramework.call({
			contract: routerContract,
			methodName: "getAmountsOut",
			args: [amountIn, [psys.address, wsys.address, psys.address]],
		});

		const valueOfPsys = JSBI.BigInt(amountsOut.slice(-1)?.[0] ?? 0);

		const periodFinishMs = periodFinish?.mul(1000)?.toNumber();

		const isPeriodFinished =
			periodFinishMs === 0 ? false : periodFinishMs < Date.now();

		const totalSupplyStaked = JSBI.BigInt(totalSupply);

		const stakedAmount = new TokenAmount(psys, JSBI.BigInt(balance ?? 0));

		const totalStakedAmount = new TokenAmount(psys, totalSupplyStaked);

		const totalRewardRatePerSecond = new TokenAmount(
			psys,
			JSBI.BigInt(isPeriodFinished ? 0 : rewardRate)
		);

		const totalRewardRatePerWeek = new TokenAmount(
			psys,
			JSBI.multiply(totalRewardRatePerSecond.raw, BIG_INT_SECONDS_IN_WEEK)
		);

		const earnedAmount = new TokenAmount(psys, JSBI.BigInt(earned ?? 0));

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

		if (isPeriodFinished || JSBI.EQ(totalSupplyStaked, 0)) {
			apr = JSBI.BigInt(0);
		} else {
			const rewardsPerYear = JSBI.multiply(
				rewardRateInPsys,
				JSBI.BigInt(31536000) // Seconds in year
			);

			apr = JSBI.divide(
				JSBI.multiply(rewardsPerYear, JSBI.BigInt(100)),
				totalSupplyStaked
			);
		}

		const individualRewardRate = new TokenAmount(
			psys,
			JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
				? JSBI.divide(
						JSBI.multiply(totalRewardRatePerWeek.raw, stakedAmount.raw),
						totalStakedAmount.raw
				  )
				: JSBI.BigInt(0)
		);

		const individualWeeklyRewardRate = new TokenAmount(
			psys,
			JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
				? JSBI.divide(
						JSBI.multiply(
							JSBI.multiply(totalRewardRatePerSecond.raw, stakedAmount.raw),
							BIG_INT_SECONDS_IN_WEEK
						),
						totalStakedAmount.raw
				  )
				: JSBI.BigInt(0)
		);

		return [
			{
				rewardToken: psys,
				periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
				isPeriodFinished,
				earnedAmount,
				rewardRate: individualRewardRate,
				totalRewardRate: totalRewardRatePerWeek,
				stakedAmount,
				totalStakedAmount,
				totalStakedInPsys: totalStakedAmount,
				apr,
				totalRewardRatePerWeek,
				totalRewardRatePerSecond,
				rewardRatePerWeek: individualWeeklyRewardRate,
			},
		];
	}

	static async stake(amount: string) {
		const contract = ContractFramework.StakeContract(ChainId.NEVM);

		await ContractFramework.call({
			methodName: "stake",
			contract,
			args: [`0x${amount}`],
		});
	}

	static async unstake() {
		const contract = ContractFramework.StakeContract(ChainId.NEVM);

		await ContractFramework.call({
			methodName: "exit",
			contract,
		});
	}

	static async stakeWithPermit(
		amount: string,
		signatureData: {
			v: number;
			r: string;
			s: string;
			deadline: number;
		}
	) {
		const contract = ContractFramework.StakeContract(ChainId.NEVM);

		await ContractFramework.call({
			methodName: "stake",
			contract,
			args: [
				`0x${amount}`,
				signatureData.deadline,
				signatureData.v,
				signatureData.r,
				signatureData.s,
			],
		});
	}

	static async claim() {
		const contract = ContractFramework.StakeContract(ChainId.NEVM);

		await ContractFramework.call({
			methodName: "getReward",
			contract,
		});
	}
}

export default StakeServices;
