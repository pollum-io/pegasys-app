import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const NetworkButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();
	const connectedNetwork = "NEVM";
	return (
		<Button
			bg="white"
			bgClip="text"
			fontWeight="500"
			fontSize="md"
			_hover={{ opacity: 1 }}
			_active={{}}
			w="max-content"
			h="max-content"
			py="4"
			pr="10"
			{...rest}
		>
			{children}
			{connectedNetwork}
		</Button>
	);
};
