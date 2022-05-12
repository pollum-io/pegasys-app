import { Button, ButtonProps, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Flex, Text, Input, Stack, Switch } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { IconButton } from "../Buttons/IconButton"
import { FiSettings } from "react-icons/fi";
import { usePicasso } from "hooks";
import { SlippageButton } from "../Buttons/SlippageButton";

interface IButtonProps extends ButtonProps {
    children?: ReactNode;
}

export const SettingsButton: FunctionComponent<IButtonProps> = props => {
    const theme = usePicasso();

    return (

        <Popover>
            <PopoverTrigger {...props}>
                <IconButton aria-label="Popover" icon={<FiSettings />} />
            </PopoverTrigger>
            <PopoverContent position="absolute" left="96rem" top="4rem" w="19rem">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                    <Text fontSize="14px" fontWeight={600}>Transaction Settings</Text>
                </PopoverHeader>
                <PopoverBody>
                    <Text fontSize="14px" fontWeight={400} pb="0.5rem">Slippage tolerance</Text>
                    <SlippageButton aria-label="Slip" >0.1%</SlippageButton>
                    <SlippageButton aria-label="Slip">0.5%</SlippageButton>
                    <SlippageButton aria-label="Slip">1.01%</SlippageButton>
                    <Input w="5.3rem" h="2rem" borderRadius={36} padding="0rem 1.5rem" placeholder="1.0%" fontWeight={400} />

                    <Text fontSize="14px" fontWeight={400} pt="1rem">Transaction deadline</Text>
                    <Flex flexDirection="row" alignItems="center" pt="0.5rem">
                        <Input w="5.3rem" h="2rem" borderRadius={36} padding="0rem 1.5rem" placeholder="1.0%" fontWeight={400} />
                        <Text fontSize="14px" fontWeight={400} pl="0.5rem">minutes</Text>
                    </Flex>

                    <Text fontSize="14px" fontWeight={600} pt="1rem">Interface Settings</Text>
                    <Flex alignItems="baseline" justifyContent="space-between">
                        <Text fontSize="14px" fontWeight={600} pt="1rem">Toggle Expert Mode</Text>
                        <Stack align="center" direction="row">
                            <Switch size="md" colorScheme="teal"/>
                        </Stack>
                    </Flex>

                </PopoverBody>
            </PopoverContent>
        </Popover>

    );

};