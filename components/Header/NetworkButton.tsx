import { Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps {
	children?: ReactNode;
}

export const NetworkButton: FunctionComponent<IButtonProps> = props => {
	const { children } = props;
	const connectedNetwork = "NEVM";
	return (
		<Text
			h="max-content"
			bg="white"
			bgClip="text"
			fontWeight="normal"
			fontSize="md"
			transition="0.2s"
			_hover={{ cursor: "pointer" }}
			_active={{}}
		>
			{children}
			{connectedNetwork}
		</Text>
	);
};
