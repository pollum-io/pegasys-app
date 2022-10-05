import { TokenAmount } from "@pollum-io/pegasys-sdk";
import { children, setType } from "../react";
import { IFarmInfo } from "../services";

export interface IFarmProviderProps {
	children: children;
}

export type TFarmSort = "apr" | "poolWeight";

export interface IFarmProviderValue {
	sort: TFarmSort;
	setSort: setType<TFarmSort>;
	search: string;
	setSearch: setType<string>;
	pairs: IFarmInfo[];
	selectedPair?: IFarmInfo;
	setSelectedPair: setType<IFarmInfo | undefined>;
	withdrawnTypedValue: string;
	setWithdrawnTypedValue: (newValue: string) => void;
	depositTypedValue: string;
	setDepositTypedValue: (newValue: string) => void;
	onClaim: () => Promise<void>;
	onWithdraw: () => Promise<void>;
	onDeposit: () => Promise<void>;
	liveRewardWeek?: TokenAmount;
	buttonId: string;
	setButtonId: setType<string>;
}
