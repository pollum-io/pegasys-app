import { useContext } from "react";

import { PegasysContext } from "../contexts";

const usePegasys = () => {
	const context = useContext(PegasysContext);

	return context;
};

export default usePegasys;
