import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { ConnectSyscoinNetwork } from "utils/ConnectSyscoinNetwork";

export const SwitchToSyscoin: FunctionComponent<ButtonProps> = props => {
	const theme = usePicasso();
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
			onClick={ConnectSyscoinNetwork}
			{...rest}
		>
			Switch to Syscoin Chain
		</Button>
	);
};
