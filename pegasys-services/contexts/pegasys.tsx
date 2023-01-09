import React, { createContext, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";

import { PersistentFramework } from "pegasys-services/frameworks";
import {
	DEFAULT_DEADLINE_FROM_NOW,
	INITIAL_ALLOWED_SLIPPAGE,
} from "../constants";
import { WalletProvider } from "./wallet";
import { ToastyProvider } from "./toasty";
import { TransactionProvider } from "./transactions";
import { IPegasysProviderProps, children, IPegasysProviderValue } from "../dto";

export const PegasysContext = createContext({} as IPegasysProviderValue);

const Provider: React.FC<{ children: children }> = ({ children }) => {
	const [expert, setExpert] = useState<boolean>(false);
	const [userSlippageTolerance, setUserSlippageTolerance] = useState<number>(
		INITIAL_ALLOWED_SLIPPAGE
	);
	const [userTransactionDeadlineValue, setUserTransactionDeadlineValue] =
		useState<BigNumber | number>(DEFAULT_DEADLINE_FROM_NOW);

	const handleCacheExportMode = () => {
		PersistentFramework.add("expertMode", {
			isActivate: !expert,
		});
	};

	useEffect(() => {
		const value = PersistentFramework.get("expertMode") as { [k: string]: any };
		if (value?.isActivate) {
			setExpert(true);
			PersistentFramework.add("expertMode", { isActivate: true });
		} else {
			setExpert(false);
			PersistentFramework.add("expertMode", { isActivate: false });
		}
	}, []);

	const providerValue = useMemo(
		() => ({
			expert,
			setExpert,
			handleCacheExportMode,
			userTransactionDeadlineValue,
			setUserTransactionDeadlineValue,
			userSlippageTolerance,
			setUserSlippageTolerance,
		}),
		[
			expert,
			setExpert,
			handleCacheExportMode,
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
			<TransactionProvider>
				<Provider>{children}</Provider>
			</TransactionProvider>
		</WalletProvider>
	</ToastyProvider>
);
