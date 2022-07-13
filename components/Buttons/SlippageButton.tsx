import { Button, ButtonProps } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const SlippageButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;

	return (
		<Button
			w="max-content"
			h="max-content"
			py="0.5rem"
			px="0.5rem"
			borderRadius="full"
			fontSize="md"
			fontWeight="semibold"
			bgColor="transparent"
			_active={{}}
			_hover={{ background: "rgba(21, 61, 111, 1)" }}
			{...rest}
		>
			{children}
		</Button>
	);
};
