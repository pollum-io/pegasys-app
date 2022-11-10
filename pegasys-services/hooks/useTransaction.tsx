import { useContext } from "react";

import { TransactionContext } from "../contexts";

const useTransaction = () => {
	const context = useContext(TransactionContext);
	return context;
};

export default useTransaction;
