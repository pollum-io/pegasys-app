import { Flex } from "@chakra-ui/react";
import { useModal } from "hooks";
import { FunctionComponent } from "react";
import { CheckAllVotersModal } from "components/Modals/CheckAllVoters";
import { useGovernance } from "pegasys-services";
import Header from "./header";
import Body from "./body";

const ProposalDetails: FunctionComponent = () => {
	const { selectedProposals } = useGovernance();
	const { isOpenCheckAllVotersModal, onCloseCheckAllVotersModal } = useModal();

	if (!selectedProposals) {
		return null;
	}

	return (
		<Flex flexDirection="column" w={["xs", "md", "2xl", "2xl"]}>
			<CheckAllVotersModal
				isOpen={isOpenCheckAllVotersModal}
				onClose={onCloseCheckAllVotersModal}
			/>
			<Flex
				alignItems="flex-start"
				my={["1", "4", "2", "2"]}
				justifyContent="flex-start"
				w="100%"
				flexDirection="column"
				zIndex="docked"
			>
				<Header />
				<Body />
			</Flex>
		</Flex>
	);
};

export default ProposalDetails;
