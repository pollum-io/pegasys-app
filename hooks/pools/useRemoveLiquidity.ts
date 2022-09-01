/* eslint-disable */
// @ts-nocheck
import { abi as IPegasysPairABI } from "@pollum-io/pegasys-protocol/artifacts/contracts/pegasys-core/interfaces/IPegasysPair.sol/IPegasysPair.json";
import { Signer } from "ethers";
import { createContractUsingAbi } from "utils";

export const UseRemoveLiquidity = (signer: Signer) => {
	const pairContract = createContractUsingAbi("", IPegasysPairABI, signer);
	async function onAttemptToApprove() {

		if (!pairContract || !pair || !library || !deadline || !chainId || !account)
			throw new Error("missing dependencies");
		const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
		if (!liquidityAmount) throw new Error("missing liquidity amount");

		if (isArgentWallet) {
			return approveCallback();
		}

		// try to gather a signature for permission
		const nonce = await pairContract.nonces(account);

		const EIP712Domain = [
			{ name: "name", type: "string" },
			{ name: "version", type: "string" },
			{ name: "chainId", type: "uint256" },
			{ name: "verifyingContract", type: "address" },
		];
		const domain = {
			name: "Pegasys LP Token",
			version: "1",
			chainId,
			verifyingContract: pair.liquidityToken.address,
		};
		const Permit = [
			{ name: "owner", type: "address" },
			{ name: "spender", type: "address" },
			{ name: "value", type: "uint256" },
			{ name: "nonce", type: "uint256" },
			{ name: "deadline", type: "uint256" },
		];
		const message = {
			owner: account,
			spender: ROUTER_ADDRESS[chainId],
			value: liquidityAmount.raw.toString(),
			nonce: nonce.toHexString(),
			deadline: deadline.toNumber(),
		};
		const data = JSON.stringify({
			types: {
				EIP712Domain,
				Permit,
			},
			domain,
			primaryType: "Permit",
			message,
		});

		library
			.send("eth_signTypedData_v4", [account, data])
			.then(splitSignature)
			.then(signature => {
				setSignatureData({
					v: signature.v,
					r: signature.r,
					s: signature.s,
					deadline: deadline.toNumber(),
				});
			})
			.catch(error => {
				// for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
				if (error?.code !== 4001) {
					approveCallback();
				}
			});
	}
};
