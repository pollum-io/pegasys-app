import { Button, ButtonProps } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { usePicasso } from "hooks";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const SlippageButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();

	return (
		<Button
			color={theme.text.transactionsItems}
			w="max-content"
			h="max-content"
			py="0.5rem"
			px="0.5rem"
			borderRadius="full"
			fontSize="md"
			fontWeight="semibold"
			bgColor="transparent"
			_focus={{
				color: theme.text.mono,
				bgColor: theme.bg.slippage,
			}}
			_hover={{
				background: theme.bg.slippage,
				color: theme.text.mono,
			}}
			{...rest}
		>
			{children}
		</Button>
	);
};
