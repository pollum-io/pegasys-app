import { Flex, Text } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";
import { usePicasso } from "hooks";
import { useGovernance } from "pegasys-services";

const ProposalDetails: React.FC = () => {
	const theme = usePicasso();
	const { setSelectedProposals } = useGovernance();

	return (
		<Flex
			zIndex="docked"
			alignItems="center"
			gap="2"
			_hover={{ cursor: "pointer" }}
			onClick={() => setSelectedProposals(null)}
		>
			<MdArrowBack size={21} color={theme.icon.whiteGray} />
			<Text
				fontSize="1.125rem"
				fontWeight="semibold"
				color={theme.icon.whiteGray}
			>
				All Proposals
			</Text>
		</Flex>
	);
};

export default ProposalDetails;
