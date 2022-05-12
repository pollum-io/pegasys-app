import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const UserSysValue: FunctionComponent<IButtonProps> = props => {
    const theme = usePicasso();
    const { children, ...rest } = props;
    const isConnected = true;
    const sys = "SYS"
    return (
        isConnected ?
        <Button
			color="white"
			bgColor="#315df6"
			borderRadius={12}
            border="1px solid #315df6"
			opacity="0.9"
			_hover={{ opacity: 1 }}
			_active={{}}
			w="6rem"
            padding="4rem"
			h="max-content"
			py="2"
			px="4"
            overflow="clip"
			{...rest}
		>
			10.3321 {sys}
		</Button>
        : null
    );
};