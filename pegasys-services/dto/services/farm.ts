import { IEarnInfo } from "../contexts";

export interface IFarmInfo extends IEarnInfo {
	swapFeeApr: number;
	superFarmApr?: number;
	combinedApr: number;
	poolId: number;
}
