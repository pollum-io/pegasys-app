import { WalletContext } from 'contexts';
import { useContext } from 'react';

export function useWallet() {
	return useContext(WalletContext);
}
