import { children, setType } from "../react";
import { IFarmInfo } from "../services";

export interface IFarmProviderProps {
	children: children;
}

export type TFarmSort = "apr" | "liquidity" | "yours";

export interface IFarmProviderValue {
	sort: TFarmSort;
	setSort: setType<TFarmSort>;
	search: string;
	setSearch: setType<string>;
	sortedPairs: IFarmInfo[];
	claim: () => Promise<void>;
	sign: () => Promise<void>;
	deposit: () => Promise<void>;
	withdraw: () => Promise<void>;
}
