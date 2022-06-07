import { Button, ButtonProps } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode } from 'react';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const SlippageButton: FunctionComponent<IButtonProps> = props => {
	const theme = usePicasso();
	const { children, ...rest } = props;

	return (
		<Button
			px="2"
			py="1.5"
			h="max-content"
			mr="0.5rem"
			fontFamily="mono"
			letterSpacing="-0.8px"
			borderRadius={36}
			fontWeight={400}
			border="1px solid"
			borderColor={theme.border.borderSettings}
			backgroundColor={theme.bg.whiteGray}
			color={theme.text.mono}
			{...rest}
		>
			{children}
		</Button>
	);
};
