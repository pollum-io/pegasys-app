import { Percent, JSBI } from "@pollum-io/pegasys-sdk";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;

// 60 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 60;

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

// Helper consts for Trade price calculation
const BASE_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000));
export const ONE_HUNDRED_PERCENT = new Percent(
	JSBI.BigInt(10000),
	JSBI.BigInt(10000)
);
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE);

// 1%
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
	JSBI.BigInt(100),
	BIPS_BASE
);

// 3%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
	JSBI.BigInt(300),
	BIPS_BASE
);

// 5%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
	JSBI.BigInt(500),
	BIPS_BASE
);

// 15%
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
	JSBI.BigInt(1500),
	BIPS_BASE
);

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(
	JSBI.BigInt(10),
	JSBI.BigInt(16)
); // .01 ETH
