import React, { useEffect, createContext, useMemo, useState } from "react";
import { ChainId } from "@pollum-io/pegasys-sdk";

import { PSYS, STAKE_ADDRESS } from "pegasys-services/constants";
import { ContractFramework } from "pegasys-services/frameworks";
import { useWallet } from "hooks";
import { addTransaction } from "utils";
import { ApprovalState } from "contexts";
import { StakeServices } from "../services";
import { useWallet as psUseWallet, useEarn } from "../hooks";
import { IStakeProviderProps, IStakeProviderValue } from "../dto";
import { EarnProvider } from "./earn";

export const StakeContext = createContext({} as IStakeProviderValue);

const Provider: React.FC<IStakeProviderProps> = ({ children }) => {
	const [showInUsd, setShowInUsd] = useState<boolean>(false);
	const {
		provider,
		setTransactions,
		transactions,
		setCurrentTxHash,
		setApprovalState,
	} = useWallet();
	const { chainId, address } = psUseWallet();
	const {
		signature,
		onSign,
		getTypedValue,
		selectedOpportunity,
		setEarnOpportunities,
	} = useEarn();

	const walletInfo = {
		walletAddress: address,
		chainId,
		provider,
	};

	const unstake = async () => {
		const typedValue = getTypedValue();

		if (selectedOpportunity && typedValue) {
			let method = StakeServices.unstake;

			if (typedValue.isAllIn) {
				method = StakeServices.unstakeAndClaim;
			}

			await method(typedValue.value.toString(16)).then(({ response, hash }) => {
				addTransaction(response, walletInfo, setTransactions, transactions, {
					summary: "Withdraw deposited liquidity",
					finished: false,
				});
				setCurrentTxHash(hash);
				setApprovalState({ type: "unstake", status: ApprovalState.PENDING });
			});
		}
	};

	const claim = async () => {
		if (selectedOpportunity) {
			await StakeServices.claim().then(({ response, hash }) => {
				addTransaction(response, walletInfo, setTransactions, transactions, {
					summary: "Claim accumulated PSYS rewards",
					finished: false,
				});
				setCurrentTxHash(hash);
				setApprovalState({ type: "claim", status: ApprovalState.PENDING });
			});
		}
	};

	const stake = async () => {
		const typedValue = getTypedValue(true);

		if (selectedOpportunity && typedValue && signature) {
			await StakeServices.stake(typedValue.value.toString(16), signature).then(
				({ response, hash }) => {
					addTransaction(response, walletInfo, setTransactions, transactions, {
						summary: "Stake PSYS tokens",
						finished: false,
					});
					setCurrentTxHash(hash);
					setApprovalState({ type: "claim", status: ApprovalState.PENDING });
				}
			);
		}
	};

	const sign = async () => {
		if (selectedOpportunity) {
			const contract = ContractFramework.PSYSContract(chainId);

			await onSign(
				contract,
				"Pegasys",
				STAKE_ADDRESS,
				PSYS[chainId as ChainId].address
			);
		}
	};

	useEffect(() => {
		if (address && chainId) {
			const getStakes = async () => {
				const stakeInfo = await StakeServices.getStakeInfos(address, chainId);

				setEarnOpportunities([stakeInfo]);
			};

			getStakes();
		}
	}, [address, chainId]);

	const providerValue = useMemo(
		() => ({
			claim,
			sign,
			stake,
			unstake,
			showInUsd,
			setShowInUsd,
		}),
		[sign, claim, stake, unstake, showInUsd, setShowInUsd]
	);

	return (
		<StakeContext.Provider value={providerValue}>
			{children}
		</StakeContext.Provider>
	);
};

export const StakeProvider: React.FC<IStakeProviderProps> = props => (
	<EarnProvider>
		<Provider {...props} />
	</EarnProvider>
);
