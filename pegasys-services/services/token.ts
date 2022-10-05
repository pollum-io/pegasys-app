import { MaxUint256 } from "@ethersproject/constants";
import { ChainId, Currency, currencyEquals, JSBI, NSYS, Price, TokenAmount, WSYS } from "@pollum-io/pegasys-sdk";
import { ApprovalState } from "hooks";
import { ContractFramework } from "pegasys-services/frameworks";
import { wrappedCurrency } from "utils";
import { BIG_INT_ZERO, DAI, USDC } from "../constants";

class TokenServices {
	static async usdcPrice(currency: Currency, chainId?: ChainId) {
		let totalStakedInUsd = new TokenAmount(
			DAI[chainId ?? ChainId.NEVM],
			BIG_INT_ZERO
		);

		if (JSBI.equal(totalSupplyAvailable, BIG_INT_ZERO)) {
			// Default to 0 values above avoiding division by zero errors
		} else if (pair.involvesToken(DAI[chainId])) {
			const pairValueInDAI = JSBI.multiply(
				pair.reserveOf(DAI[chainId]).raw,
				BIG_INT_TWO
			);
			const stakedValueInDAI = JSBI.divide(
				JSBI.multiply(pairValueInDAI, totalSupplyStaked),
				totalSupplyAvailable
			);
			totalStakedInUsd = new TokenAmount(DAI[chainId], stakedValueInDAI);
		} else if (pair.involvesToken(USDC[chainId])) {
			const pairValueInUSDC = JSBI.multiply(
				pair.reserveOf(USDC[chainId]).raw,
				BIG_INT_TWO
			);
			const stakedValueInUSDC = JSBI.divide(
				JSBI.multiply(pairValueInUSDC, totalSupplyStaked),
				totalSupplyAvailable
			);
			totalStakedInUsd = new TokenAmount(USDC[chainId], stakedValueInUSDC);
		} else if (pair.involvesToken(USDT[chainId])) {
			const pairValueInUSDT = JSBI.multiply(
				pair.reserveOf(USDT[chainId]).raw,
				BIG_INT_TWO
			);
			const stakedValueInUSDT = JSBI.divide(
				JSBI.multiply(pairValueInUSDT, totalSupplyStaked),
				totalSupplyAvailable
			);
			totalStakedInUsd = new TokenAmount(USDT[chainId], stakedValueInUSDT);
		} else if (isSysPool) {
			const totalStakedInWsys = calculateTotalStakedAmountInSys(
				totalSupplyStaked,
				totalSupplyAvailable,
				pair.reserveOf(WSYS[chainId]).raw
			);
			totalStakedInUsd =
				totalStakedInWsys &&
				(usdPrice?.quote(totalStakedInWsys) as TokenAmount);
		} else if (isPsysPool) {
			const totalStakedInWsys = calculateTotalStakedAmountInSysFromPsys(
				totalSupplyStaked,
				totalSupplyAvailable,
				sysPsysPair.reserveOf(psys).raw,
				sysPsysPair.reserveOf(WSYS[chainId]).raw,
				pair.reserveOf(psys).raw
			);
			totalStakedInUsd =
				totalStakedInWsys &&
				(usdPrice?.quote(totalStakedInWsys) as TokenAmount);
		} else {
			// Contains no stablecoin, WSYS, nor PSYS
			console.error(
				`Could not identify total staked value for pair ${pair.liquidityToken.address}`
			);
		}
	}

	static async usdPrice(currency: Currency, chainId?: ChainId) {
		const wrapped = wrappedCurrency(currency, chainId ?? ChainId.NEVM)
		const usdc = USDC[chainId ?? ChainId.NEVM]

		const tokenPairs = [
			[
				chainId && wrapped && currencyEquals(WSYS[chainId], wrapped) ? undefined : currency,
				chainId ? WSYS[chainId] : undefined
			],
			[wrapped?.equals(usdc) ? undefined : wrapped, chainId === ChainId.NEVM ? usdc : undefined],
			[chainId ? WSYS[chainId] : undefined, chainId === ChainId.NEVM ? usdc : undefined]
		]

		const [[sysPairState, sysPair], [usdcPairState, usdcPair], [usdcSysPairState, usdcSysPair]] = usePairs(tokenPairs)

		return useMemo(() => {
			if (!currency || !wrapped || !chainId) {
				return undefined
			}
			// handle wsys/sys
			if (wrapped.equals(WSYS[chainId])) {
				if (usdcPair) {
					const price = usdcPair.priceOf(WSYS[chainId])
					return new Price(currency, USDC, price.denominator, price.numerator)
				} else {
					return undefined
				}
			}
			// handle usdc
			if (wrapped.equals(usdc)) {
				return new Price(usdc, usdc, '1', '1')
			}

			const sysPairSYSAmount = sysPair?.reserveOf(WSYS[chainId])
			const sysPairSYSUSDCValue: JSBI =
				sysPairSYSAmount && usdcSysPair
					? usdcSysPair.priceOf(WSYS[chainId]).quote(sysPairSYSAmount).raw
					: JSBI.BigInt(0)

			// all other tokens
			// first try the usdc pair
			if (usdcPairState === PairState.EXISTS && usdcPair && usdcPair.reserveOf(USDC).greaterThan(sysPairSYSUSDCValue)) {
				const price = usdcPair.priceOf(wrapped)
				return new Price(currency, USDC, price.denominator, price.numerator)
			}
			if (sysPairState === PairState.EXISTS && sysPair && usdcSysPairState === PairState.EXISTS && usdcSysPair) {
				if (usdcSysPair.reserveOf(USDC).greaterThan('0') && sysPair.reserveOf(WSYS[chainId]).greaterThan('0')) {
					const sysUsdcPrice = usdcSysPair.priceOf(USDC)
					const currencySysPrice = sysPair.priceOf(WSYS[chainId])
					const usdcPrice = sysUsdcPrice.multiply(currencySysPrice).invert()
					return new Price(currency, USDC, usdcPrice.denominator, usdcPrice.numerator)
				}
			}
			return undefined
		}
	}
}

export default TokenServices;
