import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const TokenButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();
	const token = "PSYS";

	return (
		<Button
			borderRadius={12}
			bg={theme.text.psysBalance}
			bgClip="text"
			opacity="0.90"
			fontSize="md"
			_hover={{ opacity: 1 }}
			_active={{}}
			w="max-content"
			h="max-content"
			py="4"
			pr="2"
			{...rest}
		>
			{children}
			{token}
		</Button>
	);
};
