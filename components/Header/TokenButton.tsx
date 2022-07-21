import { Text } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps {
	children?: ReactNode;
}

export const TokenButton: FunctionComponent<IButtonProps> = props => {
	const { children } = props;
	const theme = usePicasso();
	const token = "PSYS";

	return (
		<Text
			h="max-content"
			bg={theme.text.psysBalance}
			bgClip="text"
			fontWeight="normal"
			fontSize="md"
			transition="0.2s"
			_hover={{ cursor: "pointer", fontWeight: "700" }}
			_active={{}}
		>
			{children}
			{token}
		</Text>
	);
};
