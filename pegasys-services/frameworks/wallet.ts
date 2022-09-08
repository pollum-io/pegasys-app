import { ethers } from "ethers";
import { CurrencyAmount } from "@pollum-io/pegasys-sdk";

import { TSigner, TProvider, IWalletFrameworkConnectionInfo } from "../dto";
import { PoolServices } from "../services";

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

		const signer = this.getSigner(provider);

		const connectionInfo = await this.getConnectionInfo(provider, signer);

		return connectionInfo;
	}

	static async getConnectionInfo(
		p?: TProvider,
		s?: TSigner
	): Promise<IWalletFrameworkConnectionInfo> {
		// const currencyAmount = new CurrencyAmount();

		// await PoolServices.approveAddLiquidity();

		const provider = p ?? this.getProvider();

		if (provider) {
			const signer = s ?? this.getSigner(provider);

			if (signer) {
				const address = await this.getAddress(signer);

				const chainId = await this.getChain(provider);

				return { address: address ?? 0, chainId: chainId ?? 0 };
			}
		}

		return { address: "", chainId: 0 };
	}

	static async getChain(p?: TProvider): Promise<number | undefined> {
		const provider = p ?? this.getProvider();

		const res = await provider?.getNetwork();

		return res ? res.chainId : undefined;
	}

	static async getAddress(s?: TSigner, p?: TProvider): Promise<string> {
		const provider = p ?? this.getProvider();

		if (provider) {
			const accounts = await provider.listAccounts();

			if (accounts.length) {
				return accounts[0];
			}
			// const signer = s ?? this.getSigner();

			// if (signer) {
			// 	const address = await signer.getAddress();

			// 	return getAddress(address);
			// }
		}

		return "";
	}

	static getSignerOrProvider(): TSigner | TProvider | undefined {
		const provider = this.getProvider();

		const signer = this.getSigner(provider);

		return signer ?? provider;
	}

	// static getProvider(): TProvider | undefined {
	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	const { ethereum } = window as any;

	// 	const provider = new ethers.providers.Web3Provider(ethereum);

	// 	return provider;
	// }

	// static getSigner(p?: TProvider): TSigner | undefined {
	// 	const provider = p ?? this.getProvider();

	// 	const signer = provider?.getSigner();

	// 	return signer;
	// }

	// static async connect(): Promise<IWalletFrameworkConnectionInfo> {
	// 	const provider = this.getProvider();

	// 	await provider?.send("eth_requestAccounts", []);

	// 	const signer = this.getSigner(provider);

	// 	const connectionInfo = await this.getConnectionInfo(provider, signer);

	// 	return connectionInfo;
	// }

	// static async getConnectionInfo(
	// 	p?: TProvider,
	// 	s?: TSigner
	// ): Promise<IWalletFrameworkConnectionInfo> {
	// 	const provider = p ?? this.getProvider();

	// 	provider?.send("eth_accounts", []);

	// 	const signer = s ?? this.getSigner(provider);

	// 	// if (!signer) {
	// 	// 	await this.connect();
	// 	// }

	// 	const address = await this.getAddress(signer);

	// 	const chainId = await this.getChain(provider);

	// 	return { address, chainId };
	// }

	// static async getChain(p?: TProvider): Promise<number> {
	// 	const provider = p ?? this.getProvider();

	// 	const { chainId } = await provider.getNetwork();

	// 	return chainId;
	// }

	// static async getAddress(s?: TSigner): Promise<string> {
	// 	if (s) {
	// 		const address = await s.getAddress();

	// 		return getAddress(address);
	// 	}

	// 	const provider = this.getProvider();

	// 	const accounts = await provider?.listAccounts();

	// 	if (accounts?.length) {
	// 		return accounts[0];
	// 	}

	// 	return "";

	// 	// const connectionInfo = await this.connect();

	// 	// return connectionInfo.address;
	// }

	// static getSignerOrProvider(): TSigner | TProvider {
	// 	const provider = this.getProvider();

	// 	const signer = this.getSigner(provider);

	// 	return signer ?? provider;
	// }
}

export default WalletFramework;
