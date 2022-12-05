import { useContext } from "react";

import { SwapContext } from "../contexts";

const useSwap = () => {
	const context = useContext(SwapContext);
	return context;
};

export default useSwap;
