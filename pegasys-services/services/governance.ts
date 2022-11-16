import { BigNumber, utils } from "ethers";
import { governanceClient, GET_PROPOSALS } from "apollo";
import { ContractFramework } from "../frameworks";
import {
	IGovernaceServicesGetProposalCount,
	IGovernaceServicesGetProposal,
	IGovernaceServicesCastVote,
	IProposal,
	IFormattedProposal,
	IGovernaceServicesDelegate,
	IGovernaceServicesGetDelegatee,
	IGovernaceServicesGetCurrentVotes,
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

		const response: IFormattedProposal[] = (
			(governanceQuery.data.proposals as IProposal[]) ?? []
		).map(
			({
				description,
				id,
				proposer,
				status,
				votes,
				startBlock,
				endBlock,
				signatures,
				calldatas,
			}) => {
				const forVotes = votes.filter(({ support }) => support);

				const signature = signatures[0];

				const [name, types] = signature
					.substr(0, signature.length - 1)
					.split("(");

				const calldata = calldatas[0];

				const decoded = utils.defaultAbiCoder.decode(
					types.split(","),
					calldata
				);

				return {
					id,
					title: description?.split(/# |\n/g)[1] || "Untitled",
					description: description ?? "No description.",
					proposer: proposer.id,
					status,
					forCount: forVotes.length,
					againstCount: votes.length - forVotes.length,
					startBlock,
					endBlock,
					details: {
						functionSig: name,
						callData: decoded.join(", "),
					},
				};
			}
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
		provider,
		chainId,
		delegatee,
	}: IGovernaceServicesDelegate) {
		if (!delegatee) return { hash: "", response: null };

		const psysContract =
			contract ?? ContractFramework.PSYSContract({ chainId, provider });

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
