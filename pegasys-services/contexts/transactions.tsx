import React, { createContext, useMemo } from "react";

import { ITransactionProviderValue, ITransactionProviderProps } from "../dto";

export const TransactionContext = createContext(
	{} as ITransactionProviderValue
);

export const TransactionProvider: React.FC<ITransactionProviderProps> = ({
	children,
}) => {
	const providerValue = useMemo(() => ({}), []);

	return (
		<TransactionContext.Provider value={providerValue}>
			{children}
		</TransactionContext.Provider>
	);
};
