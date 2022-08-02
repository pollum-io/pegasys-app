import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Flex,
	Icon,
	Link,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, useState } from "react";
import { MdOutlineCallMade, MdOutlineModeComment } from "react-icons/md";

export const InfoDropdown: FunctionComponent = () => {
	const theme = usePicasso();

	const [isOpenBridge, setIsOpenBridge] = useState<boolean>(false);
	const [isOpenSocial, setIsOpenSocial] = useState<boolean>(false);

	const socialInfos = [
		{
			name: "Discord",
			link: "https://discord.com/invite/UzjWbWWERz",
		},
		{
			name: "Telegram",
			link: "https://t.me/joinchat/GNosBd1_76E5MTVh",
		},
		{
			name: "Twitter",
			link: "https://twitter.com/PegasysDEX",
		},
	];

	const bridgeInfos = [
		{
			name: "Multichain",
			href: "https://app.multichain.org/#/router",
		},
		{
			name: "Syscoin",
			href: "https://bridge.syscoin.org/",
		},
	];

	return (
		<Accordion allowMultiple>
			<AccordionItem border="none">
				<AccordionButton
					pl="4"
					_expanded={{ bg: theme.bg.whiteGray }}
					_focus={{
						outline: "none",
					}}
					_hover={{
						color: theme.text.cyan,
						backgroundColor: "transparent",
					}}
				>
					<Icon as={MdOutlineCallMade} />
					<Box
						flex="1"
						pl="2"
						pr="10"
						textAlign="left"
						fontSize="md"
						fontWeight="normal"
						alignItems="center"
						color={theme.text.mono}
						m="0"
						_hover={{
							color: theme.text.cyan,
							backgroundColor: "transparent",
						}}
					>
						Bridge
					</Box>
					<AccordionIcon />
				</AccordionButton>
				<Flex flexDirection="column">
					<AccordionPanel
						pb={4}
						bgColor={theme.bg.whiteGray}
						_active={{
							bgColor: "transparent",
							border: "none",
						}}
					>
						{bridgeInfos.map((links, index) => (
							<Flex
								_hover={{ bgColor: "transparent", color: theme.text.cyan }}
								key={links.name + Number(index)}
							>
								<Link
									position="relative"
									left="6"
									href={links.href}
									target="_blank"
									_hover={{ textDecoration: "none", bgColor: "transparent" }}
									_active={{ bgColor: "transparent" }}
									py="1"
								>
									{links.name}
								</Link>
							</Flex>
						))}
					</AccordionPanel>
				</Flex>
			</AccordionItem>
			<AccordionItem border="none">
				<AccordionButton
					pl="4"
					_expanded={{ bg: theme.bg.whiteGray }}
					_focus={{
						outline: "none",
					}}
					_hover={{
						color: theme.text.cyan,
						backgroundColor: "transparent",
					}}
				>
					<Icon as={MdOutlineModeComment} />
					<Box
						flex="1"
						pl="2"
						pr="10"
						textAlign="left"
						fontSize="md"
						fontWeight="normal"
						alignItems="center"
						color={theme.text.mono}
						m="0"
						_hover={{
							color: theme.text.cyan,
							backgroundColor: "transparent",
						}}
					>
						Social
					</Box>
					<AccordionIcon />
				</AccordionButton>
				<Flex flexDirection="column">
					<AccordionPanel
						pb={4}
						bgColor={theme.bg.whiteGray}
						_active={{
							bgColor: "transparent",
							border: "none",
						}}
					>
						{socialInfos.map((links, index) => (
							<Flex
								_hover={{ bgColor: "transparent", color: theme.text.cyan }}
								key={links.name + Number(index)}
							>
								<Link
									href="https://app.multichain.org/#/router"
									target="_blank"
									position="relative"
									left="6"
									_hover={{ textDecoration: "none", bgColor: "transparent" }}
									_active={{ bgColor: "transparent" }}
									py="1"
								>
									{links.name}
								</Link>
							</Flex>
						))}
					</AccordionPanel>
				</Flex>
			</AccordionItem>
		</Accordion>
	);
};
