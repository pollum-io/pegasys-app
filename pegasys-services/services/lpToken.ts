import { ChainId, Pair, Token } from "@pollum-io/pegasys-sdk";

import { API } from "../constants";
import { ContractFramework, RoutesFramework } from "../frameworks";
import {
	ILpServicesGetUserUnclaimedPSYS,
	ILpServicesGetAvailableLpTokens,
	ILpServicesGetTotalAllocPoint,
	ILpServicesGetBalanceProps,
	ILpServicesGetRewardPerSec,
	ILpServicesGetTotalSupply,
	ILpServicesGetAllocPoint,
	ILpServicesGetUserStake,
	ILpServicesGetLpTokens,
	ILpServicesGetRewarder,
	ILpServicesGetPoolMap,
	TContract,
} from "../dto";

class LpTokenServices {
	static async getPoolMap({
		tokenAddresses,
		...props
	}: ILpServicesGetPoolMap): Promise<{ [key: string]: number }> {
		const lpTokens = tokenAddresses ?? (await this.getLpTokens(props));

		const poolMap: { [key: string]: number } = {};

		if (lpTokens.length) {
			lpTokens.forEach((address: string, index: number) => {
				poolMap[address] = index;
			});
		}
		return poolMap;
	}

	static async getLpTokens({
		chainId,
		provider,
		farmContract,
	}: ILpServicesGetLpTokens): Promise<string[]> {
		const contract =
			farmContract ??
			ContractFramework.FarmContract({
				chainId,
				provider,
			});

		const lpTokens = await ContractFramework.call({
			contract,
			methodName: "lpTokens",
		});

		return lpTokens;
	}

	static async getBalance({
		chainId,
		lpContract,
		contractAddress,
		provider,
	}: ILpServicesGetBalanceProps): Promise<bigint> {
		const contract =
			lpContract ??
			ContractFramework.TokenContract({
				address: contractAddress ?? "",
				provider,
			});

		const balance = await ContractFramework.call({
			contract,
			methodName: "balanceOf",
			args: [RoutesFramework.getMinichefAddress(chainId)],
		});

		return balance;
	}

	static getLpToken(tokenA: Token, tokenB: Token, chainId?: number) {
		const lpToken = new Token(
			chainId ?? ChainId.NEVM,
			Pair.getAddress(tokenA, tokenB, chainId ?? ChainId.NEVM),
			18,
			"PLP",
			"Pegasys LP Token"
		);

		return lpToken;
	}

	static async getRewarder({
		farmContract,
		chainId,
		provider,
		poolId,
	}: ILpServicesGetRewarder) {
		const contract =
			farmContract ??
			ContractFramework.FarmContract({
				chainId,
				provider,
			});

		const rewarder = await ContractFramework.call({
			contract,
			methodName: "rewarder",
			args: [[poolId]],
		});

		return rewarder;
	}

	static async getAprs(
		poolId: number,
		isSuperFarm?: boolean
	): Promise<{
		swapFeeApr: number;
		superFarmApr?: number;
		combinedApr: number;
	}> {
		try {
			const response = await fetch(`${API}pegasys/apr/${poolId}`);

			const data = await response.json();

			const { swapFeeApr, stakingApr, combinedApr } = data;

			let superFarmApr: undefined | number;

			if (isSuperFarm) {
				superFarmApr = stakingApr;
			}

			return {
				swapFeeApr,
				superFarmApr,
				combinedApr: superFarmApr ? combinedApr : swapFeeApr,
			};
		} catch (e) {
			return {
				swapFeeApr: 0,
				combinedApr: 0,
			};
		}
	}

	static async getUserStake({
		farmContract,
		chainId,
		provider,
		poolId,
		walletAddress,
	}: ILpServicesGetUserStake) {
		const contract =
			farmContract ??
			ContractFramework.FarmContract({
				chainId,
				provider,
			});

		const userInfo = await ContractFramework.call({
			contract,
			methodName: "userInfo",
			args: [[poolId], walletAddress],
		});

		const { amount } = userInfo as { amount: bigint };

		return amount;
	}

	static async getUserUnclaimedPSYS({
		farmContract,
		chainId,
		provider,
		poolId,
		walletAddress,
	}: ILpServicesGetUserUnclaimedPSYS) {
		const contract =
			farmContract ??
			ContractFramework.FarmContract({
				chainId,
				provider,
			});

		const unclaimedPSYS = await ContractFramework.call({
			contract,
			methodName: "pendingReward",
			args: [[poolId], walletAddress],
		});

		return unclaimedPSYS;
	}

	static async getAvailableLpTokens({
		walletAddress,
		lpContract,
		contractAddress,
		provider,
	}: ILpServicesGetAvailableLpTokens) {
		const contract =
			lpContract ??
			ContractFramework.TokenContract({
				address: contractAddress ?? "",
				provider,
			});

		const balance = await ContractFramework.call({
			contract,
			methodName: "balanceOf",
			args: [walletAddress],
		});

		return balance;
	}

	static async getTotalSupply({
		lpContract,
		provider,
		contractAddress,
	}: ILpServicesGetTotalSupply) {
		const contract =
			lpContract ??
			ContractFramework.TokenContract({
				address: contractAddress ?? "",
				provider,
			});

		const totalSupply = await ContractFramework.call({
			contract,
			methodName: "totalSupply",
		});

		return totalSupply;
	}

	static async getTotalAllocPoint({
		farmContract,
		chainId,
		provider,
	}: ILpServicesGetTotalAllocPoint) {
		const contract =
			farmContract ??
			ContractFramework.FarmContract({
				chainId,
				provider,
			});

		const totalAllocPoint = await ContractFramework.call({
			contract,
			methodName: "totalAllocPoint",
		});

		return totalAllocPoint;
	}

	static async getRewardPerSec({
		farmContract,
		chainId,
		provider,
	}: ILpServicesGetRewardPerSec) {
		const contract =
			farmContract ??
			ContractFramework.FarmContract({
				chainId,
				provider,
			});

		const rewardPerSecond = await ContractFramework.call({
			contract,
			methodName: "rewardPerSecond",
		});

		return rewardPerSecond;
	}

	static async getAllocPoint({
		poolId,
		farmContract,
		chainId,
		provider,
	}: ILpServicesGetAllocPoint) {
		const contract =
			farmContract ??
			ContractFramework.FarmContract({
				chainId,
				provider,
			});

		const poolInfo = await ContractFramework.call({
			contract,
			methodName: "poolInfo",
			args: [[poolId]],
		});

		const { allocPoint } = poolInfo as { allocPoint: bigint };

		return allocPoint;
	}

	static async getExtraRewarder(address: string) {
		const contract = ContractFramework.ExtraRewardContract({
			address,
		});

		const multiplier = await this.getRewardMultiplier(contract);
		const rewardAddress = await this.getRewardTokens(contract);

		return {
			multiplier,
			rewardAddress,
		};
	}

	private static async getRewardMultiplier(contract: TContract) {
		const multiplier: bigint[] = await ContractFramework.call({
			contract,
			methodName: "getRewardMultipliers",
		});

		return multiplier.length ? multiplier[0] : BigInt(0);
	}

	private static async getRewardTokens(contract: TContract) {
		const rewardAddress: string[] = await ContractFramework.call({
			contract,
			methodName: "getRewardTokens",
		});

		return rewardAddress.length ? rewardAddress[0] : "";
	}
}

export default LpTokenServices;
