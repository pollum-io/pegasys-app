import { UseToastOptions } from "@chakra-ui/react";

export interface IToastyCardProps {
	bg: string;
	text: string;
	state: UseToastOptions;
	onClose: () => void;
}
