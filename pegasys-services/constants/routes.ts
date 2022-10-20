import { ChainId } from "@pollum-io/pegasys-sdk";

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
	[ChainId.TANENBAUM]: "0xE18c200A70908c89fFA18C628fE1B83aC0065EA4",
	[ChainId.NEVM]: "0x017dAd2578372CAEE5c6CddfE35eEDB3728544C4",
	[ChainId.ROLLUX]: "0x734D8ed3eF0a9F7474bE75252182a6e4ea3B1fEB",
};
