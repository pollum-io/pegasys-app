import { Flex } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Header } from "components";
import { WalletProvider } from "contexts";
import { usePicasso } from "hooks";
import { getLibrary } from "utils";

interface BaseLayoutProps {
	children?: ReactNode;
}

export const DefaultTemplate: FunctionComponent<BaseLayoutProps> = ({
	children,
}) => {
	const theme = usePicasso();
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<WalletProvider>
				<Flex
					bgColor={theme.bg.primary}
					flexDirection={["column"]}
					h="100vh"
					w="100vw"
				>
					<div id="starsLightMode" />
					<div id="starsLightMode2" />
					<div id="starsLightMode3" />
					<Header />
					{children}
				</Flex>
			</WalletProvider>
		</Web3ReactProvider>
	);
};
