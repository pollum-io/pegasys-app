import { Currency, CurrencyAmount, Pair } from "@pollum-io/pegasys-sdk";
import { BigNumber } from "@ethersproject/bignumber";
import { WrappedTokenInfo } from "types";
import { ApprovalState } from "../contexts";

interface ICurrencyInfo {
	currency: Currency;
	value: string;
	independent?: boolean;
}

export interface IPoolServicesGetCurrencyAmountsProps {
	a: ICurrencyInfo;
	b: ICurrencyInfo;
	noLiquidity?: boolean;
	pair: Pair;
}

export interface IPoolServicesApproveProps {
	approvalState?: ApprovalState;
	amountToApprove?: CurrencyAmount;
}

export interface IPoolServicesCalculateSlippageAmountProps {
	value: CurrencyAmount;
	slippage: number;
}

export interface IPoolServicesAddLiquidityProps {
	tokens: [WrappedTokenInfo, WrappedTokenInfo];
	values: [string, string];
	haveValue?: boolean;
	pair: Pair | null;
	slippage: number;
	userDeadline: number | BigNumber;
}
