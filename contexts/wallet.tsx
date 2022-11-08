import React, { createContext, useState, useMemo } from "react";

interface IWeb3 {
	connecting: boolean;
	setConnecting: React.Dispatch<React.SetStateAction<boolean>>;
	otherWallet: boolean;
	setOtherWallet: React.Dispatch<React.SetStateAction<boolean>>;
	setCurrentLpAddress: React.Dispatch<React.SetStateAction<string>>;
	currentLpAddress: string;
}

export const WalletContext = createContext({} as IWeb3);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [connecting, setConnecting] = useState<boolean>(false);
	const [otherWallet, setOtherWallet] = useState<boolean>(false);
	const [currentLpAddress, setCurrentLpAddress] = useState<string>("");

	const providerValue = useMemo(
		() => ({
			connecting,
			setConnecting,
			otherWallet,
			setOtherWallet,
			currentLpAddress,
			setCurrentLpAddress,
		}),
		[
			connecting,
			setConnecting,
			otherWallet,
			setOtherWallet,
			currentLpAddress,
			setCurrentLpAddress,
		]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
