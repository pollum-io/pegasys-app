import { ethers } from "ethers";
import { ChainId } from "@pollum-io/pegasys-sdk";
import { IContractDTO } from "./dto";

export const PegasysContracts: IContractDTO = {
	[ChainId.NEVM]: {
		ROUTER_ADDRESS: ethers.utils.getAddress(
			"0x017dAd2578372CAEE5c6CddfE35eEDB3728544C4"
		),
		AIRDROP_ADDRESS: ethers.utils.getAddress(
			"0x5c0543fFB580b22574D52179cB3Eba7aeF1CE293"
		),
		MINICHEF_ADDRESS: ethers.utils.getAddress(
			"0x27F037100118548c63F945e284956073D1DC76dE"
		),
		STAKE_ADDRESS: ethers.utils.getAddress(
			"0xE038E38B48F4123e1408865450E37edC78b736ED"
		),
		GOVERNANCE_ADDRESS: ethers.utils.getAddress(
			"0x633Bdeb5D4b5f93933833A692e230a7d48fC2d77"
		),
	},
	[ChainId.TANENBAUM]: {
		ROUTER_ADDRESS: ethers.utils.getAddress(
			"0xE18c200A70908c89fFA18C628fE1B83aC0065EA4"
		),
		AIRDROP_ADDRESS: ethers.utils.getAddress(
			"0x0000000000000000000000000000000000000000"
		),
	},
	[ChainId.ROLLUX]: {
		ROUTER_ADDRESS: ethers.utils.getAddress(
			"0x734D8ed3eF0a9F7474bE75252182a6e4ea3B1fEB"
		),
		AIRDROP_ADDRESS: ethers.utils.getAddress(
			"0x0000000000000000000000000000000000000000"
		),
		MINICHEF_ADDRESS: ethers.utils.getAddress(
			"0xe9b63e87AF5Bc0CD3f909033a014594d100AAF76"
		),
	},
};
