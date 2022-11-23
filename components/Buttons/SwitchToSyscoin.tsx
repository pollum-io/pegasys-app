import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { ConnectSyscoinNetwork } from "utils/connector/ConnectSyscoinNetwork";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWallet } from "pegasys-services";
import { useTranslation } from "react-i18next";

export const SwitchToSyscoin: FunctionComponent<ButtonProps> = props => {
	const theme = usePicasso();
	const { connectorSelected, setWalletError, chainId } = useWallet();
	const { ...rest } = props;
	const { t: translation } = useTranslation();

	return (
		<Button
			py="2"
			px="20"
			borderRadius="full"
			fontSize="md"
			fontWeight="semibold"
			bgColor={theme.bg.blueNavyLightness}
			color={theme.text.cyan}
			_hover={{
				bgColor: theme.bg.bluePurple,
			}}
			onClick={() =>
				ConnectSyscoinNetwork(
					connectorSelected as AbstractConnector,
					setWalletError,
					chainId as number
				)
			}
			{...rest}
		>
			{translation("walletModal.switchSyscoin")}
		</Button>
	);
};
