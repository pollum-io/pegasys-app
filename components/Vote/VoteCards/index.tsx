import { Flex } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { usePicasso } from "hooks";
import { useGovernance } from "pegasys-services";
import Status from "./status";
import Body from "./body";
import { IVoteCardsProps } from "./dto";

const VoteCards: React.FC<IVoteCardsProps> = props => {
	const { proposal } = props;
	const theme = usePicasso();
	const { showCancelled, setSelectedProposals } = useGovernance();

	const dateString = useMemo(() => {
		const dateParts = proposal.startDate.toDateString().split(" ");

		const customDateParts = [dateParts[1], dateParts[2], dateParts[3]];

		return customDateParts.join(" ");
	}, [proposal.startDate]);

	if (proposal.status === "CANCELLED" && !showCancelled) {
		return null;
	}

	return (
		<Flex
			w={["xs", "md", "2xl", "2xl"]}
			mb="2"
			alignItems="center"
			flexDirection={["column", "column", "row", "row"]}
			h={["6.25rem", "6.25rem", "3.625rem", "3.625rem"]}
			bgColor={theme.bg.blueNavyLight}
			borderRadius="xl"
			justifyContent="space-between"
			_hover={{ cursor: "pointer" }}
			boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
			onClick={() => setSelectedProposals(proposal)}
		>
			<Body title={proposal.title} version={proposal.id} />
			<Status
				status={proposal.status}
				date={dateString}
				statusColor={proposal.statusColor}
			/>
		</Flex>
	);
};

export default VoteCards;
