import { useContext } from "react";

import { StakeV2Context } from "../contexts";

const useStake = () => {
	const context = useContext(StakeV2Context);
	return context;
};

export default useStake;
