import { Token, TokenAmount } from "@pollum-io/pegasys-sdk";
import { Signer } from "ethers";
import { getContract, singleCall } from "utils";

export async function getTokenAllowance(
	token: Token,
	owner: string,
	spender: string,
	signer: Signer
): TokenAmount | undefined {
	const contract = await getContract(token?.address, signer);

	const inputs = [owner, spender];
	const allowance = await singleCall(contract, "allowance");
	const allowanceValue = await allowance(inputs[0], inputs[1]);

	return token && allowance
		? new TokenAmount(token, allowanceValue.toString())
		: undefined;
}
