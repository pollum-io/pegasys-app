import { Flex, Text } from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import React, { FunctionComponent } from "react";

export const SwapExpertMode: FunctionComponent = () => {
	const theme = usePicasso();
	const { otherWallet, setOtherWallet } = useWallet();

	return (
		<Flex flexDirection="column" py="1rem" border="transparent" mb="-3">
			<Flex flex-direction="row" fontSize="0.875rem" gap="1">
				<Flex
					color={theme.text.cyanPurple}
					fontWeight="semi-bold"
					onClick={() => setOtherWallet(!otherWallet)}
					_hover={{ cursor: "pointer" }}
				>
					Send to another wallet{" "}
				</Flex>
				<Text color="#718096">(optional)</Text>
			</Flex>
		</Flex>
	);
};
