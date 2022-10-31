import React, { createContext, useMemo, useState } from "react";
import { BigNumber } from "ethers";

import {
	DEFAULT_DEADLINE_FROM_NOW,
	INITIAL_ALLOWED_SLIPPAGE,
} from "../constants";
import { WalletProvider } from "./wallet";
import { ToastyProvider } from "./toasty";
import { IPegasysProviderProps, children, IPegasysProviderValue } from "../dto";

export const PegasysContext = createContext({} as IPegasysProviderValue);

const Provider: React.FC<{ children: children }> = ({ children }) => {
	const [expert, setExpert] = useState<boolean>(false);
	const [userSlippageTolerance, setUserSlippageTolerance] = useState<number>(
		INITIAL_ALLOWED_SLIPPAGE
	);
	const [userTransactionDeadlineValue, setUserTransactionDeadlineValue] =
		useState<BigNumber | number>(DEFAULT_DEADLINE_FROM_NOW);

	const providerValue = useMemo(
		() => ({
			expert,
			setExpert,
			userTransactionDeadlineValue,
			setUserTransactionDeadlineValue,
			userSlippageTolerance,
			setUserSlippageTolerance,
		}),
		[
			expert,
			setExpert,
			userTransactionDeadlineValue,
			setUserTransactionDeadlineValue,
			userSlippageTolerance,
			setUserSlippageTolerance,
		]
	);

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
