import React, { createContext, useEffect, useMemo, useState } from "react";

import { TokenAmount } from "@pollum-io/pegasys-sdk";
import { PegasysContracts, ZERO_ADDRESS } from "../constants";
import { GovernanceServices } from "../services";
import { useWallet, useTransaction, useToasty } from "../hooks";
import {
	IGovernanceProviderValue,
	IGovernanceProviderProps,
	IFormattedProposal,
} from "../dto";
import { ContractFramework } from "../frameworks";

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
	const { chainId, address } = useWallet();
	const { addTransactions } = useTransaction();
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
		let error: undefined | boolean;

		try {
			setLoading(true);

			const res = await promise();

			if (res) {
				const { hash } = res;

				addTransactions({
					hash,
					service: type,
					summary,
				});
			}
		} catch (e) {
			toast({
				id: `${type}Toast`,
				position: "top-right",
				status: "error",
				title: `Error on ${summary}`,
			});

			error = true;
		} finally {
			setLoading(false);
		}
		return { error };
	};

	const onDelegate = async (delegatee?: string) => {
		const { error } = await contractCall(
			() =>
				GovernanceServices.delegate({
					contract: psysContract,
					delegatee: delegatee ?? address,
				}),
			"Delegate Votes",
			"delegate-governance"
		);

		if (!error) {
			if (delegatee === ZERO_ADDRESS) {
				setDelegatedTo("");
				setVotesLocked(true);
			} else {
				setVotesLocked(false);
				setDelegatedTo(delegatee ?? "Self");
			}
		}
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
		const handleDelegatee = async () => {
			const currentDelegatee = await GovernanceServices.getDelegatee({
				contract: psysContract,
				walletAddress: address,
			});

			if (!currentDelegatee) {
				setVotesLocked(true);
				setDelegatedTo("");
				return;
			}

			setVotesLocked(false);
			setDelegatedTo(currentDelegatee === address ? "Self" : currentDelegatee);
		};

		if (address) {
			handleDelegatee();
		}
	}, [psysContract, address]);

	useEffect(() => {
		const init = async () => {
			try {
				setDataLoading(true);

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

		if (chainId && PegasysContracts[chainId]?.GOVERNANCE_ADDRESS) {
			init();
		}
	}, [governanceContract]);

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
