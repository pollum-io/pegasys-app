import { Text } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps {
	children?: ReactNode;
}

export const NetworkButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();
	const connectedNetwork = "NEVM";
	return (
		<Text
			h="max-content"
			bg="white"
			bgClip="text"
			fontWeight="normal"
			fontSize="md"
			transition="0.2s"
			_hover={{ cursor: "pointer", fontWeight: "700" }}
			_active={{}}
		>
			{children}
			{connectedNetwork}
		</Text>
	);
};
