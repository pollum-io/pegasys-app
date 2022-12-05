import React from "react";
import { Flex, Text, Link } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import {
	useGovernance,
	NETWORKS_CHAIN_PARAMS,
	useWallet,
} from "pegasys-services";
import { ChainId } from "@pollum-io/pegasys-sdk";
import { useTranslation } from "react-i18next";

const Detail: React.FC = () => {
	const theme = usePicasso();
	const { selectedProposals } = useGovernance();
	const { chainId } = useWallet();
	const { t: translation } = useTranslation();

	const getLink = (addr: string) =>
		`${
			NETWORKS_CHAIN_PARAMS[chainId ?? ChainId.NEVM].blockExplorerUrls[0]
		}address/${addr}`;

	if (!selectedProposals) {
		return null;
	}

	return (
		<Flex
			justifyContent="flex-start"
			w="100%"
			gap="3"
			flexDirection="column"
			color={theme.text.mono}
		>
			<Text fontWeight="bold">{translation("votePage.details")}</Text>
			<Flex w="100%" flexDirection={["column", "column", "row", "row"]}>
				<Text>1:</Text>
				<Text wordBreak="break-all" ml={["0", "0", "0.438rem", "0.438rem"]}>
					<Link
						isExternal
						color={theme.text.cyanPurple}
						href={getLink(selectedProposals.details.target)}
					>
						{selectedProposals.details.target}
					</Link>
					.{selectedProposals.details.functionSig}(
					<Link
						isExternal
						color={theme.text.cyanPurple}
						href={getLink(selectedProposals.details.callData)}
					>
						{selectedProposals.details.callData}
					</Link>
					)
				</Text>
			</Flex>
		</Flex>
	);
};

export default Detail;
