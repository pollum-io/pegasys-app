import React, { createContext, useEffect, useMemo, useState } from "react";

import { GovernanceServices } from "../services";
import { useWallet } from "../hooks";
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
	const [showCancelled, setShowCancelled] = useState<boolean>(false);
	const [isGovernance, setIsGovernance] = useState<boolean>(false);
	const [votesLocked, setVotesLocked] = useState<boolean>(true);
	const [delegatedTo, setDelegatedTo] = useState<string>("");
	const [votersType, setVotersType] = useState<string>("");
	const [proposals, setProposals] = useState<IFormattedProposal[]>([]);
	const { chainId, provider } = useWallet();

	useEffect(() => {
		const init = async () => {
			try {
				const contract = ContractFramework.GovernanceContract({
					chainId,
					provider,
				});

				const proposalCount = await GovernanceServices.getProposalCount({
					contract,
				});

				const fetchedProposals = await GovernanceServices.getProposals({
					proposalCount,
				});

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
			isGovernance,
			setIsGovernance,
			votesLocked,
			setVotesLocked,
			delegatedTo,
			setDelegatedTo,
			votersType,
			setVotersType,
			proposals,
		}),
		[
			showCancelled,
			setShowCancelled,
			isGovernance,
			setIsGovernance,
			votesLocked,
			setVotesLocked,
			delegatedTo,
			setDelegatedTo,
			votersType,
			setVotersType,
			proposals,
		]
	);

	return (
		<GovernanceContext.Provider value={providerValue}>
			{children}
		</GovernanceContext.Provider>
	);
};
