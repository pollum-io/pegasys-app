import { IChartComponentPeriod } from "types";

export interface IPeriodsMockedData extends IChartComponentPeriod {
	inputValue: string;
}

export interface ISlippageMockedValues {
	id: number;
	valueInBips: number;
}
