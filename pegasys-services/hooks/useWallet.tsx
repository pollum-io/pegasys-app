import { useContext } from "react";

import { WalletContext } from "../contexts";
import { IWalletProviderValue } from "../dto";

const useWallet = (): IWalletProviderValue => {
	const context = useContext<IWalletProviderValue>(WalletContext);
	return context;
};

export default useWallet;
