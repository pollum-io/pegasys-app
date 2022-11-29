import { Flex, Text } from "@chakra-ui/react";
import { usePicasso, useWallet } from "hooks";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

export const SwapExpertMode: FunctionComponent = () => {
	const theme = usePicasso();
	const { otherWallet, setOtherWallet } = useWallet();
	const { t: translation } = useTranslation();

	return (
		<Flex flexDirection="column" py="1rem" border="transparent" mb="-3">
			<Flex flex-direction="row" fontSize="0.875rem" gap="1">
				<Flex
					color={theme.text.cyanPurple}
					onClick={() => setOtherWallet(!otherWallet)}
					_hover={{ cursor: "pointer", opacity: "0.9" }}
					fontSize="0.875rem"
					fontWeight="semibold"
				>
					{translation("swapPage.sendToAnother")}{" "}
				</Flex>
				<Text color="#718096" fontSize="0.875rem" fontWeight="semibold">
					{translation("swapPage.optional")}
				</Text>
			</Flex>
		</Flex>
	);
};
