import { Flex, useColorMode } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Header } from "components";
import { WalletProvider, TokensProvider, ModalsProvider } from "contexts";
import { usePicasso } from "hooks";
import { getLibrary } from "utils";

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
	const { colorMode } = useColorMode();

	console.log(colorMode, "colorr");

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
								height="40%"
								margin="0 auto"
								top={["-22rem", "-20rem", "-5rem", "-5rem"]}
								position="absolute"
								background={
									colorMode === "dark"
										? "radial-gradient(ellipse at center, #56BED8, #010101)"
										: "radial-gradient(ellipse at center, #68e1ffbe, #e6faff)"
								}
								filter="blur(175px)"
							/>
							{colorMode === "dark" ? (
								<Flex>
									<div id="starsLightMode" />
									<div id="starsLightMode2" />
									<div id="starsLightMode3" />
								</Flex>
							) : (
								<Flex>
									<div id="stars" />
									<div id="stars2" />
									<div id="stars3" />
								</Flex>
							)}

							<Header />
							{children}
						</Flex>
					</ModalsProvider>
				</TokensProvider>
			</WalletProvider>
		</Web3ReactProvider>
	);
};
