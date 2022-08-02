import {
	ToastPositionWithLogical,
	useToast,
	UseToastOptions,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const useToasty = () => {
	const [state, setState] = useState({} as UseToastOptions);
	const toast = useToast();

	useEffect(() => {
		if (!state || !(Object.keys(state).length !== 0)) return;

		toast({
			...state,
			duration: 5000,
			position: `${
				(state?.position as ToastPositionWithLogical) || "top-right"
			}`,
			isClosable: true,
		});
	}, [state, toast]);

	return { toastState: state, toast: setState };
};

export { useToasty };
