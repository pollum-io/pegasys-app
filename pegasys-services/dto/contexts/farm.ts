import { TokenAmount } from "@pollum-io/pegasys-sdk";
import { children, setType } from "../react";
import { IFarmInfo } from "../services";
import { IEarnInfo } from "./earn";

export interface IFarmProviderProps {
	children: children;
}

export type TFarmSort = "apr" | "poolWeight";

export interface IFarmProviderValue {
	sort: TFarmSort;
	setSort: setType<TFarmSort>;
	search: string;
	setSearch: setType<string>;
	sortedPairs: IEarnInfo[];
	claim: () => Promise<void>;
	sign: () => Promise<void>;
	deposit: () => Promise<void>;
	withdraw: () => Promise<void>;
}
