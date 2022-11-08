import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { ConnectSyscoinNetwork } from "utils/connector/ConnectSyscoinNetwork";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWallet } from "pegasys-services";

export const SwitchToSyscoin: FunctionComponent<ButtonProps> = props => {
	const theme = usePicasso();
	const { connectorSelected, setWalletError, chainId } = useWallet();
	const { ...rest } = props;

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
			Switch to Syscoin Chain
		</Button>
	);
};
