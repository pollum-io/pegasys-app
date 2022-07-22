import { Flex } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Header } from "components";
import { WalletProvider, TokensProvider } from "contexts";
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
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<WalletProvider>
				<TokensProvider>
					<Flex
						bgColor={theme.bg.primary}
						flexDirection={["column"]}
						style={{ minHeight: heightValue, width: widthValue }}
					>
						<Flex
							width="30%"
							height="lg"
							left="37rem"
							position="absolute"
							background="#56BED8;"
							opacity="0.7"
							filter="blur(275px)"
						/>
						<div id="starsLightMode" />
						<div id="starsLightMode2" />
						<div id="starsLightMode3" />
						<Header />
						{children}
					</Flex>
				</TokensProvider>
			</WalletProvider>
		</Web3ReactProvider>
	);
};
