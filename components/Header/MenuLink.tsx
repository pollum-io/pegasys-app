import { ButtonProps, Flex, IconButton, Link, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { BsThreeDots, BsCheck2Square } from "react-icons/bs";
import { FiTwitter } from "react-icons/fi";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { usePicasso } from "hooks";
import { InfoLinks } from "./InfoLinks";


interface IButtonProps extends ButtonProps {
    children?: ReactNode;
}

export const MenuLinks: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();

    return (
    <Popover>
        <PopoverTrigger {...props}>
            <IconButton aria-label="Popover" icon={<BsThreeDots />} />
        </PopoverTrigger>
        <PopoverContent position="absolute" left="-5rem" top="0rem" w="8rem">
            <PopoverCloseButton />
            <PopoverBody display="flex" flexDirection="column">
                <Flex alignItems="center" >
                    <AiOutlineInfoCircle />
                    <InfoLinks href="https://pegasys.finance/">About</InfoLinks>
                </Flex>
                <Flex alignItems="center">
                    <FaDiscord />
                    <InfoLinks href="https://discord.com/invite/UzjWbWWERz">Discord</InfoLinks>
                </Flex>
                <Flex alignItems="center">
                    <FaTelegramPlane />
                    <InfoLinks href="https://t.me/joinchat/GNosBd1_76E5MTVh">Telegram</InfoLinks>
                </Flex>
                <Flex alignItems="center">
                    <FiTwitter />
                    <InfoLinks href="https://twitter.com/PegasysDEX">Twitter</InfoLinks>
                </Flex>
                <Flex alignItems="center">
                    <BsCheck2Square />
                    <InfoLinks href="https://pegasys.finance/">Telegram</InfoLinks>
                </Flex>
            </PopoverBody>
        </PopoverContent>
    </Popover>
    );
};