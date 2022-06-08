import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const UserSysBalance: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();
	const { children, ...rest } = props;
	const isConnected = true;
	const sys = "SYS";
	return isConnected ? (
		<Button
			color="white"
			bg={theme.bg.button.sysBalance}
			borderRadius={12}
			border="1px solid"
			borderColor={theme.border.blueSys}
			opacity="0.9"
			_hover={{ opacity: 1 }}
			_active={{}}
			w="max-content"
			h="max-content"
			py="2"
			px="2.5"
			overflow="clip"
			{...rest}
		>
			{children}
			10.3321 {sys}
		</Button>
	) : null;
};
