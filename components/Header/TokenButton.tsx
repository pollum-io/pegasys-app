import { Button, ButtonProps } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode } from 'react';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const TokenButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();
	const token = 'PSYS';
	return (
		<Button
			color="white"
			bgColor={theme.bg.button.secondary}
			opacity="0.90"
			_hover={{ opacity: 1 }}
			_active={{}}
			w="max-content"
			h="max-content"
			py="2"
			px="4"
			{...rest}
		>
			{token}
		</Button>
	);
};
