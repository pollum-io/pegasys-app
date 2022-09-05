import { ModalContext } from "contexts/modals";
import { useContext } from "react";

export function useModal() {
	return useContext(ModalContext);
}
