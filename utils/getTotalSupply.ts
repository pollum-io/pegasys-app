import {
	JsonRpcProvider,
	Provider,
	Web3Provider,
} from "@ethersproject/providers";
import { Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import abi20 from "utils/abis/erc20.json";
import { getContract } from "./getContract";
import { singleCallWithoutParams } from "./singleCall";

export async function getTotalSupply(
	token: Token,
	signer: Signer,
	provider: Signer | JsonRpcProvider | Web3Provider | Provider | undefined
) {
	// eslint-disable-next-line
	// @ts-ignore
	const code = provider && (await provider?.getCode(token?.address));
	if (code === "0x") {
		return new TokenAmount(token, "1");
	}

	const contract = await getContract(token?.address, provider as Signer, abi20);

	const fetchTotalSupply =
		contract && (await singleCallWithoutParams(contract, "totalSupply"));

	const totalSupply = await fetchTotalSupply();

	return token && totalSupply
		? new TokenAmount(token, totalSupply.toString())
		: undefined;
}
