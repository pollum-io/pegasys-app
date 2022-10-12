import { ChainId, Pair, Price, Token, WSYS } from "@pollum-io/pegasys-sdk";
import { BIG_INT_ZERO, USDC } from "pegasys-services/constants";
import { TContract } from "pegasys-services/dto";
import { ContractFramework } from "pegasys-services/frameworks";

class TokenServices {
	static async getTokenName({
		address,
		contract,
	}: {
		address?: string;
		contract?: TContract;
	}): Promise<string> {
		const c = contract ?? ContractFramework.TokenContract(address ?? "");

		const name = await ContractFramework.call({
			contract: c,
			methodName: "name",
		});

		return name ?? "";
	}

	static async getTokenSymbol({
		address,
		contract,
	}: {
		address?: string;
		contract?: TContract;
	}): Promise<string> {
		const c = contract ?? ContractFramework.TokenContract(address ?? "");

		const symbol = await ContractFramework.call({
			contract: c,
			methodName: "symbol",
		});

		return symbol ?? "";
	}

	static async getTokenDecimals({
		address,
		contract,
	}: {
		address?: string;
		contract?: TContract;
	}): Promise<number> {
		const c = contract ?? ContractFramework.TokenContract(address ?? "");

		const decimals = await ContractFramework.call({
			contract: c,
			methodName: "decimals",
		});

		return Number(decimals) ?? 18;
	}

	static async getToken(address: string, chainId?: ChainId) {
		const contract = ContractFramework.TokenContract(address);

		const name = await this.getTokenName({ contract });
		const symbol = await this.getTokenSymbol({ contract });
		const decimals = await this.getTokenDecimals({ contract });

		return new Token(chainId ?? ChainId.NEVM, address, decimals, symbol, name);
	}

	static async getUsdPrice(token: token, chainId?: ChainId) {
		const wsys = WSYS[chainId ?? ChainId.NEVM];
		const usdc = USDC[chainId ?? ChainId.NEVM];

		const price = rewardTokenWsysPair?.priceOf(wsys);

		const usdPrice = new Price(
			wsys,
			usdc,
			price?.denominator ?? BIG_INT_ZERO,
			price?.numerator ?? BIG_INT_ZERO
		);

		return usdPrice;
	}
}

export default TokenServices;
