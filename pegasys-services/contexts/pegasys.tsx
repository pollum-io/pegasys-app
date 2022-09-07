import React, { createContext, useMemo } from "react";

import { WalletProvider } from "./wallet";
import { ToastyProvider } from "./toasty";
import { IPegasysProviderProps, IPegasysProviderValue, children } from "../dto";

export const PegasysContext = createContext({} as IPegasysProviderValue);

const Provider: React.FC<{ children: children }> = ({ children }) => {
	const providerValue = useMemo(() => ({}), []);

	return (
		<PegasysContext.Provider value={providerValue}>
			{children}
		</PegasysContext.Provider>
	);
};

export const PegasysProvider: React.FC<IPegasysProviderProps> = ({
	children,
	toasty,
}) => (
	<ToastyProvider {...toasty}>
		<WalletProvider>
			<Provider>{children}</Provider>
		</WalletProvider>
	</ToastyProvider>
);
