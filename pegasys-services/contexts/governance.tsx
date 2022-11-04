import React, { createContext, useMemo, useState } from "react";

import { IGovernanceProviderValue, IGovernanceProviderProps } from "../dto";

export const GovernanceContext = createContext({} as IGovernanceProviderValue);

export const GovernanceProvider: React.FC<IGovernanceProviderProps> = ({
	children,
}) => {
	const [showCancelled, setShowCancelled] = useState<boolean>(false);
	const [isGovernance, setIsGovernance] = useState<boolean>(false);
	const [votesLocked, setVotesLocked] = useState<boolean>(true);
	const [delegatedTo, setDelegatedTo] = useState<string>("");
	const [votersType, setVotersType] = useState<string>("");

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
		]
	);

	return (
		<GovernanceContext.Provider value={providerValue}>
			{children}
		</GovernanceContext.Provider>
	);
};
