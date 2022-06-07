import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { WalletOptions }  from 'components/WalletOptions'

interface IModal {
    isOpen: boolean;
    onClose: () => void;
}

export const SelectWallets: React.FC<IModal> = props => {
    const { isOpen, onClose } = props;
    const theme = usePicasso();

    return (
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent borderRadius={18} my='40'>
                <ModalHeader bgColor={theme.bg.whiteGray} borderTopRadius={18}>
                    <Text fontSize='md' textColor={theme.text.cyan} fontWeight={600}>Connect to a Wallet</Text> 
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody bgColor={theme.bg.iceGray}>
                    <WalletOptions />
                </ModalBody>
                <ModalFooter flexDirection='column' bgColor={theme.bg.iceGray} borderRadius={18}>
                    <Text>New to Syscoin? </Text>
                    <Text textColor={theme.text.cyan} fontWeight={600}>Learn more about setting up a wallet</Text>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}