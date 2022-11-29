import React, { useEffect, createContext, useState, useMemo } from "react";
import { useToast, useMediaQuery } from "@chakra-ui/react";

import { ToastyCard } from "../components";
import {
	IToastyProviderProps,
	IToastyProviderValue,
	TToastState,
} from "../dto";

export const ToastyContext = createContext({} as IToastyProviderValue);

export const ToastyProvider: React.FC<IToastyProviderProps> = ({
	children,
	bg,
	text,
}) => {
	const [state, setState] = useState<TToastState>({});
	const toast = useToast();
	const [isMobile] = useMediaQuery("(max-width: 480px)");

	useEffect(() => {
		if (!state || !Object.keys(state).length) return;

		if (!toast.isActive(state?.id ?? "")) {
			toast({
				...state,
				id: state?.id,
				duration: 5000000,
				position: isMobile ? "top" : "top-right",
				isClosable: true,
				status: state?.status,
				title: state?.title,
				description: state?.description,

				render: ({ onClose }) => (
					<ToastyCard bg={bg} text={text} onClose={onClose} state={state} />
				),
			});
		}
	}, [state]);

	const providerValue = useMemo(
		() => ({ state, toast: setState }),
		[state, setState]
	);

	return (
		<ToastyContext.Provider value={providerValue}>
			{children}
		</ToastyContext.Provider>
	);
};
