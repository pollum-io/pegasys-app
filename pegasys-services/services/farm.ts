import { ChainId, JSBI, Token, TokenAmount } from "@pollum-io/pegasys-sdk";

import { WrappedTokenInfo } from "types";

import { IStakeInfo } from "../dto";
import LpTokenServices from "./lpToken";
import { ContractFramework } from "../frameworks";
import { BIG_INT_SECONDS_IN_WEEK, PSYS, ZERO_ADDRESS } from "../constants";

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
}

export default FarmServices;
