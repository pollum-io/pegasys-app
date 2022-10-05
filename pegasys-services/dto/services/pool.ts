import { Currency, CurrencyAmount, Pair, Token } from "@pollum-io/pegasys-sdk";
import { ApprovalState } from "contexts";

interface ICurrencyInfo {
	currency: Currency;
	value: string;
	independent?: boolean;
}

// export interface IPoolServicesGetCurrencyAmountProps extends ICurrencyInfo {
// 	noLiquidity?: boolean;
// }

export interface IPoolServicesGetCurrencyAmountsProps {
	a: ICurrencyInfo;
	b: ICurrencyInfo;
	noLiquidity?: boolean;
	pair: Pair;
}

export interface IPoolServicesApproveProps {
	amountToApprove?: CurrencyAmount;
	approvalState: ApprovalState;
}
