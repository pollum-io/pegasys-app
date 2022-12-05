import { useContext } from "react";

import { FarmContext } from "../contexts";

const useFarm = () => {
	const context = useContext(FarmContext);
	return context;
};

export default useFarm;
