import { useContext } from "react";

import { PegasysContext } from "../contexts";
import { IPegasysProviderValue } from "../dto";

const usePegasys = (): IPegasysProviderValue => {
	const context = useContext<IPegasysProviderValue>(PegasysContext);
	return context;
};

export default usePegasys;
