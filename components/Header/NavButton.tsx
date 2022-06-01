import { Button, ButtonProps, Link } from '@chakra-ui/react';
import { usePicasso } from 'hooks';
import { FunctionComponent, ReactNode } from 'react';

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
	href: string;
}

export const NavButton: FunctionComponent<IButtonProps> = props => {
	const { href, children, ...rest } = props;
	const theme = usePicasso();
	return (
		<Link href={href} _hover={{ textDecoration: 'none' }}>
			<Button
				color={theme.text.mono}
				bgColor="transparent"
				opacity="0.75"
				_hover={{ bgColor: 'transparent', opacity: 1 }}
				_active={{}}
				w="max-content"
				h="max-content"
				py="0"
				px="2"
				{...rest}
			>
				{children}
			</Button>
		</Link>
	);
};
