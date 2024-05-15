import React from "react";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Icon,
	Img,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { MdArrowBack, MdOutlineCallMade } from "react-icons/md";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { DrawerLinks } from "./DrawerLinks";

interface IDrawer {
	isOpen: boolean;
	onClose: () => void;
}

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

export const DrawerMenu: React.FC<IDrawer> = props => {
	const { isOpen, onClose } = props;
	const btnRef: any = React.useRef();
	const theme = usePicasso();
	const { pathname } = useRouter();
	const { t: translation } = useTranslation();

	return (
		<Drawer
			isOpen={isOpen}
			placement="right"
			onClose={onClose}
			finalFocusRef={btnRef}
		>
			<DrawerOverlay />
			<DrawerContent
				maxWidth="80%"
				borderLeftRadius="1.875rem"
				border="1px solid transparent;"
				borderRight="none"
				borderBottom="none"
				borderTop="none"
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(89deg, rgba(86, 190, 216, 0.3) 30.76%, rgba(86, 190, 216, 0) 97.76%) border-box`}
			>
				<DrawerHeader>
					<Flex
						flexDirection="row"
						alignItems="center"
						gap="2"
						onClick={onClose}
						pt="2"
					>
						<MdArrowBack size={25} />
						<Text fontWeight="semibold">{translation("migratePage.back")}</Text>
					</Flex>
				</DrawerHeader>
				<DrawerBody p="0" m="0">
					<Flex
						flexDirection="column"
						justifyContent="flex-start"
						alignItems="flex-start"
						gap="1rem"
						pt="2rem"
					>
						{links.map((item, index) => (
							<DrawerLinks
								key={item.name + Number(index)}
								href={item.url}
								active={pathname === item.url}
							>
								{item.name}
							</DrawerLinks>
						))}
						{/* <DrawerLinks
							href="https://app.pegasys.fi/"
							color={theme.icon.whiteGray}
							customTarget
							display={{
								base: "none",
								sm: "none",
								md: "flex",
								lg: "flex",
							}}
						>
							V3
							<Icon as={MdOutlineCallMade} w="5" h="5" ml="2" />
						</DrawerLinks> */}
						<DrawerLinks
							href="#"
							color={theme.icon.whiteGray}
							customTarget
							display={{
								base: "none",
								sm: "none",
								md: "flex",
								lg: "flex",
							}}
						>
							Go to V3
							<Img
								w={["5", "5", "5", "5"]}
								h={["5", "5", "5", "5"]}
								src={theme.icon.rolluxLogo}
								ml={["2", "2", "2", "2"]}
								left="0"
							/>
							<Icon as={MdOutlineCallMade} w="5" h="5" ml="2" />
						</DrawerLinks>
					</Flex>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
