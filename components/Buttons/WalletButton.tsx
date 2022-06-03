import { Button, ButtonProps, Text, useDisclosure } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { SelectSyscoin, SelectWallets } from 'components/Modals';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode, useCallback, useMemo } from 'react';
import { AddressButton } from './AddressButton';
import { AddresInformationButton } from 'components/Buttons';
interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const WalletButton: FunctionComponent<IButtonProps> = props => {
	const { children, ...rest } = props;
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
	const {isOpen: isOpenAddress, onOpen: onOpenAddress, onClose: onCloseAddress} = useDisclosure()
	const { active, account, error } = useWeb3React();

	const shortAddress = (address: any) =>
		address ? `${address.substr(0, 5)}…${address.substr(-4)}` : '';

	return (
		<>
			{!active && !error && (
				<>
					<SelectWallets isOpen={isOpen} onClose={onClose} />
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
						Connect your wallet
					</Button>
				</>
			)}

			{error && (
				<>
					<SelectSyscoin isOpen={isOpen} onClose={onClose} />
					<AddressButton onClick={error ? onOpen : ''}>{account}</AddressButton>
				</>
			)}

			{active && !error && (
				<>
					<AddresInformationButton isOpen={isOpenAddress} onClose={onCloseAddress} />
					<AddressButton onClick={error ? onOpen : onOpenAddress}>{shortAddress(account)}</AddressButton>
				</>
			)}
		</>
	);
};
