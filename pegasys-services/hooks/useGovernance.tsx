import { useContext } from "react";

import { GovernanceContext } from "../contexts";

const useGovernance = () => {
	const context = useContext(GovernanceContext);
	return context;
};

export default useGovernance;
