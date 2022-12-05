import { Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";
import { useWallet } from "pegasys-services";

interface IButtonProps {
	children?: ReactNode;
}

export const NetworkButton: FunctionComponent<IButtonProps> = props => {
	const { children } = props;
	const { chainId, isConnected } = useWallet();
	const theme = usePicasso();
	const networksLabel: { [k: number]: string } = {
		57: "NEVM",
		5700: "TANENBAUM",
		2814: "ROLLUX",
	};

	return (
		<Text
			h="max-content"
			bg={theme.icon.nightGray}
			bgClip="text"
			fontWeight="normal"
			fontSize="md"
			transition="0.2s"
			_hover={{}}
			_active={{}}
		>
			{children}
			{isConnected
				? networksLabel[chainId as number]
					? networksLabel[chainId as number]
					: "-"
				: "NEVM"}
		</Text>
	);
};
