import { ChainId } from "@pollum-io/pegasys-sdk";
import { BigNumber, ethers } from "ethers";
import { getAddress, splitSignature } from "ethers/lib/utils";
import { NETWORKS_CHAIN_PARAMS } from "../constants";

import {
	TSigner,
	TProvider,
	IWalletFrameworkConnectionInfo,
	TContract,
} from "../dto";
import ContractFramework from "./contract";

class WalletFramework {
	static getRpcProvider(chainId?: ChainId): TProvider {
		const provider = new ethers.providers.JsonRpcProvider(
			NETWORKS_CHAIN_PARAMS[chainId ?? ChainId.NEVM].rpcUrls[0]
		);

		return provider;
	}

	static getProvider(): TProvider {
		// eslint-disable-next-line
		const { ethereum } = window as any;

		let provider: TProvider = new ethers.providers.Web3Provider(
			ethereum,
			"any"
		);

		if (!provider) {
			provider = this.getRpcProvider();
		}

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

		const signer = this.getSigner(provider);

		return { address, chainId: chainId ?? ChainId.NEVM, signer, provider };
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
				return getAddress(accounts[0]);
			}
		}

		return "";
	}

	static getSignerOrProvider(): TSigner | TProvider | undefined {
		const provider = this.getProvider();

		const signer = this.getSigner(provider);

		return signer ?? provider;
	}

	static async getBlock(blockNumber: string) {
		const provider = this.getProvider();

		const block = await provider.getBlock(Number(blockNumber));

		return block;
	}

	static async getSignature({
		address,
		userDeadline,
		contract,
		value,
		version,
		chainId,
		name,
		spender,
		verifyingContract,
	}: {
		address: string;
		userDeadline: number | BigNumber;
		value: string;
		contract: TContract;
		version?: string;
		chainId: ChainId | null;
		name: string;
		spender: string;
		verifyingContract: string;
	}) {
		const nonce = await ContractFramework.call({
			contract,
			methodName: "nonces",
			args: [address],
		});

		const deadline = BigNumber.from(
			Math.floor(new Date().getTime() / 1000)
		).add(userDeadline);

		const message = {
			owner: address,
			spender,
			value,
			nonce: nonce.toHexString(),
			deadline: deadline.toNumber(),
		};

		const EIP712Domain = version
			? [
					{ name: "name", type: "string" },
					{ name: "version", type: "string" },
					{ name: "chainId", type: "uint256" },
					{ name: "verifyingContract", type: "address" },
			  ]
			: [
					{ name: "name", type: "string" },
					{ name: "chainId", type: "uint256" },
					{ name: "verifyingContract", type: "address" },
			  ];

		const domain: {
			name: string;
			chainId: number;
			verifyingContract: string;
			version?: string;
		} = {
			name,
			chainId: chainId ?? ChainId.NEVM,
			verifyingContract: getAddress(verifyingContract),
		};

		if (version) {
			domain.version = version;
		}

		const Permit = [
			{ name: "owner", type: "address" },
			{ name: "spender", type: "address" },
			{ name: "value", type: "uint256" },
			{ name: "nonce", type: "uint256" },
			{ name: "deadline", type: "uint256" },
		];

		const data = JSON.stringify({
			types: {
				EIP712Domain,
				Permit,
			},
			domain,
			primaryType: "Permit",
			message,
		});

		const provider = WalletFramework.getProvider();

		const signatureRes = await provider?.send("eth_signTypedData_v4", [
			address,
			data,
		]);

		const signature = splitSignature(signatureRes);

		return {
			v: signature.v,
			r: signature.r,
			s: signature.s,
			deadline,
		};
	}
}

export default WalletFramework;
