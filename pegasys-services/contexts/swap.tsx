import React, { createContext, useState, useMemo } from "react";

import { ISwapProviderProps, ISwapProviderValue } from "../dto";

export const SwapContext = createContext({} as ISwapProviderValue);

export const SwapProvider: React.FC<ISwapProviderProps> = ({ children }) => {
	const [currentInputTokenName, setCurrentInputTokenName] =
		useState<string>("");

	const providerValue = useMemo(
		() => ({
			currentInputTokenName,
			setCurrentInputTokenName,
		}),
		[currentInputTokenName, setCurrentInputTokenName]
	);

	return (
		<SwapContext.Provider value={providerValue}>
			{children}
		</SwapContext.Provider>
	);
};
