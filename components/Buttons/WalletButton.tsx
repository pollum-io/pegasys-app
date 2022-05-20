import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';
import { SelectWallets } from 'components/Modals';
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
	const { onOpen, isOpen, onClose } = useDisclosure();
	return (
		<>
			<SelectWallets isOpen={isOpen} onClose={onClose}/>
			<Button
				color={theme.text.connectWallet}
				bg={theme.bg.button.connectWallet}
				borderWidth="1px"
				borderStyle="solid"
				borderColor={theme.border.connectWallet}
				borderRadius={12}
				opacity="0.85"
				_hover={{
					opacity: '1',
				}}
				_active={{}}
				w="max-content"
				h="max-content"
				py="2"
				px="4"
				onClick={onOpen}
				{...rest}
			>
				{isConnected ? address : 'Connect your wallet'}
			</Button>
		</>
	);
};
