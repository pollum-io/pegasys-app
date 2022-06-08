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
			color="white"
			borderRadius={12}
			bg={theme.bg.button.psysBalance}
			opacity="0.90"
			_hover={{ opacity: 1 }}
			_active={{}}
			w="max-content"
			h="max-content"
			py="2.5"
			px="2.5"
			{...rest}
		>
			{children}
			{token}
		</Button>
	);
};
