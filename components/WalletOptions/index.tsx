import { ButtonProps, Flex, Text } from "@chakra-ui/react";
import { SUPPORTED_WALLETS } from "helpers/consts";
import { FunctionComponent } from "react";
import { isMobile } from "react-device-detect";
import { useWallet } from "hooks";
import { injected } from "utils/connectors";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { IWalletInfo } from "types/index";
import { Wallets } from "./Wallets";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

export const WalletOptions: FunctionComponent<ButtonProps> = () => {
	const { connectWallet, setConnectorSelected, connectorSelected, connecting } =
		useWallet();

	const setConnectorValues = (connectorOptionsSelected: IWalletInfo) => {
		const { connector } = connectorOptionsSelected;

		connectWallet(connector as AbstractConnector);
		setConnectorSelected(connectorOptionsSelected);
	};

	const listWallets = () =>
		Object.keys(SUPPORTED_WALLETS).map(key => {
			const isMetamask = window.ethereum && window.ethereum.isMetaMask;
			const option = SUPPORTED_WALLETS[key];
			// check for mobile options
			if (!window.web3 && !window.ethereum) {
				return (
					<Wallets
						onClick={() =>
							option.connector !== injected &&
							!option.href &&
							option.connector &&
							setConnectorValues(option)
						}
						id={`connect-${key}`}
						key={key}
						header={option.name}
						icon={`icons/${option.iconName}`}
					/>
				);
			}

			// overwrite injected when needed
			if (option.connector === injected) {
				// don't show injected if there's no injected provider
				if (!(window.web3 || window.ethereum)) {
					if (option.name === "MetaMask") {
						return (
							<Wallets
								id={`connect-${key}`}
								key={key}
								header="Install Metamask"
								// href="https://metamask.io/"
								icon="/icons/metamask.png"
							/>
						);
					}
					return null; // dont want to return install twice
				}
				// don't return metamask if injected provider isn't metamask
				if (option.name === "MetaMask" && !isMetamask) {
					return null;
				}
				// likewise for generic
				if (option.name === "Injected" && isMetamask) {
					return null;
				}
			}
			// return rest of options
			return (
				<Wallets
					id={`connect-${key}`}
					onClick={() => {
						if (option.connector) setConnectorValues(option);
					}}
					key={key}
					// href={option.href || "/"}
					header={option.name}
					icon={`icons/${option.iconName}`}
				/>
			);
		});

	return <>{listWallets()}</>;
};
