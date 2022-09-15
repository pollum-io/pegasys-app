import { ethers } from "ethers";

import { TSigner, TProvider, IWalletFrameworkConnectionInfo } from "../dto";

class WalletFramework {
	static getProvider(): TProvider | undefined {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { ethereum } = window as any;

		const provider = new ethers.providers.Web3Provider(ethereum);

		return provider;
	}

	static getSigner(p?: TProvider): TSigner | undefined {
		const provider = p ?? this.getProvider();

		const signer = provider?.getSigner();

		return signer;
	}

	static async connect(): Promise<IWalletFrameworkConnectionInfo> {
		const provider = this.getProvider();

		await provider?.send("eth_requestAccounts", []);

		const connectionInfo = await this.getConnectionInfo(provider);

		return connectionInfo;
	}

	static async getConnectionInfo(
		p?: TProvider
	): Promise<IWalletFrameworkConnectionInfo> {
		const provider = p ?? this.getProvider();

		const address = await this.getAddress();

		const chainId = await this.getChain(provider);

		return { address: address ?? 0, chainId: chainId ?? 0 };
	}

	static async getChain(p?: TProvider): Promise<number | undefined> {
		const provider = p ?? this.getProvider();

		const res = await provider?.getNetwork();

		return res ? res.chainId : undefined;
	}

	static async getAddress(p?: TProvider): Promise<string> {
		const provider = p ?? this.getProvider();

		if (provider) {
			const accounts = await provider.listAccounts();

			if (accounts.length) {
				return accounts[0];
			}
		}

		return "";
	}

	static getSignerOrProvider(): TSigner | TProvider | undefined {
		const provider = this.getProvider();

		const signer = this.getSigner(provider);

		return signer ?? provider;
	}
}

export default WalletFramework;
