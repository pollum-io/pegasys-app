import { useContext } from "react";

import { ToastyContext } from "../contexts";
import { IToastyProviderValue } from "../dto";

const useToasty = (): IToastyProviderValue => {
	const context = useContext<IToastyProviderValue>(ToastyContext);
	return context;
};

export default useToasty;
