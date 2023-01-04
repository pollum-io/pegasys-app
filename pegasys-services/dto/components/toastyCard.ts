import { IToastOptions } from "../contexts";

export interface IToastyCardProps {
	bg: string;
	text: string;
	state: IToastOptions;
	onClose: () => void;
}
