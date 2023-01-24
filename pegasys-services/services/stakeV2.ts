import { ChainId, JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";

import {
	feeCollectorClient,
	GET_STAKE_DATA,
	stakeClient,
	feeCollectorDayData,
	pegasysClient,
	PAIR_DATA,
} from "apollo";

import { ContractFramework } from "../frameworks";
import { BIG_INT_ZERO, PegasysTokens } from "../constants";
import {
	IStakeV2ServicesClaim,
	IStakeV2ServicesStake,
	IStakeV2ServicesUnstake,
	IStakeV2ServicesGetStakeOpportunities,
	IStakeV2Info,
	IStakeV2ServicesGetUnstake,
	IStakeV2ServicesGetUnclaimed,
} from "../dto";
import PairServices from "./pair";

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

				const { psysStaked, psysStakedUSD, users, depositFee } =
					stakeQuery.data.pegasysStaking;

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
						? JSBI.BigInt(
								(Number(users[0].psysStaked) < 0.00000001
									? 0
									: Number(users[0].psysStaked)) * decimalsMultiplier
						  )
						: BIG_INT_ZERO
				);

				const sumDepositFeePSYS = (
					stakeQuery.data.pegasysStakingDayDatas ?? []
				).reduce(
					(acc: number, curr: { depositFeePSYS: string }) =>
						acc + Number(curr.depositFeePSYS),
					0
				);

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

				const apr = Math.floor(
					((sumTokenRemitted + sumDepositFeePSYS) * 1200) / Number(psysStaked)
				);

				const tokens = PegasysTokens[chainId ?? ChainId.NEVM];

				const psys = tokens.PSYS;
				const usdc = tokens.USDC;

				const pairAddr = await PairServices.getPairAddress([psys, usdc]);

				const res = await pegasysClient.query({
					query: PAIR_DATA(pairAddr.toLocaleLowerCase()),
					fetchPolicy: "network-only",
				});

				const price = Number(res?.data.pairs[0]?.token0Price ?? "0");

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
					stakedInUsd: users.length ? Number(users[0].psysStakedUSD) : 0,
					apr: JSBI.BigInt(apr),
					unclaimedInUsd: Number(unclaimedAmount.toSignificant()) * price,
					depositFee: Number(depositFee) * 100,
					rewardRate: new TokenAmount(rewardToken, BIG_INT_ZERO),
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
		signatureData,
	}: IStakeV2ServicesStake) {
		let txHash = "";
		const contract =
			stakeContract ?? ContractFramework.StakeV2Contract({ chainId, provider });

		const res = await ContractFramework.call({
			methodName: "depositWithPermit",
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
		chainId,
		provider,
		stakeContract,
	}: IStakeV2ServicesClaim) {
		let txHash = "";
		const contract =
			stakeContract ?? ContractFramework.StakeV2Contract({ chainId, provider });

		const res = await ContractFramework.call({
			methodName: "deposit",
			contract,
			args: [`0x${BIG_INT_ZERO.toString(16)}`],
		});

		txHash = `${res?.hash}`;

		return {
			hash: txHash,
			response: res ?? null,
		};
	}
}

export default StakeV2Services;
