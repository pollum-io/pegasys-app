import React, { useEffect, createContext, useState, useMemo } from "react";
import { ITx, IPersistTxs } from "types";
import { useToasty, useWallet } from "pegasys-services";

export enum ApprovalState {
	UNKNOWN,
	NOT_APPROVED,
	PENDING,
	APPROVED,
}
export interface IApprovalState {
	status: ApprovalState;
	type: string;
}

export interface ISubmittedAproval {
	status: boolean;
	tokens: string[];
	currentTokenToApprove?: string;
}

interface IWeb3 {
	connecting: boolean;
	setConnecting: React.Dispatch<React.SetStateAction<boolean>>;
	otherWallet: boolean;
	setOtherWallet: React.Dispatch<React.SetStateAction<boolean>>;
	setTransactions: React.Dispatch<React.SetStateAction<ITx>>;
	transactions: ITx;
	setApprovalState: React.Dispatch<React.SetStateAction<IApprovalState>>;
	approvalState: IApprovalState;
	setApprovalSubmitted: React.Dispatch<React.SetStateAction<ISubmittedAproval>>;
	approvalSubmitted: ISubmittedAproval;
	setCurrentTxHash: React.Dispatch<React.SetStateAction<string>>;
	currentTxHash: string;
	currentInputTokenName: string;
	setCurrentInputTokenName: React.Dispatch<React.SetStateAction<string>>;
	isGovernance: boolean;
	setIsGovernance: React.Dispatch<React.SetStateAction<boolean>>;
	setPendingTxLength: React.Dispatch<React.SetStateAction<number>>;
	pendingTxLength: number;
	showCancelled: boolean;
	setShowCancelled: React.Dispatch<React.SetStateAction<boolean>>;
	votersType: string;
	setVotersType: React.Dispatch<React.SetStateAction<string>>;
	votesLocked: boolean;
	setVotesLocked: React.Dispatch<React.SetStateAction<boolean>>;
	delegatedTo: string;
	setDelegatedTo: React.Dispatch<React.SetStateAction<string>>;
	setCurrentLpAddress: React.Dispatch<React.SetStateAction<string>>;
	currentLpAddress: string;
	currentSummary: string;
	setCurrentSummary: React.Dispatch<React.SetStateAction<string>>;
}

