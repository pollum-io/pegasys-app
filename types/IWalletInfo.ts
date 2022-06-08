import { AbstractConnector } from "@web3-react/abstract-connector";

export interface IWalletInfo {
	connector?: AbstractConnector;
	name?: string;
	iconName?: string;
	description?: string;
	href?: string | null;
	color?: string;
	primary?: true;
	mobile?: true;
	mobileOnly?: true;
}
