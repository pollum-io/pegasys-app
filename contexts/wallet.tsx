import React, { createContext, useState, useMemo } from "react";

interface IWeb3 {
	otherWallet: boolean;
	setOtherWallet: React.Dispatch<React.SetStateAction<boolean>>;
	setCurrentLpAddress: React.Dispatch<React.SetStateAction<string>>;
	currentLpAddress: string;
}

export const WalletContext = createContext({} as IWeb3);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [otherWallet, setOtherWallet] = useState<boolean>(false);
	const [currentLpAddress, setCurrentLpAddress] = useState<string>("");

	const providerValue = useMemo(
		() => ({
			otherWallet,
			setOtherWallet,
			currentLpAddress,
			setCurrentLpAddress,
		}),
		[otherWallet, setOtherWallet, currentLpAddress, setCurrentLpAddress]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
