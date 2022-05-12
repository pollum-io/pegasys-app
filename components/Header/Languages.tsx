import { ButtonProps, Flex, IconButton, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import ReactCountryFlag from "react-country-flag";


interface IButtonProps extends ButtonProps {
    children?: ReactNode;
}

export const Languages: FunctionComponent<IButtonProps> = props => {

    return (
        <Popover>
            <PopoverTrigger {...props}>
                <IconButton aria-label="Popover" icon={<ReactCountryFlag countryCode="US" svg/>} />
            </PopoverTrigger>
            <PopoverContent position="absolute" left="-5rem" top="0rem" w="8rem" p="0rem">
                <PopoverBody display="flex" flexDirection="column" p="0rem">
                    <Flex p="0.5rem">
                        <ReactCountryFlag countryCode="US" svg style={{fontSize: "1.5em"}}/>
                        <Text paddingLeft="0.5rem">EN</Text>
                    </Flex>
                    <Flex p="0.5rem">
                        <ReactCountryFlag countryCode="BR" svg style={{fontSize: "1.5em"}}/>
                        <Text paddingLeft="0.5rem">PT-BR</Text>
                    </Flex>
                    <Flex p="0.5rem">
                        <ReactCountryFlag countryCode="ES" svg style={{fontSize: "1.5em"}}/>
                        <Text paddingLeft="0.5rem">ES</Text>
                    </Flex>
                    <Flex p="0.5rem">
                        <ReactCountryFlag countryCode="DE" svg style={{fontSize: "1.5em"}}/>
                        <Text paddingLeft="0.5rem">DE</Text>
                    </Flex>
                    <Flex p="0.5rem">
                        <ReactCountryFlag countryCode="FR" svg style={{fontSize: "1.5em"}}/>
                        <Text paddingLeft="0.5rem">FR</Text>
                    </Flex>
                    <Flex p="0.5rem">
                        <ReactCountryFlag countryCode="TR" svg style={{fontSize: "1.5em"}}/>
                        <Text paddingLeft="0.5rem">TR</Text>
                    </Flex>
                    <Flex p="0.5rem">
                        <ReactCountryFlag countryCode="VN" svg style={{fontSize: "1.5em"}}/>
                        <Text paddingLeft="0.5rem">VN</Text>
                    </Flex>
                    <Flex p="0.5rem">
                        <ReactCountryFlag countryCode="CN" svg style={{fontSize: "1.5em"}}/>
                        <Text paddingLeft="0.5rem">ZH</Text>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};