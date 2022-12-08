import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ColorHandler } from "utils";
import "../styles/backgroundStars.css";
import "styles/style.css";
import "styles/psysAnimation.css";
import "styles/borderAnimation.css";
import "styles/circleLoadingAnimation.css";
import "styles/loadingDotsAnimation.css";
import "styles/loadingDotsAnimationLight.css";
import "styles/logoAnimation.css";
import "helpers/translation";
import "styles/scrollbarDarkmode.css";
import "styles/scrollbarLightmode.css";
import { ColorModeScript, ConfigColorMode } from "@chakra-ui/react";
import {
	TokensProvider,
	TokensListManageProvider,
	ModalsProvider,
} from "contexts";
import { PegasysProvider } from "pegasys-services";
import { usePicasso } from "hooks";
import { NextComponentType, NextPageContext } from "next";

type ProviderWrapperComponentProps = {
	Component: NextComponentType<NextPageContext, any>;
	pageProps: any;
};

const ProviderWrapperComponent = ({
	Component,
	pageProps,
}: ProviderWrapperComponentProps) => {
	const theme = usePicasso();

	return (
		<PegasysProvider
			toasty={{
				bg: theme.bg.blackAlpha,
				text: theme.text.mono,
			}}
		>
			<TokensListManageProvider>
				<TokensProvider>
					<ModalsProvider>
						<Component {...pageProps} />
					</ModalsProvider>
				</TokensProvider>
			</TokensListManageProvider>
		</PegasysProvider>
	);
};

const MyApp = ({ Component, pageProps }: AppProps) => {
	const [currentThemeToUse, setCurrentThemeToUse] =
		useState<ConfigColorMode>("dark");
	const [isSSR, setIsSSR] = useState(true);

	useEffect(() => {
		setIsSSR(false);
	}, []);

	useEffect(() => {
		if (isSSR) {
			const currentTheme = localStorage.getItem("chakra-ui-color-mode");

			if (currentTheme) {
				setCurrentThemeToUse(String(currentTheme) as ConfigColorMode);
			} else {
				setCurrentThemeToUse("dark");
			}
		}
	}, [isSSR]);

	if (isSSR) return null;

	return (
		<>
			<Head>
				<title>Pegasys Protocol</title>
				<meta name="description" content="" />
				<meta
					property="og:url"
					content="https://pegasys.financefinance"
					key="ogurl"
				/>
				<meta property="og:image" content="/meta.png" key="ogimage" />
				<meta
					property="og:site_name"
					content="Pegasys Protocol"
					key="ogsitename"
				/>
				<meta property="og:title" content="Pegasys Protocol" key="ogtitle" />
				<meta
					property="og:description"
					content="Swap, earn, and build with the leading decentralized crypto trading protocol on Syscoin."
					key="ogdesc"
				/>
				<link rel="icon" href="/favicon.ico" />
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://pegasys.finance" />
				<meta property="twitter:title" content="Pegasys Protocol" />
				<meta
					property="twitter:description"
					content="Swap, earn, and build with the leading decentralized crypto trading protocol on Syscoin."
				/>
				<meta property="twitter:image" content="/meta.png" />
			</Head>
			<ColorHandler cookies={pageProps.cookies}>
				<ColorModeScript initialColorMode={currentThemeToUse} />
				<ProviderWrapperComponent Component={Component} pageProps={pageProps} />
			</ColorHandler>
		</>
	);
};

export default MyApp;
