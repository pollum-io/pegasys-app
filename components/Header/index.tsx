import { Flex, Icon, Img, useColorMode } from "@chakra-ui/react";
import { WalletButton } from "components";
import { BridgeButton, IconButton } from "components/Buttons";
import { usePicasso } from "hooks";
import { MdOutlineCallMade } from "react-icons/md";
import { NavButton } from "./NavButton";
import { NetworkButton } from "./NetworkButton";
import { TokenButton } from "./TokenButton";
import { MenuLinks } from "./MenuLink";
import { Languages } from "./Languages";

export const Header: React.FC = () => {
	const { toggleColorMode } = useColorMode();
	const theme = usePicasso();
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
			<Flex
				width="3xl"
				height="lg"
				top="0"
				position="fixed"
				background="#56BED8;"
				opacity="0.7"
				filter="blur(275px)"
			/>
			<Img
				w="6"
				h="6"
				src="icons/pegasys.png"
				ml="4"
				position="absolute"
				left="0"
			/>
			<Flex gap="6" bgColor="rgb(0, 0, 0)" borderRadius="20">
				{links.map((item, index) => (
					<NavButton key={item.name + Number(index)} href={item.url}>
						{item.name}
					</NavButton>
				))}

				<NavButton href="/" pr="4">
					Charts <Icon as={MdOutlineCallMade} w="5" h="5" ml="2" />
				</NavButton>
				<BridgeButton />
			</Flex>
			<Flex
				w="32rem"
				h="max-content"
				backgroundColor="#081120"
				mt="60"
				borderRadius="46px 46px 0px 0px"
				border="1px solid rgba(86, 190, 216, 0.26)"
				position="fixed"
				bottom="0"
				zIndex="2"
				alignItems="center"
				px="10"
				py="2"
				justifyContent="space-between"
			>
				<Flex w="25%" justifyContent="space-between">
					<TokenButton />
					<NetworkButton />
				</Flex>
				<Flex>
					<WalletButton />
				</Flex>
				<Flex>
					<Languages />
					<MenuLinks />
					<IconButton
						aria-label="Theme"
						icon={<theme.icon.theme />}
						onClick={() => toggleColorMode()}
					/>
				</Flex>
			</Flex>
		</Flex>
	);
};
