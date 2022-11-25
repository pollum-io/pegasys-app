import { ChainId } from "@pollum-io/pegasys-sdk";
import React, {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

import { useTranslation } from "react-i18next";
import { PersistentFramework, TransactionFramework } from "../frameworks";
import {
	ITransactionProviderValue,
	ITransactionProviderProps,
	// ITx,
	// ISubmittedAproval,
	// IApprovalState,
	// ApprovalState,
	// IPersistTxs,
	// ITransactionResponse,
	IPendingTxs,
	IPendingTx,
	IPersistentPendingTx,
	IFinishedTx,
	IFinishedTxs,
	IPersistentFinishedTx,
} from "../dto";
import { useWallet, useToasty } from "../hooks";

export const TransactionContext = createContext(
	{} as ITransactionProviderValue
);

export const TransactionProvider: React.FC<ITransactionProviderProps> = ({
	children,
}) => {
	const [pendingTxs, setPendingTxs] = useState<IPendingTxs>({
		[ChainId.NEVM]: [],
		[ChainId.TANENBAUM]: [],
		[ChainId.ROLLUX]: [],
	});

	const [finishedTxs, setFinishedTxs] = useState<IFinishedTxs>({
		[ChainId.NEVM]: [],
		[ChainId.TANENBAUM]: [],
		[ChainId.ROLLUX]: [],
	});

	// const [transactions, setTransactions] = useState<ITx>({
	// 	57: {},
	// 	5700: {},
	// 	2814: {},
	// });
	// const [approvalState, setApprovalState] = useState<IApprovalState>({
	// 	status: ApprovalState.UNKNOWN,
	// 	type: "",
	// });
	// const [approvalSubmitted, setApprovalSubmitted] = useState<ISubmittedAproval>(
	// 	{ status: false, tokens: [], currentTokenToApprove: "" }
	// );
	// const [currentTxHash, setCurrentTxHash] = useState<string>("");
	// const [currentInputTokenName, setCurrentInputTokenName] =
	// 	useState<string>("");
	// const [pendingTxLength, setPendingTxLength] = useState<number>(1);
	// const [currentSummary, setCurrentSummary] = useState<string>("");
	const { chainId, isConnected, address, provider } = useWallet();
	const { toast } = useToasty();
	const { t: translation } = useTranslation();

	// const addTransaction = (response: ITransactionResponse) => {
	// 	if (!address || !chainId) return;

	// 	const { hash } = response;

	// 	if (!hash) {
	// 		throw Error("No transaction hash found.");
	// 	}

	// 	setTransactions({
	// 		...transactions,
	// 		[response.chainId]: {
	// 			...transactions[chainId],
	// 			[hash]: response,
	// 		},
	// 	});
	// };

	const addTransactions = (tx: IPendingTx | IFinishedTx, pending?: boolean) => {
		if (!address || !chainId) return;

		let newPendingTransactions: any[] = [];

		const persistentKey = pending
			? "pegasysPendingTransactions"
			: "pegasysFinishedTransactions";

		const persistPendingTxs = PersistentFramework.get(persistentKey);

		if (persistPendingTxs) {
			newPendingTransactions = persistPendingTxs as any[];
		}

		newPendingTransactions.push({
			...tx,
			walletAddress: address,
			chainId,
		});

		PersistentFramework.add(persistentKey, newPendingTransactions);

		if (pending) {
			setPendingTxs({
				...pendingTxs,
				[chainId]: [...pendingTxs[chainId], tx],
			});
		} else {
			const maxTxs = 50;

			let start = 0;

			if (finishedTxs[chainId].length >= maxTxs) {
				start = finishedTxs[chainId].length - maxTxs + 1;
			}

			setFinishedTxs({
				...finishedTxs,
				[chainId]: [...finishedTxs[chainId].slice(start, 49 + start), tx],
			});
		}
	};

	const removeTransactions = (hash: string, pending?: boolean) => {
		if (!chainId) return;

		const persistentKey = pending
			? "pegasysPendingTransactions"
			: "pegasysFinishedTransactions";

		const persistTxs = PersistentFramework.get(persistentKey);

		if (!persistTxs) return;

		const newTransactions = (persistTxs as any[]).filter(
			tx => tx.hash !== hash
		);

		PersistentFramework.add(persistentKey, newTransactions);

		if (pending) {
			setPendingTxs({
				...pendingTxs,
				[chainId]: pendingTxs[chainId].filter(tx => tx.hash !== hash),
			});
		} else {
			setFinishedTxs({
				...finishedTxs,
				[chainId]: finishedTxs[chainId].filter(tx => tx.hash !== hash),
			});
		}
	};

	const clearAll = () => {
		PersistentFramework.remove("pegasysFinishedTransactions");
		setFinishedTxs({
			[ChainId.NEVM]: [],
			[ChainId.TANENBAUM]: [],
			[ChainId.ROLLUX]: [],
		});
	};

	const getPendingTxs = useCallback(
		() => TransactionFramework.getPendingTxs(address, chainId),
		[chainId, address]
	);

	const timeValue = useMemo(
		() => (chainId === ChainId.ROLLUX ? 3000 : 10000),
		[chainId]
	);

	useMemo(() => {
		if (chainId && isConnected) {
			const timer = setInterval(async () => {
				if (!pendingTxs[chainId].length) clearInterval(timer);

				await Promise.all(
					pendingTxs[chainId].map(async currTx => {
						const tx = await provider?.getTransaction(currTx.hash);

						if (!tx) return;

						if (
							tx.from.toLowerCase() === address.toLowerCase() &&
							tx.confirmations !== 0
						) {
							removeTransactions(currTx.hash, true);
							addTransactions({
								summary: currTx.summary,
								hash: currTx.hash,
								success: tx.confirmations === 1,
							});
						}
					})
				);
			}, timeValue);
		}
	}, [pendingTxs]);

	// useMemo(() => {
	// 	if (approvalState.status === ApprovalState.PENDING && isConnected) {
	// 		const timer = setInterval(async () => {
	// 			const getTx = await getPendingTxs();

	// 			const storageSummary = PersistentFramework.get("currentSummary") as
	// 				| { currentSummary: string }
	// 				| undefined;

	// 			setPendingTxLength(Number(getTx?.result?.length));

	// 			const tx = await provider?.getTransaction(currentTxHash);

	// 			if (tx) {
	// 				const txs = PersistentFramework.get("txs");

	// 				PersistentFramework.add("txs", {
	// 					...(txs ?? {}),
	// 					[tx.hash]: {
	// 						...tx,
	// 						summary: storageSummary?.currentSummary ?? currentSummary,
	// 						chainId,
	// 						txType: approvalState.type,
	// 						finished: false,
	// 					},
	// 				});

	// 				if (
	// 					tx.from.toLowerCase() === address.toLowerCase() &&
	// 					tx.confirmations !== 0
	// 				) {
	// 					addTransaction({
	// 						...tx,
	// 						chainId: tx.chainId,
	// 						summary: storageSummary?.currentSummary ?? currentSummary,
	// 						txType: approvalState.type,
	// 						finished: true,
	// 						hash: currentTxHash,
	// 					});

	// 					setPendingTxLength(Number(getTx?.result?.length));
	// 					setApprovalState({
	// 						status: ApprovalState.APPROVED,
	// 						type: approvalState.type,
	// 					});

	// 					PersistentFramework.add("txs", {
	// 						...(PersistentFramework.get("txs") ?? {}),
	// 						[tx.hash]: {
	// 							...tx,
	// 							summary: storageSummary?.currentSummary ?? currentSummary,
	// 							finished: true,
	// 						},
	// 					});

	// 					if (approvalState.type === "approve-swap") {
	// 						setApprovalSubmitted(prevState => ({
	// 							...prevState,
	// 							tokens: prevState.tokens.filter(
	// 								token => token !== `${currentInputTokenName}`
	// 							),
	// 						}));
	// 					}
	// 					clearInterval(timer);
	// 				}
	// 			}
	// 		}, timeValue);
	// 	}
	// }, [approvalState, currentTxHash]);

	// useEffect(() => {
	// 	if (approvalState.status === ApprovalState.APPROVED) {
	// 		toast({
	// 			title: translation("toasts.transactionComp"),
	// 			status: "success",
	// 		});
	// 	}

	// 	if (
	// 		approvalState.type === "approve-swap" &&
	// 		approvalState.status === ApprovalState.APPROVED &&
	// 		approvalSubmitted.tokens.length === 0
	// 	) {
	// 		setApprovalSubmitted(prevState => ({
	// 			...prevState,
	// 			status: false,
	// 		}));
	// 	}
	// }, [approvalState]);

	// useEffect(() => {
	// 	const persistTxs = PersistentFramework.get("txs") as
	// 		| IPersistTxs
	// 		| undefined;

	// 	if (persistTxs && isConnected) {
	// 		Object.values(persistTxs).map(tx => {
	// 			if (tx.finished === false) {
	// 				addTransaction(tx);
	// 				setApprovalState({
	// 					status: ApprovalState.PENDING,
	// 					type: `${tx.txType}`,
	// 				});
	// 				setCurrentTxHash(tx.hash);
	// 				return null;
	// 			}
	// 			addTransaction(tx);
	// 			return null;
	// 		});
	// 	}
	// }, [isConnected]);

	// useEffect(() => {
	// 	if (currentTxHash) {
	// 		PersistentFramework.add("currentTxHash", { currentTxHash });
	// 	}
	// 	if (currentSummary) {
	// 		PersistentFramework.add("currentSummary", { currentSummary });
	// 		setPendingTxLength(1);
	// 	}
	// }, [currentTxHash, currentSummary]);

	// useEffect(() => {
	// 	if (approvalSubmitted && approvalState.status !== ApprovalState.UNKNOWN) {
	// 		PersistentFramework.add("approvalSubmitted", approvalSubmitted);
	// 	}
	// }, [approvalSubmitted]);

	useEffect(() => {
		if (chainId && address) {
			const persistPendingTxs = PersistentFramework.get(
				"pegasysPendingTransactions"
			);

			if (persistPendingTxs) {
				const walletTxs = (persistPendingTxs as IPersistentPendingTx[]).filter(
					tx => tx.walletAddress === address
				);

				const currentPendingTxs: IPendingTxs = {
					[ChainId.NEVM]: [],
					[ChainId.TANENBAUM]: [],
					[ChainId.ROLLUX]: [],
				};

				walletTxs.forEach(tx => {
					currentPendingTxs[tx.chainId].push({
						hash: tx.hash,
						summary: tx.summary,
						service: tx.service,
					});
				});

				setPendingTxs(currentPendingTxs);
			}

			const persistFinishedTxs = PersistentFramework.get(
				"pegasysFinishedTransactions"
			);

			if (persistFinishedTxs) {
				const walletTxs = (
					persistFinishedTxs as IPersistentFinishedTx[]
				).filter(tx => tx.walletAddress === address);

				const currentFinishedTxs: IFinishedTxs = {
					[ChainId.NEVM]: [],
					[ChainId.TANENBAUM]: [],
					[ChainId.ROLLUX]: [],
				};

				walletTxs.forEach(tx => {
					currentFinishedTxs[tx.chainId].push({
						hash: tx.hash,
						summary: tx.summary,
						success: tx.success,
					});
				});

				setFinishedTxs(currentFinishedTxs);
			}
		}
	}, [chainId, address]);

	const providerValue = useMemo(
		() => ({
			// transactions,
			// setTransactions,
			// approvalState,
			// setApprovalState,
			// approvalSubmitted,
			// setApprovalSubmitted,
			// currentTxHash,
			// setCurrentTxHash,
			// currentInputTokenName,
			// setCurrentInputTokenName,
			// pendingTxLength,
			// setPendingTxLength,
			// currentSummary,
			// setCurrentSummary,
			// addTransaction,
			addTransactions,
			removeTransactions,
			pendingTxs,
			finishedTxs,
			clearAll,
		}),
		[
			// transactions,
			// setTransactions,
			// approvalState,
			// setApprovalState,
			// approvalSubmitted,
			// setApprovalSubmitted,
			// currentTxHash,
			// setCurrentTxHash,
			// currentInputTokenName,
			// setCurrentInputTokenName,
			// pendingTxLength,
			// setPendingTxLength,
			// currentSummary,
			// setCurrentSummary,
			// addTransaction,
			addTransactions,
			removeTransactions,
			pendingTxs,
			finishedTxs,
			clearAll,
		]
	);

	return (
		<TransactionContext.Provider value={providerValue}>
			{children}
		</TransactionContext.Provider>
	);
};
