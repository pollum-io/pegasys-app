import React, { createContext, useMemo, useState } from "react";

import { ITransactionProviderValue, ITransactionProviderProps } from "../dto";

export const TransactionContext = createContext(
	{} as ITransactionProviderValue
);

export const TransactionProvider: React.FC<ITransactionProviderProps> = ({
	children,
}) => {
	const [transactions, setTransactions] = useState<any[]>([]);

	const providerValue = useMemo(
		() => ({
			transactions,
		}),
		[transactions]
	);

	return (
		<TransactionContext.Provider value={providerValue}>
			{children}
		</TransactionContext.Provider>
	);
};
