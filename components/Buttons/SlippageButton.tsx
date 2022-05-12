import { Button, ButtonProps } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode } from "react";

interface IButtonProps extends ButtonProps {
	children?: ReactNode;
}

export const SlippageButton: FunctionComponent<IButtonProps> = props => {
    const theme = usePicasso();
	const { children, ...rest } = props;

    return (
        <Button
            w="3.5rem"
            h="2rem"
            mr="0.5rem"
            borderRadius={36}
            fontWeight={400}
            backgroundColor={theme.bg.button.slippage}
            color={theme.text.mono}
            {...rest}
        >
        {children}
        </Button>
    );
};