export const WalletContext = createContext({} as IWeb3);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [connecting, setConnecting] = useState<boolean>(false);
	const [votesLocked, setVotesLocked] = useState<boolean>(true);
	const [votersType, setVotersType] = useState<string>("");
	const [delegatedTo, setDelegatedTo] = useState<string>("");
	const [otherWallet, setOtherWallet] = useState<boolean>(false);
	const [showCancelled, setShowCancelled] = useState<boolean>(false);
	const [isGovernance, setIsGovernance] = useState<boolean>(false);
	const [approvalSubmitted, setApprovalSubmitted] = useState<ISubmittedAproval>(
		{ status: false, tokens: [], currentTokenToApprove: "" }
	);
	const [currentTxHash, setCurrentTxHash] = useState<string>("");
	const [currentInputTokenName, setCurrentInputTokenName] =
		useState<string>("");
	const [transactions, setTransactions] = useState<ITx>({
		57: {},
		5700: {},
		2814: {},
	});
	const [pendingTxLength, setPendingTxLength] = useState<number>(0);
	const [currentLpAddress, setCurrentLpAddress] = useState<string>("");
	const [currentSummary, setCurrentSummary] = useState<string>("");

	const [approvalState, setApprovalState] = useState<IApprovalState>({
		status: ApprovalState.UNKNOWN,
		type: "",
	});
	const { toast } = useToasty();
	const { isConnected, address, chainId, provider } = useWallet();

	const rpcUrl =
		chainId === 5700
			? "https://tanenbaum.io/api"
			: chainId === 2814
			? "https://explorer.testnet.rollux.com/api"
			: "https://explorer.syscoin.org/api";

	const timeValue = chainId === 2814 ? 3000 : 10000;

	useMemo(() => {
		if (approvalState.status === ApprovalState.PENDING && isConnected) {
			const timer = setInterval(async () => {
				const getTx = await fetch(
					`${rpcUrl}?module=account&action=pendingtxlist&address=${address}`
				).then(result => result.json());
				const hash = `${currentTxHash}`;
				const summary = `${currentSummary}`;
				const storageSummary = localStorage.getItem("currentSummary");

				setPendingTxLength(Number(getTx?.result?.length));
				provider?.getTransaction(hash).then(result => {
					localStorage.setItem(
						"txs",
						JSON.stringify({
							...JSON.parse(`${localStorage.getItem("txs")}`),
							[result.hash]: {
								...result,
								summary: storageSummary || summary,
								chainId,
								txType: approvalState.type,
								finished: false,
							},
						})
					);
					if (
						result.from.toLowerCase() === address.toLowerCase() &&
						result.confirmations !== 0
					) {
						setTransactions(prevTransactions => ({
							...prevTransactions,
							[Number(chainId)]: {
								...prevTransactions[
									chainId === 57 ? 57 : chainId === 2814 ? 2814 : 5700
								],
								[hash]: {
									...prevTransactions[
										chainId === 57 ? 57 : chainId === 2814 ? 2814 : 5700
									][hash],
									...result,
									chainId,
									summary: storageSummary || summary,
									txType: approvalState.type,
									finished: true,
									hash,
								},
							},
						}));
						setPendingTxLength(Number(getTx?.result?.length));
						setApprovalState({
							status: ApprovalState.APPROVED,
							type: approvalState.type,
						});
						localStorage.setItem(
							"txs",
							JSON.stringify({
								...JSON.parse(`${localStorage.getItem("txs")}`),
								[result.hash]: {
									...result,
									summary: storageSummary || summary,
									finished: true,
								},
							})
						);
						if (approvalState.type === "approve-swap") {
							setApprovalSubmitted(prevState => ({
								...prevState,
								tokens: prevState.tokens.filter(
									token => token !== `${currentInputTokenName}`
								),
							}));
						}
						clearInterval(timer);
						// eslint-disable-next-line
						return;
					}
				});
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
		const persistTxs: IPersistTxs = JSON.parse(
			`${localStorage.getItem("txs")}`
		);
		if (persistTxs && isConnected) {
			Object.values(persistTxs).map(tx => {
				if (tx.finished === false) {
					setTransactions(prevState => ({
						...prevState,
						[chainId as number]: {
							...prevState[
								tx.chainId === 57 ? 57 : tx.chainId === 2814 ? 2814 : 5700
							],
							[tx.hash]: tx,
						},
					}));
					setApprovalState({
						status: ApprovalState.PENDING,
						type: `${tx.txType}`,
					});
					setCurrentTxHash(tx.hash);
					return null;
				}
				setTransactions(prevState => ({
					...prevState,
					[chainId as number]: {
						...prevState[
							tx.chainId === 57 ? 57 : tx.chainId === 2814 ? 2814 : 5700
						],
						[tx.hash]: tx,
					},
				}));
				return null;
			});
		}
	}, [isConnected]);

	useEffect(() => {
		if (currentTxHash) localStorage.setItem("currentTxHash", currentTxHash);
		if (currentSummary) {
			localStorage.setItem("currentSummary", currentSummary);
			setPendingTxLength(1);
		}
	}, [currentTxHash, currentSummary]);

	useEffect(() => {
		if (approvalSubmitted && approvalState.status !== ApprovalState.UNKNOWN) {
			localStorage.setItem(
				"approvalSubmitted",
				JSON.stringify(approvalSubmitted)
			);
		}
	}, [approvalSubmitted]);

	const providerValue = useMemo(
		() => ({
			connecting,
			setConnecting,
			otherWallet,
			setOtherWallet,
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
			isGovernance,
			setIsGovernance,
			setPendingTxLength,
			pendingTxLength,
			showCancelled,
			setShowCancelled,
			votersType,
			setVotersType,
			votesLocked,
			setVotesLocked,
			delegatedTo,
			setDelegatedTo,
			currentLpAddress,
			setCurrentLpAddress,
			currentSummary,
			setCurrentSummary,
		}),
		[
			connecting,
			setConnecting,
			otherWallet,
			setOtherWallet,
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
			isGovernance,
			setIsGovernance,
			setPendingTxLength,
			pendingTxLength,
			showCancelled,
			setShowCancelled,
			votersType,
			setVotersType,
			votesLocked,
			setVotesLocked,
			delegatedTo,
			setDelegatedTo,
			currentLpAddress,
			setCurrentLpAddress,
			currentSummary,
			setCurrentSummary,
		]
	);

	return (
		<WalletContext.Provider value={providerValue}>
			{children}
		</WalletContext.Provider>
	);
};
