import { Button, ButtonProps } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode } from 'react';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const NetworkButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();
	const connectedNetwork = 'NEVM';
	return (
		<Button
			color="white"
			bg={theme.bg.button.network}
			borderRadius={12}
			opacity="0.9"
			_hover={{ opacity: 1 }}
			_active={{}}
			w="max-content"
			h="max-content"
			py="2.5"
			px="4"
			{...rest}
		>
			{connectedNetwork}
		</Button>
	);
};
