import Head from "next/head";
import type { AppProps } from "next/app";
import { ColorHandler } from "utils";
import "../styles/backgroundStars.css";
import "styles/style.css";
import "styles/psysAnimation.css";

const MyApp = ({ Component, pageProps }: AppProps) => (
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
			<Component {...pageProps} />
		</ColorHandler>
	</>
);

export default MyApp;
