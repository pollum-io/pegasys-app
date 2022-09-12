import { useContext } from "react";

import { PegasysContext } from "../contexts";
// import { IPegasysProviderValue } from "../dto";

const usePegasys = (): any => {
	const context = useContext<any>(PegasysContext);
	return context;
};

export default usePegasys;
