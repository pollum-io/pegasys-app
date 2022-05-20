import { Button, Flex, Img, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { useContext } from 'react';
import { WalletProvider } from '../../contexts/wallet'
import { useWallet } from 'hooks';

interface IModal {
    isOpen: boolean;
    onClose: () => void;
}

export const SelectWallets: React.FC<IModal> = props => {
    const { isOpen, onClose } = props;
    const theme = usePicasso();
    const { connectWallet } = useWallet();

    return (
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent borderRadius={18} my='40'>
                <ModalHeader bgColor={theme.bg.whiteGray} borderTopRadius={18}>
                    <Text fontSize='md' textColor={theme.text.cyan} fontWeight={600}>Connect to a Wallet</Text> 
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody bgColor={theme.bg.iceGray}>
                    <Flex 
                        justifyContent='space-between' 
                        mx='8' 
                        my='4' 
                        p='4' 
                        border='1px solid' 
                        borderRadius='10'
                        borderColor={theme.border.walltes}
                        _hover={{borderColor:theme.text.cyan}}
                        fontWeight={500}
                        onClick={connectWallet}
                    >
                        <Text>Metamask</Text>
                        <Img src='icons/metamask.png' alt='Metamask' w='6'/>
                    </Flex>
                    <Flex 
                        justifyContent='space-between' 
                        mx='8' 
                        my='4' 
                        p='4' 
                        border='1px solid' 
                        borderRadius='10'
                        borderColor={theme.border.walltes}
                        _hover={{borderColor:theme.text.cyan}}
                        fontWeight={500}
                        onClick={connectWallet}

                    >                        
                        <Text>Coinbase Wallet</Text>
                        <Img src='icons/coinbaseWalletIcon.svg' alt='Coinbase Wallet' w='6'/>
                    </Flex>
                    <Flex 
                        justifyContent='space-between' 
                        mx='8' 
                        my='4' 
                        p='4' 
                        border='1px solid' 
                        borderRadius='10' 
                        borderColor={theme.border.walltes}
                        _hover={{borderColor:theme.text.cyan}}
                        fontWeight={500}
                    >                        
                        <Text>Wallet Connect</Text>
                        <Img src='icons/walletConnectIcon.svg' alt='Wallet Connection' w='6'/>
                    </Flex>
                    <Flex 
                        justifyContent='space-between' 
                        mx='8' 
                        my='4' 
                        p='4' 
                        border='1px solid' 
                        borderRadius='10' 
                        borderColor={theme.border.walltes}
                        _hover={{borderColor:theme.text.cyan}}
                        fontWeight={500}
                    >                        
                        <Text>Math Wallet</Text>
                        <Img src='icons/mathwallet.svg' alt='Math Wallet' w='6'/>
                    </Flex>
                </ModalBody>
                <ModalFooter flexDirection='column' bgColor={theme.bg.iceGray} borderRadius={18}>
                    <Text>New to Syscoin? </Text>
                    <Text textColor={theme.text.cyan} fontWeight={600}>Learn more about setting up a wallet</Text>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}