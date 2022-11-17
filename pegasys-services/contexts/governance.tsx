import React, { createContext, useEffect, useMemo, useState } from "react";

import { ChainId } from "@pollum-io/pegasys-sdk";
import { tryParseAmount, addTransaction } from "utils";
import { GovernanceServices } from "../services";
import { useWallet, useTransaction, useToasty } from "../hooks";
import {
	IGovernanceProviderValue,
	IGovernanceProviderProps,
	IFormattedProposal,
	ApprovalState,
} from "../dto";
import { ContractFramework } from "../frameworks";

export const GovernanceContext = createContext({} as IGovernanceProviderValue);

export const GovernanceProvider: React.FC<IGovernanceProviderProps> = ({
	children,
}) => {
	const [showCancelled, setShowCancelled] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [votesLocked, setVotesLocked] = useState<boolean>(true);
	const [delegatedTo, setDelegatedTo] = useState<string>("");
	const [votersType, setVotersType] = useState<string>("");
	const [proposals, setProposals] = useState<IFormattedProposal[]>([]);
	const [selectedProposals, setSelectedProposals] =
		useState<IFormattedProposal | null>(null);
	const { chainId, provider, address } = useWallet();
	const { setTransactions, transactions, setCurrentTxHash, setApprovalState } =
		useTransaction();
	const { toast } = useToasty();

	const governanceContract = useMemo(() => {
		const contract = ContractFramework.GovernanceContract({
			chainId,
			provider,
		});

		return contract;
	}, [chainId]);

	const psysContract = useMemo(() => {
		const contract = ContractFramework.PSYSContract({
			chainId,
		});

		return contract;
	}, [chainId]);

	const contractCall = async (
		promise: () => Promise<{
			hash: string;
			response: any;
		}>,
		summary: string,
		type: string
	) => {
		try {
			setLoading(true);

			const res = await promise();

			if (res) {
				const { response, hash } = res;

				const walletInfo = {
					walletAddress: address,
					chainId: ChainId.NEVM,
					provider,
				};

				addTransaction(response, walletInfo, setTransactions, transactions, {
					summary,
					finished: false,
				});
				setCurrentTxHash(hash);

				setApprovalState({
					type,
					status: ApprovalState.PENDING,
				});
			}
		} catch (e) {
			toast({
				id: `${type}Toast`,
				position: "top-right",
				status: "error",
				title: `Error on ${summary}`,
			});

			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	const onDelegate = async (delegatee?: string) => {
		await contractCall(
			() =>
				GovernanceServices.delegate({
					contract: psysContract,
					delegatee: delegatee ?? address,
				}),
			"Delegate Votes",
			"delegate-governance"
		);
	};

	const vote = async (id: string, support?: boolean) => {
		await contractCall(
			() =>
				GovernanceServices.castVote({
					contract: governanceContract,
					proposalIndex: Number(id),
					support,
				}),
			"Vote",
			"vote-governance"
		);
	};

	useEffect(() => {
		const init = async () => {
			try {
				const proposalCount = await GovernanceServices.getProposalCount({
					contract: governanceContract,
				});
				console.log("proposalCount", proposalCount);

				const fetchedProposals = await GovernanceServices.getProposals({
					proposalCount,
				});
				console.log("fetchedProposals", fetchedProposals);

				if (fetchedProposals.length) {
					setProposals(fetchedProposals);
				}
			} catch (e) {
				console.log(e);
			}
		};

		init();
	}, []);

	const providerValue = useMemo(
		() => ({
			showCancelled,
			setShowCancelled,
			// isGovernance,
			// setIsGovernance,
			votesLocked,
			setVotesLocked,
			delegatedTo,
			setDelegatedTo,
			votersType,
			setVotersType,
			proposals,
			selectedProposals,
			setSelectedProposals,
			vote,
			onDelegate,
			loading,
		}),
		[
			showCancelled,
			setShowCancelled,
			// isGovernance,
			// setIsGovernance,
			votesLocked,
			setVotesLocked,
			delegatedTo,
			setDelegatedTo,
			votersType,
			setVotersType,
			proposals,
			selectedProposals,
			setSelectedProposals,
			vote,
			onDelegate,
			loading,
		]
	);

	return (
		<GovernanceContext.Provider value={providerValue}>
			{children}
		</GovernanceContext.Provider>
	);
};
