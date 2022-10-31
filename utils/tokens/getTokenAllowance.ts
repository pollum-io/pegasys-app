import { Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { Signer, Contract } from "ethers";
import { getContract, singleCallWithoutParams } from "utils";
import abi20 from "utils/abis/erc20.json";

export async function getTokenAllowance(
	token: Token,
	owner: string,
	spender: string,
	signer: Signer
): Promise<TokenAmount | undefined | null> {
	if (token) {
		const contract = await getContract(token?.address, signer, abi20);
		const inputs = [owner, spender];
		const allowance = await singleCallWithoutParams(
			contract as Contract,
			"allowance"
		);
		const allowanceValue = await allowance(inputs[0], inputs[1]);
		if (allowanceValue && token) {
			return new TokenAmount(token, allowanceValue.toString());
		}
		return undefined;
	}
	return null;
}
