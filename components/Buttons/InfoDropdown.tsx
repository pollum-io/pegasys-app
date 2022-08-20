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
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { MdOutlineCallMade, MdOutlineModeComment } from "react-icons/md";

export const InfoDropdown: FunctionComponent = () => {
	const theme = usePicasso();

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
					pl={["24", "36", "6", "6"]}
					pr={["24", "36", "6", "6"]}
					py={["2", "2", "1", "1"]}
					_expanded={{
						bg: theme.bg.blackLightness,
						color: theme.text.cyanPurple,
					}}
					_focus={{
						outline: "none",
					}}
					_hover={{
						color: theme.text.cyanPurple,
						backgroundColor: "transparent",
					}}
				>
					<Icon as={MdOutlineCallMade} />
					<Box
						flex="1"
						pl="0.5rem"
						pr="10"
						textAlign="left"
						fontSize="md"
						fontWeight="normal"
						alignItems="center"
						color={theme.text.mono}
						m="0"
						_hover={{
							color: theme.text.cyanPurple,
							backgroundColor: "transparent",
						}}
						_expanded={{
							bg: theme.bg.blackLightness,
							color: theme.text.cyanPurple,
						}}
					>
						Bridge
					</Box>
					<AccordionIcon />
				</AccordionButton>
				<Flex flexDirection="column">
					<AccordionPanel pb={4} bgColor={theme.bg.blackLightness}>
						{bridgeInfos.map((links, index) => (
							<Flex key={links.name + Number(index)}>
								<Link
									position="relative"
									left={["6.5rem", "9.5rem", "6", "6"]}
									href={links.href}
									target="_blank"
									_hover={{
										textDecoration: "none",
										bgColor: "transparent",
										color: theme.text.cyanPurple,
									}}
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
					pl={["24", "36", "6", "6"]}
					pr={["24", "36", "6", "6"]}
					py={["2", "2", "1", "1"]}
					_expanded={{
						bg: theme.bg.blackLightness,
						color: theme.text.cyanPurple,
					}}
					_focus={{
						outline: "none",
					}}
					_hover={{
						color: theme.text.cyanPurple,
						backgroundColor: "transparent",
					}}
				>
					<Icon as={MdOutlineModeComment} />
					<Box
						flex="1"
						pl="0.5rem"
						pr="10"
						textAlign="left"
						fontSize="md"
						fontWeight="normal"
						alignItems="center"
						color={theme.text.mono}
						m="0"
						_hover={{
							color: theme.text.cyanPurple,
							backgroundColor: "transparent",
						}}
					>
						Social
					</Box>
					<AccordionIcon />
				</AccordionButton>
				<Flex flexDirection="column">
					<AccordionPanel pb={4} bgColor={theme.bg.blackLightness}>
						{socialInfos.map((links, index) => (
							<Flex key={links.name + Number(index)}>
								<Link
									href="https://app.multichain.org/#/router"
									target="_blank"
									position="relative"
									left={["6.5rem", "9.5rem", "6", "6"]}
									_hover={{
										textDecoration: "none",
										bgColor: "transparent",
										color: theme.text.cyanPurple,
									}}
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
