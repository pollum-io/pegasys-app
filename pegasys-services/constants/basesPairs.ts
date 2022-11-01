import { ChainId } from "@pollum-io/pegasys-sdk";
import { IBasePairsDTO, ICustomBasePairDTO } from "./dto";
import { PegasysTokens } from "./tokens";

export const BASES_TO_CHECK_TRADES_AGAINST: IBasePairsDTO = {
	[ChainId.TANENBAUM]: [PegasysTokens[5700].WSYS, PegasysTokens[5700].PSYS],
	[ChainId.NEVM]: [
		PegasysTokens[57].WSYS,
		PegasysTokens[57].PSYS,
		PegasysTokens[57].USDT,
		PegasysTokens[57].DAI,
		PegasysTokens[57].USDC,
	],
	[ChainId.ROLLUX]: [PegasysTokens[2814].WSYS, PegasysTokens[2814].PSYS],
};

const WSYS_AND_PSYS_ONLY: IBasePairsDTO = {
	[ChainId.TANENBAUM]: [PegasysTokens[5700].WSYS, PegasysTokens[5700].PSYS],
	[ChainId.NEVM]: [PegasysTokens[57].WSYS, PegasysTokens[57].PSYS],
	[ChainId.ROLLUX]: [PegasysTokens[2814].WSYS, PegasysTokens[2814].PSYS],
};

export const BASES_TO_TRACK_LIQUIDITY_FOR: IBasePairsDTO = {
	...WSYS_AND_PSYS_ONLY,
};

export const CUSTOM_BASES_PAIRS: ICustomBasePairDTO = {
	[ChainId.NEVM]: {},
	[ChainId.TANENBAUM]: {},
	[ChainId.ROLLUX]: {},
};
