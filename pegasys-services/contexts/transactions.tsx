import { ChainId } from "@pollum-io/pegasys-sdk";
import React, { createContext, useEffect, useMemo, useState } from "react";

import { PersistentFramework } from "../frameworks";
import {
	ITransactionProviderValue,
	ITransactionProviderProps,
	IPendingTxs,
	IPendingTx,
	IPersistentPendingTx,
	IFinishedTx,
	IFinishedTxs,
	IPersistentFinishedTx,
} from "../dto";
import { useWallet } from "../hooks";

export const TransactionContext = createContext(
	{} as ITransactionProviderValue
);

export const TransactionProvider: React.FC<ITransactionProviderProps> = ({
	children,
}) => {
	const [pendingTxs, setPendingTxs] = useState<IPendingTxs>([]);
	const [finishedTxs, setFinishedTxs] = useState<IFinishedTxs>([]);
	const [currentTimer, setCurrentTimer] = useState<NodeJS.Timer>(
		setInterval(() => {}, 0)
	);

	const { chainId, isConnected, address, provider } = useWallet();

	const removePendingTransactions = (hash: string) => {
		if (!chainId || !address) return;

		const persistentKey = "pegasysPendingTransactions";

		const persistTxs = PersistentFramework.get(persistentKey);

		if (!persistTxs) {
			return;
		}

		const newTransactions = (persistTxs as IPersistentPendingTx[]).filter(
			tx => tx.hash !== hash
		);

		PersistentFramework.add(persistentKey, newTransactions);

		setPendingTxs(
			newTransactions
				.filter(tx => tx.walletAddress === address && tx.chainId === chainId)
				.map(tx => ({
					hash: tx.hash,
					service: tx.service,
					summary: tx.summary,
				}))
		);
	};

	const addTransactions = (
		tx: IPendingTx | IFinishedTx,
		finished?: boolean
	) => {
		if (!address || !chainId) return;

		let newPersistTransactions: any[] = [];

		const persistentKey = finished
			? "pegasysFinishedTransactions"
			: "pegasysPendingTransactions";

		const persistTxs = PersistentFramework.get(persistentKey);

		if (persistTxs) {
			newPersistTransactions = persistTxs as any[];
		}

		if (newPersistTransactions.find(persistTx => persistTx.hash === tx.hash))
			return;

		if (finished) {
			removePendingTransactions(tx.hash);
			setFinishedTxs([
				...newPersistTransactions
					.filter(tx => tx.walletAddress === address && tx.chainId === chainId)
					.map(tx => ({
						hash: tx.hash,
						success: tx.success,
						summary: tx.summary,
					})),
				tx as IFinishedTx,
			]);
		} else {
			setPendingTxs([
				...newPersistTransactions
					.filter(tx => tx.walletAddress === address && tx.chainId === chainId)
					.map(tx => ({
						hash: tx.hash,
						service: tx.service,
						summary: tx.summary,
					})),
				tx as IPendingTx,
			]);
		}

		newPersistTransactions.push({
			...tx,
			walletAddress: address,
			chainId,
		});

		PersistentFramework.add(persistentKey, newPersistTransactions);
	};

	const clearAll = () => {
		PersistentFramework.remove("pegasysFinishedTransactions");
		PersistentFramework.remove("pegasysPendingTransactions");
		setFinishedTxs([]);
		setPendingTxs([]);
	};

	const timeValue = useMemo(
		() => (chainId === ChainId.ROLLUX ? 3000 : 10000),
		[chainId]
	);

	useEffect(() => {
		clearInterval(currentTimer);

		if (chainId && isConnected && pendingTxs.length) {
			const timer = setInterval(async () => {
				await Promise.all(
					pendingTxs.map(async currTx => {
						const tx = await provider?.getTransaction(currTx.hash);

						if (!tx) {
							console.log("remove 1");
							removePendingTransactions(currTx.hash);
							return;
						}

						if (
							tx.from.toLowerCase() === address.toLowerCase() &&
							tx.confirmations !== 0
						) {
							// removePendingTransactions(currTx.hash);

							addTransactions(
								{
									summary: currTx.summary,
									hash: currTx.hash,
									success: tx.confirmations === 1,
								},
								true
							);
						}
					})
				);
			}, timeValue);

			setCurrentTimer(timer);
		}
	}, [pendingTxs]);

	useEffect(() => {
		if (chainId && address) {
			const persistPendingTxs = PersistentFramework.get(
				"pegasysPendingTransactions"
			);

			if (persistPendingTxs) {
				const walletTxs = (persistPendingTxs as IPersistentPendingTx[]).filter(
					tx => tx.walletAddress === address && tx.chainId === chainId
				);

				setPendingTxs(
					walletTxs.map(tx => ({
						hash: tx.hash,
						summary: tx.summary,
						service: tx.service,
					}))
				);
			}

			const persistFinishedTxs = PersistentFramework.get(
				"pegasysFinishedTransactions"
			);

			if (persistFinishedTxs) {
				const walletTxs = (
					persistFinishedTxs as IPersistentFinishedTx[]
				).filter(tx => tx.walletAddress === address && tx.chainId === chainId);

				setFinishedTxs(
					walletTxs.map(tx => ({
						hash: tx.hash,
						summary: tx.summary,
						success: tx.success,
					}))
				);
			}
		}
	}, [chainId, address]);

	const providerValue = useMemo(
		() => ({
			addTransactions,
			pendingTxs,
			finishedTxs,
			clearAll,
		}),
		[addTransactions, pendingTxs, finishedTxs, clearAll]
	);

	return (
		<TransactionContext.Provider value={providerValue}>
			{children}
		</TransactionContext.Provider>
	);
};
