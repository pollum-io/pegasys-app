import { Button, ButtonProps, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";
import { SwitchToSyscoin } from 'components/Buttons'

interface IModal {
    isOpen: boolean;
    onClose: () => void;
}

export const SelectSyscoin: FunctionComponent<IModal> = props => {
    const { isOpen, onClose } = props;
    const theme = usePicasso();

    return (
        <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent borderRadius={18} my='40'>
                <ModalHeader bgColor={theme.bg.whiteGray} borderTopRadius={18}>
                    <Text fontSize='md' textColor={theme.text.cyan} fontWeight={600}>Wrong Network</Text> 
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody bgColor={theme.bg.iceGray}>
                    <Text fontSize='md' fontWeight={400} textAlign="center" my="5">Please connect to the appropriate Syscoin network.</Text>
                </ModalBody>
                <ModalFooter flexDirection='column' bgColor={theme.bg.iceGray} borderRadius={18}>
                    <SwitchToSyscoin />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
