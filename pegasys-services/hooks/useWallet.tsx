import { useContext } from "react";

import { WalletContext } from "../contexts";

const useWallet = () => {
	const context = useContext(WalletContext);
	return context;
};

export default useWallet;
