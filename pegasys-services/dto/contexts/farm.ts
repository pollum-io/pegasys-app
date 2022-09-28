import { children, setType } from "../react";
import { IStakeInfo } from "../services";

export interface IFarmProviderProps {
	children: children;
}

export type TFarmSort = "apr" | "poolWeight";

export interface IFarmProviderValue {
	sort: TFarmSort;
	setSort: setType<TFarmSort>;
	search: string;
	setSearch: setType<string>;
	pairs: IStakeInfo[];
	selectedPair?: IStakeInfo;
	setSelectedPair: setType<IStakeInfo | undefined>;
	withdrawnTypedValue: string;
	setWithdrawnTypedValue: (newValue: string) => void;
	depositTypedValue: string;
	setDepositTypedValue: (newValue: string) => void;
	onClaim: () => Promise<void>;
	onWithdraw: () => Promise<void>;
	onDeposit: () => Promise<void>;
}
