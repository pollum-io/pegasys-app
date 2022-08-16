import { Flex } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Header } from "components";
import { WalletProvider, TokensProvider } from "contexts";
import { usePicasso } from "hooks";
import { getLibrary } from "utils";
import { ModalsProvider } from "contexts/modals";

interface BaseLayoutProps {
	children?: ReactNode;
	heightValue?: string;
	widthValue?: string;
}

export const DefaultTemplate: FunctionComponent<BaseLayoutProps> = ({
	children,
	heightValue,
	widthValue,
}) => {
	const theme = usePicasso();
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<WalletProvider>
				<TokensProvider>
					<ModalsProvider>
						<Flex
							bgColor={theme.bg.primary}
							flexDirection={["column"]}
							style={{
								minHeight: heightValue,
								width: widthValue,
							}}
							alignItems="center"
						>
							<Flex
								width="100%"
								height={["100%", "40%", "40%", "40%"]}
								margin="0 auto"
								top={["-10rem", "-10rem", "-5rem", "-5rem"]}
								position="fixed"
								background="radial-gradient(ellipse at center, #56BED8, #010101)"
								filter="blur(175px)"
							/>
							<div id="starsLightMode" />
							<div id="starsLightMode2" />
							<div id="starsLightMode3" />
							<Header />
							{children}
						</Flex>
					</ModalsProvider>
				</TokensProvider>
			</WalletProvider>
		</Web3ReactProvider>
	);
};
