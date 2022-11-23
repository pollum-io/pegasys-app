import React, { createContext, useEffect, useMemo, useState } from "react";

import { ChainId, TokenAmount } from "@pollum-io/pegasys-sdk";
import { addTransaction } from "utils";
import { ZERO_ADDRESS } from "../constants";
import { GovernanceServices } from "../services";
import { useWallet, useTransaction, useToasty } from "../hooks";
import {
	IGovernanceProviderValue,
	IGovernanceProviderProps,
	IFormattedProposal,
	ApprovalState,
} from "../dto";
import { ContractFramework, PersistentFramework } from "../frameworks";

export const GovernanceContext = createContext({} as IGovernanceProviderValue);

export const GovernanceProvider: React.FC<IGovernanceProviderProps> = ({
	children,
}) => {
	const [showCancelled, setShowCancelled] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [dataLoading, setDataLoading] = useState<boolean>(false);
	const [votesLocked, setVotesLocked] = useState<boolean>(true);
	const [delegatedTo, setDelegatedTo] = useState<string>("");
	const [votersType, setVotersType] = useState<string>("");
	const [proposals, setProposals] = useState<IFormattedProposal[]>([]);
	const [currentVotes, setCurrentVotes] = useState<TokenAmount | null>(null);
	const [selectedProposals, setSelectedProposals] =
		useState<IFormattedProposal | null>(null);
	const { chainId, provider, address } = useWallet();
	const { setTransactions, transactions, setCurrentTxHash, setApprovalState } =
		useTransaction();
	const { toast } = useToasty();

	const governanceContract = useMemo(() => {
		const contract = ContractFramework.GovernanceContract({
			chainId,
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
		} finally {
			setLoading(false);
		}
	};

	const onDelegate = async (delegatee?: string) => {
		if (delegatee) {
			if (delegatee === ZERO_ADDRESS) {
				PersistentFramework.remove("governancePersistence");
			} else {
				PersistentFramework.add("governancePersistence", { delegatee });
			}
		} else {
			PersistentFramework.add("governancePersistence", { delegatee: "Self" });
		}

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

	const getCurrentVotes = async () => {
		const crrVotes = await GovernanceServices.getCurrentVotes({
			contract: psysContract,
			walletAddress: address,
		});

		setCurrentVotes(crrVotes);
	};

	useEffect(() => {
		if (address) {
			getCurrentVotes();
		}
	}, [address]);

	useEffect(() => {
		const init = async () => {
			try {
				setDataLoading(true);
				const governancePersistence: { [k: string]: any } | undefined =
					PersistentFramework.get("governancePersistence");

				if (governancePersistence?.delegatee) {
					setVotesLocked(false);
					setDelegatedTo(
						governancePersistence.delegatee === "Self"
							? "Self"
							: governancePersistence.delegatee
					);
				}

				const fetchedProposals = await GovernanceServices.getProposals({
					governanceContract,
				});

				if (fetchedProposals.length) {
					setProposals(fetchedProposals);
				}
			} catch (e) {
				toast({
					id: `fetchedProposalsToast`,
					position: "top-right",
					status: "error",
					title: `Error while fetching proposals`,
				});
				console.log(e);
			} finally {
				setDataLoading(false);
			}
		};

		init();
	}, []);

	const providerValue = useMemo(
		() => ({
			showCancelled,
			setShowCancelled,
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
			currentVotes,
			dataLoading,
		}),
		[
			showCancelled,
			setShowCancelled,
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
			currentVotes,
			dataLoading,
		]
	);

	return (
		<GovernanceContext.Provider value={providerValue}>
			{children}
		</GovernanceContext.Provider>
	);
};
