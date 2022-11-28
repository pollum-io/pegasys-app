import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Collapse,
	Flex,
	Icon,
	Link,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineCallMade, MdOutlineModeComment } from "react-icons/md";

const socialInfos = [
	{ id: 1, name: "Discord", link: "https://discord.com/invite/UzjWbWWERz" },
	{ id: 2, name: "Telegram", link: "https://t.me/joinchat/GNosBd1_76E5MTVh" },
	{ id: 3, name: "Twitter", link: "https://twitter.com/PegasysDEX" },
];

const bridgeInfos = [
	{ id: 1, name: "Multichain", href: "https://app.multichain.org/#/router" },
	{ id: 2, name: "Syscoin", href: "https://bridge.syscoin.org/" },
];

export const InfoDropdown: FunctionComponent = () => {
	const theme = usePicasso();
	const [state1, setState1] = useState<boolean>();
	const [state2, setState2] = useState<boolean>();

	return (
		<Flex flexDir="column" pt="0" pb="2" gap="1">
			<Flex
				flexDir="column"
				py="2"
				bgColor={state1 ? theme.bg.blackLightness : "transparent"}
			>
				<Flex
					align="center"
					gap="2"
					pb="1"
					onClick={() => setState1(!state1)}
					_hover={{ cursor: "pointer", color: theme.text.cyanPurple }}
				>
					<Icon
						position="absolute"
						left={["6rem", "9rem", "6", "6"]}
						as={MdOutlineModeComment}
					/>
					<Text px={["7.5rem", "10.5rem", "12", "12"]}>Socials</Text>
					{state1 ? (
						<Icon
							position={["absolute", "absolute", "relative", "relative"]}
							right={["5rem", "9rem", "0.7rem", "0.7rem"]}
							as={IoIosArrowUp}
						/>
					) : (
						<Icon
							position={["absolute", "absolute", "relative", "relative"]}
							right={["5rem", "9rem", "0.7rem", "0.7rem"]}
							as={IoIosArrowDown}
						/>
					)}
				</Flex>
				<Collapse in={state1}>
					<Flex flexDir="column" py="1">
						{socialInfos.map((social: any) => (
							<Link
								key={social.id}
								href={social.link}
								target="_blank"
								_hover={{ textDecoration: "none", bgColor: "transparent" }}
								_active={{ bgColor: "transparent" }}
							>
								<Text
									px={["7.5rem", "10.5rem", "12", "12"]}
									pb="1"
									_hover={{ cursor: "pointer", color: theme.text.cyanPurple }}
								>
									{social.name}
								</Text>
							</Link>
						))}
					</Flex>
				</Collapse>
			</Flex>
			<Flex
				flexDir="column"
				bgColor={state2 ? theme.bg.blackLightness : "transparent"}
			>
				<Flex
					align="center"
					gap="2"
					pb="1"
					onClick={() => setState2(!state2)}
					_hover={{ cursor: "pointer", color: theme.text.cyanPurple }}
				>
					<Icon
						position="absolute"
						left={["6rem", "9rem", "6", "6"]}
						as={MdOutlineCallMade}
					/>
					<Text px={["7.5rem", "10.5rem", "12", "12"]}>Bridges</Text>
					{state2 ? (
						<Icon
							position={["absolute", "absolute", "relative", "relative"]}
							right={["5rem", "9rem", "1rem", "1rem"]}
							as={IoIosArrowUp}
						/>
					) : (
						<Icon
							position={["absolute", "absolute", "relative", "relative"]}
							right={["5rem", "9rem", "1rem", "1rem"]}
							as={IoIosArrowDown}
						/>
					)}
				</Flex>
				<Collapse in={state2}>
					<Flex flexDir="column" py="1">
						{bridgeInfos.map((bridge: any) => (
							<Link
								key={bridge.id}
								href={bridge.link}
								target="_blank"
								_hover={{ textDecoration: "none", bgColor: "transparent" }}
								_active={{ bgColor: "transparent" }}
							>
								<Text
									px={["7.5rem", "10.5rem", "12", "12"]}
									pb="1"
									_hover={{ cursor: "pointer", color: theme.text.cyanPurple }}
								>
									{bridge.name}
								</Text>
							</Link>
						))}
					</Flex>
				</Collapse>
			</Flex>
		</Flex>
	);
};
