import { InjectedConnector } from "@pollum-io/pegasys-injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const NETWORK_URL = process.env.NEXT_PUBLIC_NETWORK_URL;
const TESTNET_URL = process.env.NEXT_PUBLIC_SYSTESTNET_URL;

if (typeof NETWORK_URL === "undefined") {
	throw new Error(
		`NEXT_PUBLIC_NETWORK_URL must be a defined environment variable`
	);
}

export const injected = new InjectedConnector({
	supportedChainIds: [5700, 57, 2814],
});

export const walletlink = new WalletLinkConnector({
	url: TESTNET_URL || NETWORK_URL,
	appName: "Pegasys",
	appLogoUrl:
		"https://raw.githubusercontent.com/pollum-io/pegasys-tokens/master/tokens/0x32f8199e428117F5A037A56562bbBFca7d5328c9/logo.png",
});

export const walletconnect = new WalletConnectConnector({
	rpc: {
		57: String(NETWORK_URL),
		5700: String(TESTNET_URL),
	},
	qrcode: true,
	bridge: "https://bridge.walletconnect.org/",
});
