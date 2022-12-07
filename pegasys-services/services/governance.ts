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
	IGovernaceServicesGetQuorumCount,
	IProposalVote,
} from "../dto";

class GovernanceServices {
	static async getQuorumCount({
		contract,
		chainId,
	}: IGovernaceServicesGetQuorumCount): Promise<number> {
		const governanceContract =
			contract ?? ContractFramework.GovernanceContract({ chainId });

		const quorumCount: BigNumber = await ContractFramework.call({
			contract: governanceContract,
			methodName: "quorumVotes",
		});

		return quorumCount
			? parseInt(ethers.utils.formatUnits(quorumCount.toString(), 18), 10)
			: 0;
	}

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
				? parseInt(
						ethers.utils.formatUnits(proposal.againstVotes.toString(), 18),
						10
				  )
				: 0,
			forVotes: proposal?.forVotes
				? parseInt(
						ethers.utils.formatUnits(proposal.forVotes.toString(), 18),
						10
				  )
				: 0,
		};
	}

	static async getProposals({
		governanceContract,
	}: IGovernaceServicesGetProposal): Promise<IFormattedProposal[]> {
		return [];

		const quorumCount = await this.getQuorumCount({
			contract: governanceContract,
		});
		const proposalCount = await this.getProposalCount({
			contract: governanceContract,
		});

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
					targets,
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

					status =
						endDate &&
						forVotes < quorumCount &&
						status.toLocaleLowerCase() === "active"
							? "DEFEATED"
							: status;

					let statusColor;

					switch (status.toLocaleLowerCase()) {
						case "executed":
							statusColor = "#68D391";
							break;

						case "defeated":
							statusColor = "#FC8181";
							break;

						case "cancelled":
							statusColor = "grey";
							break;

						default:
							statusColor = "#F3841E";
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
						forVotesQuorumPercentage: (forVotes * 100) / quorumCount,
						againstVotes,
						againstVotesQuorumPercentage: (againstVotes * 100) / quorumCount,
						quorumCount,
						startBlock,
						endBlock,
						endDate,
						startDate,
						details: {
							functionSig: name,
							callData: decoded.join(", "),
							target: targets[0],
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
