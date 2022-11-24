export interface IUnlockVotingHeader {
	onClose: () => void;
}

export interface IUnlockVotingInput {
	showInput: boolean;
	inputValue: string;
	setInputValue: (newVal: string) => void;
}

export interface IUnlockVotingFooter {
	showInput: boolean;
	inputValue: string;
	setShowInput: (newVal: boolean) => void;
	onClose: () => void;
}
