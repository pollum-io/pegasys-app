import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import { FunctionComponent } from "react";
import { ConnectSyscoinNetwork } from "utils/ConnectSyscoinNetwork";
import { AbstractConnector } from "@web3-react/abstract-connector";

export const SwitchToSyscoin: FunctionComponent<ButtonProps> = props => {
	const theme = usePicasso();
	const { connectorSelected, setWalletError } = useWallet();
	const { ...rest } = props;

	return (
		<Button
			py="8"
			px="20"
			borderRadius="12"
			fontSize="md"
			fontWeight={500}
			color={theme.text.whiteCyan}
			bgColor={theme.bg.button.switchNetwork}
			onClick={() =>
				ConnectSyscoinNetwork(
					connectorSelected as AbstractConnector,
					setWalletError
				)
			}
			{...rest}
		>
			Switch to Syscoin Chain
		</Button>
	);
};
