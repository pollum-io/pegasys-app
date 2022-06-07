import { useToast, UseToastOptions } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const useToasty = () => {
	const [state, setState] = useState({} as UseToastOptions);
	const toast = useToast();

	useEffect(() => {
		if (Object.keys(state).length !== 0) {
			toast({
				...state,
				duration: 5000,
				position: 'top',
				isClosable: true,
			});
		}
	}, [state]);

	return { toastState: state, toast: setState };
};

export { useToasty };
