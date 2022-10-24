import {
	ChainId,
	Currency,
	currencyEquals,
	JSBI,
	Price,
	Token,
	WSYS,
} from "@pollum-io/pegasys-sdk";
import { USDC } from "pegasys-services/constants";
import {
	ITokenServicesGetToken,
	ITokenServicesGetTokenName,
	ITokenServicesGetTokenSymbol,
	ITokenServicesGetTokenDecimals,
	PairState,
} from "pegasys-services/dto";
import { ContractFramework } from "pegasys-services/frameworks";
import { wrappedCurrency } from "utils";
import PairServices from "./pair";

class TokenServices {
	static async getTokenName({
		contractAddress,
		provider,
		contract,
	}: ITokenServicesGetTokenName): Promise<string> {
		const c =
			contract ??
			ContractFramework.TokenContract({
				provider,
				address: contractAddress ?? "",
			});

		const name = await ContractFramework.call({
			contract: c,
			methodName: "name",
		});

		return name ?? "";
	}

	static async getTokenSymbol({
		contractAddress,
		provider,
		contract,
	}: ITokenServicesGetTokenSymbol): Promise<string> {
		const c =
			contract ??
			ContractFramework.TokenContract({
				provider,
				address: contractAddress ?? "",
			});

		const symbol = await ContractFramework.call({
			contract: c,
			methodName: "symbol",
		});

		return symbol ?? "";
	}

	static async getTokenDecimals({
		contractAddress,
		provider,
		contract,
	}: ITokenServicesGetTokenDecimals): Promise<number> {
		const c =
			contract ??
			ContractFramework.TokenContract({
				provider,
				address: contractAddress ?? "",
			});

		const decimals = await ContractFramework.call({
			contract: c,
			methodName: "decimals",
		});

		return Number(decimals) ?? 18;
	}

	static async getToken({
		contract,
		contractAddress,
		provider,
		chainId,
	}: ITokenServicesGetToken) {
		const c =
			contract ??
			ContractFramework.TokenContract({
				address: contractAddress,
				provider,
			});

		const name = await this.getTokenName({ contract: c });
		const symbol = await this.getTokenSymbol({ contract: c });
		const decimals = await this.getTokenDecimals({ contract: c });

		return new Token(
			chainId ?? ChainId.NEVM,
			contractAddress,
			decimals,
			symbol,
			name
		);
	}

	static async getUsdcPrice(currency: Currency, chainId?: ChainId) {
		const wrapped = wrappedCurrency(currency, chainId ?? ChainId.NEVM);
		const usdc = USDC[chainId ?? ChainId.NEVM];
		const wsys = WSYS[chainId ?? ChainId.NEVM];

		const tokenPairs: Array<[Token | undefined, Token | undefined]> = [
			[
				chainId && wrapped && currencyEquals(wsys, wrapped)
					? undefined
					: (currency as Token),
				chainId ? wsys : undefined,
			],
			[
				wrapped?.equals(usdc) ? undefined : wrapped,
				chainId === ChainId.NEVM ? usdc : undefined,
			],
			[chainId ? wsys : undefined, chainId === ChainId.NEVM ? usdc : undefined],
		];

		const [
			[sysPairState, sysPair],
			[usdcPairState, usdcPair],
			[usdcSysPairState, usdcSysPair],
		] = await PairServices.getPairs(tokenPairs, chainId);

		if (!currency || !wrapped || !chainId) {
			return undefined;
		}

		// handle wsys/sys
		if (wrapped.equals(wsys)) {
			if (usdcPair) {
				const price = usdcPair.priceOf(wsys);
				return new Price(currency, usdc, price.denominator, price.numerator);
			}
			return undefined;
		}

		// handle usdc
		if (wrapped.equals(usdc)) {
			return new Price(usdc, usdc, "1", "1");
		}

		const sysPairSYSAmount = sysPair?.reserveOf(wsys);
		const sysPairSYSUSDCValue: JSBI =
			sysPairSYSAmount && usdcSysPair
				? usdcSysPair.priceOf(wsys).quote(sysPairSYSAmount).raw
				: JSBI.BigInt(0);

		// all other tokens
		// first try the usdc pair
		if (
			usdcPairState === PairState.EXISTS &&
			usdcPair &&
			usdcPair.reserveOf(usdc).greaterThan(sysPairSYSUSDCValue)
		) {
			const price = usdcPair.priceOf(wrapped);
			return new Price(currency, usdc, price.denominator, price.numerator);
		}
		if (
			sysPairState === PairState.EXISTS &&
			sysPair &&
			usdcSysPairState === PairState.EXISTS &&
			usdcSysPair
		) {
			if (
				usdcSysPair.reserveOf(usdc).greaterThan("0") &&
				sysPair.reserveOf(wsys).greaterThan("0")
			) {
				const sysUsdcPrice = usdcSysPair.priceOf(usdc);
				const currencySysPrice = sysPair.priceOf(wsys);
				const usdcPrice = sysUsdcPrice.multiply(currencySysPrice).invert();
				return new Price(
					currency,
					usdc,
					usdcPrice.denominator,
					usdcPrice.numerator
				);
			}
		}
		return undefined;
	}
}

export default TokenServices;
