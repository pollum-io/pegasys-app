import { abi as REWARDERVIAMULTIPLIER_ABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/earn/RewarderViaMultiplier.sol/RewarderViaMultiplier.json";
import { ChainId, Pair, Token } from "@pollum-io/pegasys-sdk";
import { splitSignature } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { API, MINICHEF_ADDRESS } from "../constants";
import { ContractFramework, WalletFramework } from "../frameworks";

class LpTokenServices {
	static getLpContract() {
		const contract = ContractFramework.StakingContract(MINICHEF_ADDRESS);

		return contract;
	}

	static async getPoolMap(
		tokenAddresses?: string[]
	): Promise<{ [key: string]: number }> {
		const lpTokens = tokenAddresses ?? (await this.getLpTokens());

		const poolMap: { [key: string]: number } = {};

		if (lpTokens.length) {
			lpTokens.forEach((address: string, index: number) => {
				poolMap[address] = index;
			});
		}
		return poolMap;
	}

	static async getLpTokens(): Promise<string[]> {
		const contract = this.getLpContract();

		const lpTokens = await ContractFramework.call({
			contract,
			methodName: "lpTokens",
		});

		return lpTokens;
	}

	static async getBalance(lpAddress: string) {
		const contract = ContractFramework.TokenContract(lpAddress);

		const balance = await ContractFramework.call({
			contract,
			methodName: "balanceOf",
			args: [MINICHEF_ADDRESS],
		});

		return balance;
	}

	static getLpToken(tokenA: Token, tokenB: Token, chainId: number) {
		const lpToken = new Token(
			chainId,
			Pair.getAddress(tokenA, tokenB, chainId),
			18,
			"PLP",
			"Pegasys LP Token"
		);

		return lpToken;
	}

	static async getRewarder(poolId: number) {
		const contract = this.getLpContract();

		const rewarder = await ContractFramework.call({
			contract,
			methodName: "rewarder",
			args: [[poolId]],
		});

		return rewarder;
	}

	static async getAprs(
		poolId: number,
		isSuperFarm: boolean
	): Promise<{
		swapFeeApr: number;
		superFarmApr?: number;
		combinedApr: number;
	}> {
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
	}

	static async getUserStake(poolId: number, address: string) {
		const contract = this.getLpContract();

		const userInfo = await ContractFramework.call({
			contract,
			methodName: "userInfo",
			args: [[poolId], address],
		});

		const { amount } = userInfo as { amount: bigint };

		return amount;
	}

	static async getUserUnclaimedPSYS(poolId: number, address: string) {
		const contract = LpTokenServices.getLpContract();

		const unclaimedPSYS = await ContractFramework.call({
			contract,
			methodName: "pendingReward",
			args: [[poolId], address],
		});

		return unclaimedPSYS;
	}

	static async getAvailableLpTokens(lpAddress: string, address: string) {
		const contract = ContractFramework.TokenContract(lpAddress);

		const balance = await ContractFramework.call({
			contract,
			methodName: "balanceOf",
			args: [address],
		});

		return balance;
	}

	static async getTotalSupply(lpAddress: string) {
		const contract = ContractFramework.TokenContract(lpAddress);

		const totalSupply = await ContractFramework.call({
			contract,
			methodName: "totalSupply",
		});

		return totalSupply;
	}

	static async getTotalAllocPoint() {
		const contract = LpTokenServices.getLpContract();

		const totalAllocPoint = await ContractFramework.call({
			contract,
			methodName: "totalAllocPoint",
		});

		return totalAllocPoint;
	}

	static async getRewardPerSec() {
		const contract = LpTokenServices.getLpContract();

		const rewardPerSecond = await ContractFramework.call({
			contract,
			methodName: "rewardPerSecond",
		});

		return rewardPerSecond;
	}

	static async getAllocPoint(poolId: number) {
		const contract = LpTokenServices.getLpContract();

		const poolInfo = await ContractFramework.call({
			contract,
			methodName: "poolInfo",
			args: [[poolId]],
		});

		const { allocPoint } = poolInfo as { allocPoint: bigint };

		return allocPoint;
	}

	static async getRewardMultiplier(address: string) {
		const contract = ContractFramework.getContract({
			abi: REWARDERVIAMULTIPLIER_ABI,
			address,
		});

		const multiplier: bigint[] = await ContractFramework.call({
			contract,
			methodName: "getRewardMultipliers",
		});

		return multiplier.length ? multiplier[0] : BigInt(0);
	}

	static async getDollarValue() {}

	static async getSignature({
		lpAddress,
		address,
		chainId,
		spender,
		value,
		deadline,
	}: {
		lpAddress: string;
		address: string;
		chainId: ChainId;
		spender: string;
		value: string;
		deadline: BigNumber;
	}) {
		const contract = ContractFramework.PairContract(lpAddress);

		const nonce = await ContractFramework.call({
			contract,
			methodName: "nonces",
			args: [address],
		});

		const EIP712Domain = [
			{ name: "name", type: "string" },
			{ name: "version", type: "string" },
			{ name: "chainId", type: "uint256" },
			{ name: "verifyingContract", type: "address" },
		];

		const domain = {
			name: "Pegasys LP Token",
			version: "1",
			chainId,
			verifyingContract: lpAddress,
		};

		const Permit = [
			{ name: "owner", type: "address" },
			{ name: "spender", type: "address" },
			{ name: "value", type: "uint256" },
			{ name: "nonce", type: "uint256" },
			{ name: "deadline", type: "uint256" },
		];

		const message = {
			owner: address,
			spender,
			value,
			nonce: nonce.toHexString(),
			deadline: deadline.toNumber(),
		};

		const data = JSON.stringify({
			types: {
				EIP712Domain,
				Permit,
			},
			domain,
			primaryType: "Permit",
			message,
		});

		const provider = WalletFramework.getProvider();

		const signatureRes = await provider?.send("eth_signTypedData_v4", [
			address,
			data,
		]);

		const signature = splitSignature(signatureRes);

		return {
			v: signature.v,
			r: signature.r,
			s: signature.s,
			deadline: deadline.toNumber(),
		};
	}
}

export default LpTokenServices;
