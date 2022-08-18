import { Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";

interface IButtonProps {
	children?: ReactNode;
}

export const NetworkButton: FunctionComponent<IButtonProps> = props => {
	const { children } = props;
	const connectedNetwork = "NEVM";
	const theme = usePicasso();

	return (
		<Text
			h="max-content"
			bg={theme.text.navItem}
			bgClip="text"
			fontWeight="normal"
			fontSize="md"
			transition="0.2s"
			_hover={{}}
			_active={{}}
		>
			{children}
			{connectedNetwork}
		</Text>
	);
};
