import { ModalContext } from "contexts";
import { useContext } from "react";

export function useModal() {
	return useContext(ModalContext);
}
