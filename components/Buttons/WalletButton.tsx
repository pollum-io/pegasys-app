import { Button, ButtonProps } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode } from 'react';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const WalletButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();
	const isConnected = false;
	const address = '0x5656as5656das65';
	return (
		<Button
			color={theme.text.blue}
			bgColor={theme.bg.button.tertiary}
			borderWidth="1px"
			borderStyle="solid"
			borderColor="transparent"
			opacity="0.85"
			_hover={{
				opacity: '1',
			}}
			_active={{}}
			w="max-content"
			h="max-content"
			py="2"
			px="4"
			{...rest}
		>
			{isConnected ? address : 'Connect your wallet'}
		</Button>
	);
};
