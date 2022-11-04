import { ChainId } from "@pollum-io/pegasys-sdk";
import React, {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

import { PersistentFramework, TransactionFramework } from "../frameworks";
import {
	ITransactionProviderValue,
	ITransactionProviderProps,
	ITx,
	ISubmittedAproval,
	IApprovalState,
	ApprovalState,
	IPersistTxs,
	ITransactionResponse,
} from "../dto";
import { useWallet, useToasty } from "../hooks";

export const TransactionContext = createContext(
	{} as ITransactionProviderValue
);

export const TransactionProvider: React.FC<ITransactionProviderProps> = ({
	children,
}) => {
	const [transactions, setTransactions] = useState<ITx>({
		57: {},
		5700: {},
		2814: {},
	});
	const [approvalState, setApprovalState] = useState<IApprovalState>({
		status: ApprovalState.UNKNOWN,
		type: "",
	});
	const [approvalSubmitted, setApprovalSubmitted] = useState<ISubmittedAproval>(
		{ status: false, tokens: [], currentTokenToApprove: "" }
	);
	const [currentTxHash, setCurrentTxHash] = useState<string>("");
	const [currentInputTokenName, setCurrentInputTokenName] =
		useState<string>("");
	const [pendingTxLength, setPendingTxLength] = useState<number>(0);
	const [currentSummary, setCurrentSummary] = useState<string>("");
	const { chainId, isConnected, address, provider } = useWallet();
	const { toast } = useToasty();

	const addTransaction = (response: ITransactionResponse) => {
		if (!address || !chainId) return;

		const { hash } = response;

		if (!hash) {
			throw Error("No transaction hash found.");
		}

		setTransactions({
			...transactions,
			[response.chainId]: {
				...transactions[chainId],
				[hash]: response,
			},
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
		if (approvalState.status === ApprovalState.PENDING && isConnected) {
			const timer = setInterval(async () => {
				const getTx = await getPendingTxs();

				const storageSummary = PersistentFramework.get("currentSummary") as
					| { currentSummary: string }
					| undefined;

				setPendingTxLength(Number(getTx?.result?.length));

				const tx = await provider?.getTransaction(currentTxHash);

				if (tx) {
					const txs = PersistentFramework.get("txs");

					PersistentFramework.add("txs", {
						...(txs ?? {}),
						[tx.hash]: {
							...tx,
							summary: storageSummary?.currentSummary ?? currentSummary,
							chainId,
							txType: approvalState.type,
							finished: false,
						},
					});

					if (
						tx.from.toLowerCase() === address.toLowerCase() &&
						tx.confirmations !== 0
					) {
						addTransaction({
							...tx,
							chainId: tx.chainId,
							summary: storageSummary?.currentSummary ?? currentSummary,
							txType: approvalState.type,
							finished: true,
							hash: currentTxHash,
						});

						setPendingTxLength(Number(getTx?.result?.length));
						setApprovalState({
							status: ApprovalState.APPROVED,
							type: approvalState.type,
						});

						PersistentFramework.add("txs", {
							...(PersistentFramework.get("txs") ?? {}),
							[tx.hash]: {
								...tx,
								summary: storageSummary?.currentSummary ?? currentSummary,
								finished: true,
							},
						});

						if (approvalState.type === "approve-swap") {
							setApprovalSubmitted(prevState => ({
								...prevState,
								tokens: prevState.tokens.filter(
									token => token !== `${currentInputTokenName}`
								),
							}));
						}
						clearInterval(timer);
					}
				}
			}, timeValue);
		}
	}, [approvalState, currentTxHash]);

	useEffect(() => {
		if (approvalState.status === ApprovalState.APPROVED) {
			toast({
				title: "Transaction completed successfully.",
				status: "success",
			});
		}

		if (
			approvalState.type === "approve-swap" &&
			approvalState.status === ApprovalState.APPROVED &&
			approvalSubmitted.tokens.length === 0
		) {
			setApprovalSubmitted(prevState => ({
				...prevState,
				status: false,
			}));
		}
	}, [approvalState]);

	useEffect(() => {
		const persistTxs = PersistentFramework.get("txs") as
			| IPersistTxs
			| undefined;

		if (persistTxs && isConnected) {
			Object.values(persistTxs).map(tx => {
				if (tx.finished === false) {
					addTransaction(tx);
					setApprovalState({
						status: ApprovalState.PENDING,
						type: `${tx.txType}`,
					});
					setCurrentTxHash(tx.hash);
					return null;
				}
				addTransaction(tx);
				return null;
			});
		}
	}, [isConnected]);

	useEffect(() => {
		if (currentTxHash) {
			PersistentFramework.add("currentTxHash", { currentTxHash });
		}
		if (currentSummary) {
			PersistentFramework.add("currentSummary", { currentSummary });
			setPendingTxLength(1);
		}
	}, [currentTxHash, currentSummary]);

	useEffect(() => {
		if (approvalSubmitted && approvalState.status !== ApprovalState.UNKNOWN) {
			PersistentFramework.add("approvalSubmitted", approvalSubmitted);
		}
	}, [approvalSubmitted]);

	const providerValue = useMemo(
		() => ({
			transactions,
			setTransactions,
			approvalState,
			setApprovalState,
			approvalSubmitted,
			setApprovalSubmitted,
			currentTxHash,
			setCurrentTxHash,
			currentInputTokenName,
			setCurrentInputTokenName,
			pendingTxLength,
			setPendingTxLength,
			currentSummary,
			setCurrentSummary,
			addTransaction,
		}),
		[
			transactions,
			setTransactions,
			approvalState,
			setApprovalState,
			approvalSubmitted,
			setApprovalSubmitted,
			currentTxHash,
			setCurrentTxHash,
			currentInputTokenName,
			setCurrentInputTokenName,
			pendingTxLength,
			setPendingTxLength,
			currentSummary,
			setCurrentSummary,
			addTransaction,
		]
	);

	return (
		<TransactionContext.Provider value={providerValue}>
			{children}
		</TransactionContext.Provider>
	);
};
