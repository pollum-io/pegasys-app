import { IconButtonProps, IconButton as Button } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { FunctionComponent } from 'react';

export const IconButton: FunctionComponent<IconButtonProps> = props => {
	const theme = usePicasso();
	return (
		<Button
			backgroundColor={theme.bg.secondary}
			color={theme.text.mono}
			opacity="0.85"
			_hover={{ opacity: '1' }}
			_active={{}}
			{...props}
		/>
	);
};
