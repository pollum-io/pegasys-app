import { useContext } from "react";

import { EarnContext } from "../contexts";

const useEarn = () => {
	const context = useContext(EarnContext);
	return context;
};

export default useEarn;
