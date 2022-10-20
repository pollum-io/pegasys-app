import { children, setType } from "../react";
import { IEarnInfo } from "./earn";

export interface IFarmProviderProps {
	children: children;
}

export type TFarmSort = "apr" | "liquidity" | "yours";

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
