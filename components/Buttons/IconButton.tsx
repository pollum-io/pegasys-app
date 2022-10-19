import { IconButtonProps, IconButton as Button } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";

export const IconButton: FunctionComponent<IconButtonProps> = props => {
	const theme = usePicasso();
	return (
		<Button
			color={theme.icon.nightGray}
			transition="0.4s"
			bgColor="transparent"
			_hover={{
				background: "rgba(255, 255, 255, 0.08)",
				color: theme.text.cyanLightPurple,
			}}
			_active={{}}
			{...props}
		/>
	);
};
