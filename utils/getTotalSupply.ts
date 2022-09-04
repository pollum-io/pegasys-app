import { Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import abi20 from "utils/abis/erc20.json";
import { getContract } from "./getContract";
import { singleCall } from "./singleCall";

export async function getTotalSupply(token: Token, signer: Signer) {
	const contract = await getContract(token?.address, signer, abi20);

	const fetchTotalSupply =
		contract && (await singleCall(contract, "totalSupply"));

	const totalSupply = await fetchTotalSupply();

	return token && totalSupply
		? new TokenAmount(token, totalSupply.toString())
		: undefined;
}
