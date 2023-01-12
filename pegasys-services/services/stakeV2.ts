import { ChainId, JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";

import {
	feeCollectorClient,
	GET_STAKE_DATA,
	stakeClient,
	feeCollectorDayData,
} from "apollo";

import { MaxUint256 } from "@ethersproject/constants";
import { ITransactionResponse } from "types";
import { ContractFramework } from "../frameworks";
import { BIG_INT_ZERO, PegasysTokens, PegasysContracts } from "../constants";
import {
	IStakeV2ServicesClaim,
	IStakeV2ServicesStake,
	IStakeV2ServicesUnstake,
	IStakeV2ServicesGetStakeOpportunities,
	IStakeV2Info,
	IStakeV2ServicesGetUnstake,
	IStakeV2ServicesGetUnclaimed,
	IStakeV2ServicesApprove,
} from "../dto";

class StakeV2Services {
	private static async getUnstake({
		stakeToken,
		walletAddress,
		provider,
	}: IStakeV2ServicesGetUnstake) {
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

	static async getUnclaimed({
		chainId,
		stakeContract,
		rewardToken,
		walletAddress,
		provider,
	}: IStakeV2ServicesGetUnclaimed) {
		const contract =
			stakeContract ?? ContractFramework.StakeV2Contract({ chainId, provider });

		const unclaimed = await ContractFramework.call({
			contract,
			methodName: "pendingReward",
			args: [walletAddress, rewardToken.address],
		});

		return new TokenAmount(
			rewardToken,
			JSBI.BigInt(unclaimed.toString() ?? BIG_INT_ZERO)
		);
	}

	static async getStakeOpportunities({
		chainId,
		provider,
		walletAddress,
		stakeContract: contract,
	}: IStakeV2ServicesGetStakeOpportunities) {
		const stakeContract =
			contract ??
			ContractFramework.StakeV2Contract({
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

		const stakeOpportunities: IStakeV2Info[] = [];

		const oneMonthAgo = new Date();

		if (oneMonthAgo.getMonth() === 0) {
			oneMonthAgo.setFullYear(oneMonthAgo.getFullYear() - 1);
			oneMonthAgo.setMonth(11);
		} else {
			oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
		}

		const oneMonthAgoUnix = Math.floor(oneMonthAgo.getTime() / 1000);

		await Promise.all(
			opportunities.map(async ({ stakeToken, rewardToken }) => {
				const stakeQuery = await stakeClient.query({
					query: GET_STAKE_DATA,
					variables: {
						id: stakeContract.address.toLowerCase(),
						walletAddress: walletAddress.toLowerCase(),
						date: oneMonthAgoUnix,
					},
					fetchPolicy: "network-only",
				});

				if (!stakeQuery.data) return;

				const {
					psysStaked,
					psysStakedUSD,
					psysHarvested,
					psysHarvestedUSD,
					depositFeePSYS,
					depositFeeUSD,
					updatedAt,
					users,
				} = stakeQuery.data.pegasysStaking;

				const decimalsMultiplier = 10 ** stakeToken.decimals;

				const totalStakedAmount = new TokenAmount(
					stakeToken,
					psysStaked
						? JSBI.BigInt(Number(psysStaked) * decimalsMultiplier)
						: BIG_INT_ZERO
				);

				const unstakedAmount = await this.getUnstake({
					stakeToken,
					walletAddress,
					provider,
				});

				const unclaimedAmount = await this.getUnclaimed({
					stakeContract,
					rewardToken,
					walletAddress,
				});

				const stakedAmount = new TokenAmount(
					stakeToken,
					users.length && users[0].psysStaked
						? JSBI.BigInt(Number(users[0].psysStaked) * decimalsMultiplier)
						: BIG_INT_ZERO
				);

				const sumDepositFeePSYS = (
					stakeQuery.data.pegasysStakingDayDatas ?? []
				).reduce(
					(acc: number, curr: { depositFeePSYS: string }) =>
						acc + Number(curr.depositFeePSYS),
					0
				);

				console.log("sumDepositFeePSYS: ", sumDepositFeePSYS);

				const feeCollectorQuery = await feeCollectorClient.query({
					query: feeCollectorDayData,
					variables: {
						date: oneMonthAgoUnix,
					},
					fetchPolicy: "network-only",
				});

				const sumTokenRemitted = (
					feeCollectorQuery.data && feeCollectorQuery.data.dayDatas
						? feeCollectorQuery.data.dayDatas
						: []
				).reduce(
					(acc: number, curr: { tokenRemitted: string }) =>
						acc + Number(curr.tokenRemitted),
					0
				);

				console.log("sumTokenRemitted: ", sumTokenRemitted);

				const apr = Math.floor(
					((sumTokenRemitted + sumDepositFeePSYS) * 1200) / Number(psysStaked)
				);

				console.log("apr: ", apr);

				stakeOpportunities.push({
					rewardToken,
					stakeToken,
					tokenA: psys,
					stakedAmount,
					totalStakedAmount,
					unclaimedAmount,
					unstakedAmount,
					rewardRatePerWeek: new TokenAmount(rewardToken, BIG_INT_ZERO),
					totalRewardRatePerWeek: new TokenAmount(rewardToken, BIG_INT_ZERO),
					totalStakedInUsd: Number(psysStakedUSD),
					stakedInUsd: users.length ? users[0].psysStakedUSD : 0,
					apr: JSBI.BigInt(apr),
					rewardRatePerWeekInUsd: 0,
					unclaimedInUsd: 0,
				});
			})
		);

		return stakeOpportunities;
	}

	static async unstake({
		amount,
		chainId,
		provider,
		stakeContract,
	}: IStakeV2ServicesUnstake) {
		let txHash = "";
		const contract =
			stakeContract ??
			ContractFramework.StakeV2Contract({
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
		amount,
		chainId,
		provider,
		stakeContract,
	}: IStakeV2ServicesStake) {
		let txHash = "";
		const contract =
			stakeContract ?? ContractFramework.StakeV2Contract({ chainId, provider });

		const res = await ContractFramework.call({
			methodName: "deposit",
			contract,
			args: [`0x${amount}`],
		});

		txHash = `${res?.hash}`;

		return {
			hash: txHash,
			response: res ?? null,
		};
	}

	static async claim(props: IStakeV2ServicesClaim) {
		const res = await this.stake({
			...props,
			amount: BIG_INT_ZERO.toString(16),
		});

		return res;
	}

	static async approve(props: IStakeV2ServicesApprove) {
		const { amountToApprove, chainId } = props;

		const spender =
			PegasysContracts[(chainId as ChainId) ?? ChainId.NEVM].STAKE_V2_ADDRESS;

		const token =
			amountToApprove instanceof TokenAmount
				? amountToApprove.token
				: undefined;

		if (!token) return undefined;

		const contract = ContractFramework.TokenContract({
			address: token.address,
		});

		let useExact = false;

		await contract.estimateGas.approve(spender, MaxUint256).catch(() => {
			// general fallback for tokens who restrict approval amounts
			useExact = true;
			return contract.estimateGas.approve(
				spender,
				amountToApprove.raw.toString()
			);
		});

		const res = await ContractFramework.call({
			methodName: "approve",
			contract,
			args: [spender, useExact ? amountToApprove.raw.toString() : MaxUint256],
		});

		const txHash = `${res?.hash}`;

		return {
			spender,
			hash: txHash,
			response: res,
		};
	}
}

export default StakeV2Services;
