import { useContext } from "react";

import { StakeContext } from "../contexts";

const useStake = () => {
	const context = useContext(StakeContext);
	return context;
};

export default useStake;
