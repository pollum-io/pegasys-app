import { BigNumber, ethers, utils } from "ethers";
import { governanceClient, GET_PROPOSALS } from "apollo";
import { BIG_INT_ZERO, PegasysTokens } from "pegasys-services/constants";
import { ChainId, JSBI, TokenAmount } from "@pollum-io/pegasys-sdk";
import { ContractFramework, WalletFramework } from "../frameworks";
import {
	IGovernaceServicesGetProposalCount,
	IGovernaceServicesGetProposal,
	IGovernaceServicesCastVote,
	IProposal,
	IFormattedProposal,
	IGovernaceServicesDelegate,
	IGovernaceServicesGetDelegatee,
	IGovernaceServicesGetCurrentVotes,
	IGovernaceServicesGetProposalVotes,
	IProposalVote,
} from "../dto";

class GovernanceServices {
	static async getProposalCount({
		contract,
		chainId,
	}: IGovernaceServicesGetProposalCount): Promise<number> {
		const governanceContract =
			contract ?? ContractFramework.GovernanceContract({ chainId });

		const proposalCount: BigNumber = await ContractFramework.call({
			contract: governanceContract,
			methodName: "proposalCount",
		});

		return proposalCount?.toNumber() ?? 0;
	}

	static async getProposalVotes({
		contract,
		chainId,
		proposalIndex,
	}: IGovernaceServicesGetProposalVotes): Promise<{
		againstVotes: number;
		forVotes: number;
	}> {
		const governanceContract =
			contract ?? ContractFramework.GovernanceContract({ chainId });

		const proposal: { againstVotes: BigNumber; forVotes: BigNumber } =
			await ContractFramework.call({
				contract: governanceContract,
				methodName: "proposals",
				args: [proposalIndex],
			});

		return {
			againstVotes: proposal?.againstVotes
				? parseFloat(
						ethers.utils.formatUnits(proposal.againstVotes.toString(), 18)
				  )
				: 0,
			forVotes: proposal?.forVotes
				? parseFloat(ethers.utils.formatUnits(proposal.forVotes.toString(), 18))
				: 0,
		};
	}

	static async getProposals({
		proposalCount,
	}: IGovernaceServicesGetProposal): Promise<IFormattedProposal[]> {
		const governanceQuery = await governanceClient.query({
			query: GET_PROPOSALS,
			variables: {
				proposalCount,
			},
			fetchPolicy: "network-only",
		});

		const response: IFormattedProposal[] = await Promise.all(
			((governanceQuery.data.proposals as IProposal[]) ?? []).map(
				async ({
					description,
					id,
					proposer,
					status,
					startBlock,
					endBlock,
					signatures,
					calldatas,
					votes,
				}) => {
					const supportVotes: IProposalVote[] = [];
					const notSupportVotes: IProposalVote[] = [];

					votes.forEach(vote => {
						const proposalVote = {
							voter: vote.voter.id,
							votes: Number(vote.votes),
						};

						if (vote.support) {
							supportVotes.push(proposalVote);
						} else {
							notSupportVotes.push(proposalVote);
						}
					});

					const { forVotes, againstVotes } = await this.getProposalVotes({
						proposalIndex: Number(id),
					});

					const signature = signatures[0];

					const [name, types] = signature
						.substr(0, signature.length - 1)
						.split("(");

					const calldata = calldatas[0];

					const decoded = utils.defaultAbiCoder.decode(
						types.split(","),
						calldata
					);

					const initialBlock = await WalletFramework.getBlock(startBlock);
					const finalBlock = await WalletFramework.getBlock(endBlock);

					const endDate = finalBlock
						? new Date(finalBlock.timestamp * 1000)
						: undefined;
					const startDate = new Date(initialBlock.timestamp * 1000);

					const descriptionParts = description?.split("\\n");

					let statusColor;

					switch (status.toLocaleLowerCase()) {
						case "pending":
							statusColor = "#ffff67";
							break;
						case "active":
							statusColor = "#68D391";
							break;
						// case "Canceled":
						// 	break;
						// case "Defeated":
						// 	break;
						case "succeeded":
							statusColor = "#68D391";
							break;
						case "queued":
							statusColor = "#ffff67";
							break;
						// case "Expired":
						// 	break;
						case "executed":
							statusColor = "#68D391";
							break;

						default:
							statusColor = "#FC8181";
							break;
					}

					return {
						id,
						title: descriptionParts[0] ?? "Untitled",
						description: descriptionParts.splice(1) ?? ["No description."],
						proposer: proposer.id,
						status,
						statusColor,
						forVotes,
						againstVotes,
						totalVotes: forVotes + againstVotes,
						startBlock,
						endBlock,
						endDate,
						startDate,
						details: {
							functionSig: name,
							callData: decoded.join(", "),
						},
						supportVotes,
						notSupportVotes,
					};
				}
			)
		);

		return response;
	}

	static async castVote({
		contract,
		chainId,
		proposalIndex,
		support,
	}: IGovernaceServicesCastVote) {
		const governanceContract =
			contract ?? ContractFramework.GovernanceContract({ chainId });

		const res = await ContractFramework.call({
			contract: governanceContract,
			methodName: "castVote",
			args: [proposalIndex, !!support],
		});

		return {
			hash: `${res?.hash}`,
			response: res ?? null,
		};
	}

	static async delegate({
		contract,
		chainId,
		delegatee,
	}: IGovernaceServicesDelegate) {
		if (!delegatee) return { hash: "", response: null };

		const psysContract =
			contract ?? ContractFramework.PSYSContract({ chainId });

		const res = await ContractFramework.call({
			contract: psysContract,
			methodName: "delegate",
			args: [delegatee],
		});

		return {
			hash: `${res?.hash}`,
			response: res ?? null,
		};
	}

	static async getDelegatee({
		contract,
		chainId,
		walletAddress,
	}: IGovernaceServicesGetDelegatee) {
		if (!walletAddress) return "";

		const psysContract =
			contract ?? ContractFramework.PSYSContract({ chainId });

		const res = await ContractFramework.call({
			contract: psysContract,
			methodName: "delegates",
			args: [walletAddress],
		});

		return res;
	}

	static async getCurrentVotes({
		contract,
		chainId,
		walletAddress,
	}: IGovernaceServicesGetCurrentVotes) {
		const psys = PegasysTokens[chainId ?? ChainId.NEVM].PSYS;

		if (!walletAddress) return new TokenAmount(psys, BIG_INT_ZERO);

		const psysContract =
			contract ?? ContractFramework.PSYSContract({ chainId });

		const res: BigNumber = await ContractFramework.call({
			contract: psysContract,
			methodName: "getCurrentVotes",
			args: [walletAddress],
		});

		return new TokenAmount(psys, JSBI.BigInt(res ?? 0));
	}
}

export default GovernanceServices;
