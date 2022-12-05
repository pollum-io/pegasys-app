import { useContext } from "react";

import { ToastyContext } from "../contexts";

const useToasty = () => {
	const context = useContext(ToastyContext);
	return context;
};

export default useToasty;
