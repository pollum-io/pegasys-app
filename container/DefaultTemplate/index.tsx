import { Flex } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Header } from "components";
import { WalletProvider, TokensProvider } from "contexts";
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
				<TokensProvider>
					<Flex
						bgColor={theme.bg.primary}
						flexDirection={["column"]}
						h="100vh"
						w="100vw"
						backgroundImage="radial-gradient(50% 50% at 50% 50%, rgba(0, 217, 239, 0.15) 0%, rgba(33, 36, 41, 0) 100%)"
					>
						<Header />
						{children}
					</Flex>
				</TokensProvider>
			</WalletProvider>
		</Web3ReactProvider>
	);
};
