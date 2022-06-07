import { Button, ButtonProps, Flex } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode } from 'react';
import { ConnectSyscoinNetwork } from 'utils/ConnectSyscoinNetwork';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const SwitchToSyscoin: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();
	const { children, ...rest } = props;

	return (
		<Button
			py="8"
			px="20"
			borderRadius="12"
			fontSize="md"
			fontWeight={500}
			color={theme.text.whiteCyan}
			bgColor={theme.bg.button.switchNetwork}
			onClick={ConnectSyscoinNetwork}
			{...rest}
		>
			Switch to Syscoin Chain
		</Button>
	);
};
