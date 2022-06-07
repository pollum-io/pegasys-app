import { ButtonProps } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { SUPPORTED_WALLETS } from 'helpers/consts';
import { FunctionComponent, ReactNode } from 'react';
import { Wallets } from './Wallets';
import { injected } from '../../utils/connectors';
import { isMobile } from 'react-device-detect';
import { useWallet } from 'hooks';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	active?: boolean;
}

export const WalletOptions: FunctionComponent<IButtonProps> = props => {
	const { connector } = useWeb3React();
	const { connectWallet } = useWallet();

	const listWallets = () => {
		return Object.keys(SUPPORTED_WALLETS).map((key, index) => {
			const isMetamask = window.ethereum && window.ethereum.isMetaMask;
			const option = SUPPORTED_WALLETS[key];
			// check for mobile options
			if (isMobile) {
				if (!window.web3 && !window.ethereum && option.mobile) {
					return (
						<>
							<Wallets
								onClick={() => {
									option.connector !== connector &&
										!option.href &&
										connectWallet(option.connector);
								}}
								id={`connect-${key}`}
								key={key}
								header={option.name}
								icon={'icons/' + option.iconName}
							/>
						</>
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
								header={'Install Metamask'}
								link={'https://metamask.io/'}
								icon={'/icons/metamask.png'}
							/>
						);
					} else {
						return null; //dont want to return install twice
					}
				}
				// don't return metamask if injected provider isn't metamask
				else if (option.name === 'MetaMask' && !isMetamask) {
					return null;
				}
				// likewise for generic
				else if (option.name === 'Injected' && isMetamask) {
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
						link={option.href}
						header={option.name}
						icon={'icons/' + option.iconName}
					/>
				)
			);
		});
	};

	return <>{listWallets()}</>;
};
