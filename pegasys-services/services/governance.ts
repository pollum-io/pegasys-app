import { BigNumber, ethers, utils } from "ethers";
import { governanceClient, GET_PROPOSALS } from "apollo";
import { JSBI } from "@pollum-io/pegasys-sdk";
import { BIG_INT_ZERO } from "pegasys-services/constants";
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
		provider,
		chainId,
	}: IGovernaceServicesGetProposalCount): Promise<number> {
		const governanceContract =
			contract ?? ContractFramework.GovernanceContract({ chainId, provider });

		const proposalCount: BigNumber = await ContractFramework.call({
			contract: governanceContract,
			methodName: "proposalCount",
		});

		return proposalCount?.toNumber() ?? 0;
	}

	static async getProposalVotes({
		contract,
		provider,
		chainId,
		proposalIndex,
	}: IGovernaceServicesGetProposalVotes): Promise<{
		againstVotes: number;
		forVotes: number;
	}> {
		const governanceContract =
			contract ?? ContractFramework.GovernanceContract({ chainId, provider });

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

					const { timestamp } = await WalletFramework.getBlock(endBlock);

					const date = new Date(timestamp * 1000);

					const descriptionParts = description?.split("\\n");

					return {
						id,
						title: descriptionParts[0] ?? "Untitled",
						description: descriptionParts.splice(1) ?? ["No description."],
						proposer: proposer.id,
						status,
						forVotes,
						againstVotes,
						totalVotes: forVotes + againstVotes,
						startBlock,
						endBlock,
						date,
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
		provider,
		chainId,
		proposalIndex,
		support,
	}: IGovernaceServicesCastVote) {
		const governanceContract =
			contract ?? ContractFramework.GovernanceContract({ chainId, provider });

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
		provider,
		chainId,
		walletAddress,
	}: IGovernaceServicesGetDelegatee) {
		if (!walletAddress) return "";

		const psysContract =
			contract ?? ContractFramework.PSYSContract({ chainId, provider });

		const res = await ContractFramework.call({
			contract: psysContract,
			methodName: "delegates",
			args: [walletAddress],
		});

		return res;
	}

	static async getCurrentVotes({
		contract,
		provider,
		chainId,
		walletAddress,
	}: IGovernaceServicesGetCurrentVotes) {
		if (!walletAddress) return 0;

		const psysContract =
			contract ?? ContractFramework.PSYSContract({ chainId, provider });

		const res = await ContractFramework.call({
			contract: psysContract,
			methodName: "getCurrentVotes",
			args: [walletAddress],
		});

		return res;
	}
}

export default GovernanceServices;
