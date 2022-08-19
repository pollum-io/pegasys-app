import { Flex, Icon, Img, Link, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { WalletButton } from "components";
import { IconButton } from "components/Buttons";
import { useModal, usePicasso } from "hooks";
import { MdOutlineCallMade } from "react-icons/md";
import { PsysBreakdown } from "components/Modals/PsysBreakdown";
import { useRouter } from "next/router";
import { NavButton } from "./NavButton";
import { NetworkButton } from "./NetworkButton";
import { TokenButton } from "./TokenButton";
import { MenuLinks } from "./MenuLink";
import { SettingsButton } from "./SettingsButton";

export const Header: React.FC = () => {
	const { toggleColorMode } = useColorMode();
	const theme = usePicasso();
	const { pathname } = useRouter();

	const { isOpenPsysBreakdown, onOpenPsysBreakdown, onClosePsysBreakdown } =
		useModal();
	const [nav, setNav] = useState(false);
	const isNav = () => {
		if (nav) {
			return "white";
		}

		return null;
	};
	const links = [
		{
			name: "Swap",
			url: "/",
		},
		{
			name: "Pools",
			url: "/pools",
		},
		{
			name: "Farms",
			url: "/farms",
		},
		{
			name: "Stake",
			url: "/stake",
		},
	];

	return (
		<Flex
			p="4"
			mt="1"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
		>
			<PsysBreakdown
				isOpen={isOpenPsysBreakdown}
				onClose={onClosePsysBreakdown}
			/>
			<Link href="/">
				<Img
					w={["7", "8", "6", "6"]}
					h={["7", "8", "6", "6"]}
					src="icons/pegasys.png"
					ml={["2", "4", "4", "4"]}
					mt={["1.5", "1", "2", "1.5"]}
					position="absolute"
					left="0"
				/>
			</Link>
			<Flex
				gap={["0", "1", "1", "1"]}
				bgColor={theme.bg.topHeader}
				borderRadius="20"
				ml={["7", "0", "0", "0"]}
			>
				{links.map((item, index) => (
					<NavButton
						key={item.name + Number(index)}
						href={item.url}
						active={pathname === item.url}
					>
						{item.name}
					</NavButton>
				))}
				<NavButton
					href="/"
					color={theme.text.header}
					display={{
						base: "none",
						sm: "none",
						md: "flex",
						lg: "flex",
					}}
				>
					Charts
					<Icon as={MdOutlineCallMade} w="5" h="5" ml="2" />
				</NavButton>
			</Flex>
			<Flex
				w={["90%", "32rem", "32rem", "32rem"]}
				h="max-content"
				backgroundColor={theme.bg.blackAlpha}
				borderRadius="46px 46px 0px 0px"
				border={theme.border.headerBorder}
				boxShadow={theme.border.headerBorderShadow}
				position="fixed"
				bottom="0"
				zIndex="99"
				alignItems="center"
				px={["0", "10"]}
				pl={["1", "6", "6", "10"]}
				pr={["0", "4", "6", "10"]}
				py="2"
				justifyContent={["space-around", "space-between"]}
			>
				<Flex
					w="25%"
					gap={["2", "0"]}
					justifyContent={["space-around", "space-between"]}
				>
					<TokenButton onClick={onOpenPsysBreakdown} />
					<NetworkButton />
				</Flex>
				<Flex flexDirection="column">
					<WalletButton />
				</Flex>
				<Flex>
					<IconButton
						_hover={{
							background: theme.bg.iconBg,
						}}
						aria-label="Theme"
						icon={<theme.icon.theme />}
						onClick={() => toggleColorMode()}
					/>
					<MenuLinks />
					<SettingsButton />
				</Flex>
			</Flex>
		</Flex>
	);
};
