import { SwapParameters } from "@pollum-io/pegasys-sdk";
import { Contract } from "ethers";

export interface ISwapCall {
	contract: Contract;
	parameters: SwapParameters;
}
