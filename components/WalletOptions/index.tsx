import { ButtonProps } from '@chakra-ui/react';
import { SUPPORTED_WALLETS } from 'helpers/consts';
import { FunctionComponent } from 'react';
import { isMobile } from 'react-device-detect';
import { useWallet } from 'hooks';
import { Wallets } from './Wallets';
import { injected } from '../../utils/connectors';

export const WalletOptions: FunctionComponent<ButtonProps> = () => {
	const { connectWallet, connector } = useWallet();

	const listWallets = () =>
		Object.keys(SUPPORTED_WALLETS).map(key => {
			const isMetamask = window.ethereum && window.ethereum.isMetaMask;
			const option = SUPPORTED_WALLETS[key];
			// check for mobile options
			if (isMobile) {
				if (!window.web3 && !window.ethereum && option.mobile) {
					return (
						<Wallets
							onClick={() =>
								option.connector !== connector &&
								!option.href &&
								connectWallet(option.connector)
							}
							id={`connect-${key}`}
							key={key}
							header={option.name}
							icon={`icons/${option.iconName}`}
						/>
					);
				}
				return null;
			}
			// overwrite injected when needed
			if (option.connector === injected) {
				// don't show injected if there's no injected provider
				if (!(window.web3 || window.ethereum)) {
					if (option.name === 'MetaMask') {
						return (
							<Wallets
								id={`connect-${key}`}
								key={key}
								header="Install Metamask"
								href="https://metamask.io/"
								icon="/icons/metamask.png"
							/>
						);
					}
					return null; // dont want to return install twice
				}
				// don't return metamask if injected provider isn't metamask
				if (option.name === 'MetaMask' && !isMetamask) {
					return null;
				}
				// likewise for generic
				if (option.name === 'Injected' && isMetamask) {
					return null;
				}
			}
			// return rest of options
			return (
				!isMobile &&
				!option.mobileOnly && (
					<Wallets
						id={`connect-${key}`}
						onClick={() => {
							connectWallet(option.connector);
						}}
						key={key}
						href={option.href || '/'}
						header={option.name}
						icon={`icons/${option.iconName}`}
					/>
				)
			);
		});

	return <>{listWallets()}</>;
};
