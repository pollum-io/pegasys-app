import React, { useMemo } from "react";
import { Button, Flex, Text, Link } from "@chakra-ui/react";
import { usePicasso, useModal } from "hooks";
import Jazzicon from "react-jazzicon";
import {
	BIG_INT_ZERO,
	NETWORKS_CHAIN_PARAMS,
	useGovernance,
	useWallet,
} from "pegasys-services";
import { ChainId, JSBI } from "@pollum-io/pegasys-sdk";
import { shortAddress } from "utils";
import { ProposalDetailsPercentageBar } from "../../governance";

const Vote: React.FC = () => {
	const theme = usePicasso();
	const { setVotersType, selectedProposals, vote, currentVotes } =
		useGovernance();
	const { onOpenCheckAllVotersModal } = useModal();
	const { chainId } = useWallet();

	const isOpenToVote = useMemo(() => {
		if (selectedProposals?.endDate) return false;

		if (!currentVotes || JSBI.lessThanOrEqual(currentVotes.raw, BIG_INT_ZERO))
			return false;

		return true;
	}, []);

	const getLink = (addr: string) =>
		`${
			NETWORKS_CHAIN_PARAMS[chainId ?? ChainId.NEVM].blockExplorerUrls[0]
		}address/${addr}`;

	if (!selectedProposals) {
		return null;
	}

	const isFavor = () => {
		setVotersType("favor");
		onOpenCheckAllVotersModal();
	};

	const isAgainst = () => {
		setVotersType("against");
		onOpenCheckAllVotersModal();
	};

	if (!selectedProposals) {
		return null;
	}

	return (
		<Flex mx={["4", "5", "5", "5"]} mt="4" flexDirection="column">
			<Text
				mr={["4", "4", "4", "0"]}
				fontWeight="semibold"
				color={theme.text.mono}
				fontSize={["16px", "16", "24px", "24px"]}
				mb="0.6rem"
			>
				{selectedProposals.title}
			</Text>
			<Flex
				justifyContent="flex-start"
				w="full-content"
				gap="4"
				flexDirection="row"
				alignItems="center"
				mb="1.5rem"
			>
				<Text color={theme.text.mono} fontWeight="bold" fontSize="16px">
					Proposer
				</Text>

				<Flex
					textTransform="lowercase"
					color={theme.text.mono}
					gap="2"
					alignItems="center"
				>
					<Jazzicon diameter={18} seed={Number(selectedProposals.proposer)} />
					<Link
						isExternal
						href={getLink(selectedProposals.proposer)}
						fontSize="14px"
					>
						{shortAddress(selectedProposals.proposer)}
					</Link>
				</Flex>
			</Flex>
			<Flex
				flexDirection={["column", "column", "row", "row"]}
				bgColor="rgba(255, 255, 255, 0.04)"
				w="100%"
				h="max-content"
				borderRadius="xl"
				py="3"
				px="4"
				justifyContent="space-between"
				color={theme.text.mono}
				flexWrap="wrap"
				gap="6"
			>
				<Flex
					justifyContent="space-between"
					flexDirection="column"
					w={["100%", "100%", "46%", "46%"]}
				>
					<ProposalDetailsPercentageBar support />
					<Flex
						justifyContent="space-between"
						alignItems="center"
						flexDirection="row-reverse"
						mt={["0", "0", "1.5", "1.5"]}
					>
						<Text
							fontSize="12px"
							_hover={{ cursor: "pointer", opacity: "0.9" }}
							transition="100ms ease-in-out"
							onClick={isFavor}
							color="#718096"
						>
							Check all voters
						</Text>
						{isOpenToVote && (
							<Button
								fontSize="12px"
								fontWeight="normal"
								px="0.8rem"
								h="1.5rem"
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								_hover={{
									bgColor: theme.bg.bluePurple,
								}}
								_active={{}}
								borderRadius="full"
								onClick={() => vote(selectedProposals.id, true)}
							>
								Vote in Favor
							</Button>
						)}
					</Flex>
				</Flex>
				<Flex
					justifyContent="space-between"
					flexDirection="column"
					w={["100%", "100%", "46%", "46%"]}
				>
					<ProposalDetailsPercentageBar />
					<Flex
						justifyContent="space-between"
						alignItems="center"
						mt={["0", "0", "1.5", "1.5"]}
						flexDirection="row-reverse"
					>
						<Text
							fontSize="12px"
							_hover={{ cursor: "pointer", opacity: "0.9" }}
							transition="100ms ease-in-out"
							onClick={isAgainst}
							color="#718096"
						>
							Check all voters
						</Text>
						{isOpenToVote && (
							<Button
								fontSize="12px"
								fontWeight="normal"
								px="0.8rem"
								h="1.5rem"
								bgColor={theme.bg.blueNavyLightness}
								color={theme.text.cyan}
								_hover={{
									bgColor: theme.bg.bluePurple,
								}}
								_active={{}}
								borderRadius="full"
								onClick={() => vote(selectedProposals.id, false)}
							>
								Vote Against
							</Button>
						)}
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Vote;
