import { Flex, Icon, Img, useColorMode, useDisclosure } from "@chakra-ui/react";
import { WalletButton } from "components";
import { BridgeButton, IconButton } from "components/Buttons";
import { usePicasso } from "hooks";
import { MdOutlineCallMade } from "react-icons/md";
import { PsysBreakdown } from "components/Modals/PsysBreakdown";
import { NavButton } from "./NavButton";
import { NetworkButton } from "./NetworkButton";
import { TokenButton } from "./TokenButton";
import { MenuLinks } from "./MenuLink";
import { Languages } from "./Languages";

export const Header: React.FC = () => {
	const { toggleColorMode } = useColorMode();
	const theme = usePicasso();
	const { onOpen, isOpen, onClose } = useDisclosure();
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
			<PsysBreakdown isOpen={isOpen} onClose={onClose} />
			<Img
				w="6"
				h="6"
				src={theme.icon.pegasysLogo}
				ml="4"
				position="absolute"
				left="0"
			/>
			<Flex gap="1" bgColor={theme.bg.topHeader} borderRadius="20">
				{links.map((item, index) => (
					<NavButton key={item.name + Number(index)} href={item.url}>
						{item.name}
					</NavButton>
				))}

				<NavButton href="/" color={theme.text.header}>
					Charts <Icon as={MdOutlineCallMade} w="5" h="5" ml="2" />
				</NavButton>
				<BridgeButton />
			</Flex>
			<Flex
				w="32rem"
				h="max-content"
				backgroundColor={theme.bg.blackAlpha}
				mt="60"
				borderRadius="46px 46px 0px 0px"
				border={theme.border.headerBorder}
				boxShadow={theme.border.headerBorderShadow}
				position="fixed"
				bottom="0"
				zIndex="2"
				alignItems="center"
				px="10"
				py="2"
				justifyContent="space-between"
			>
				<Flex w="25%" justifyContent="space-between">
					<TokenButton onClick={onOpen} />
					<NetworkButton />
				</Flex>
				<Flex>
					<WalletButton />
				</Flex>
				<Flex>
					<Languages />
					<MenuLinks />
					<IconButton
						_hover={{
							background: theme.bg.iconBg,
						}}
						aria-label="Theme"
						icon={<theme.icon.theme />}
						onClick={() => toggleColorMode()}
					/>
				</Flex>
			</Flex>
		</Flex>
	);
};
