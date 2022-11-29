import { Flex, Text } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";
import { usePicasso } from "hooks";
import { useGovernance } from "pegasys-services";
import { useTranslation } from "react-i18next";

const ProposalDetails: React.FC = () => {
	const theme = usePicasso();
	const { setSelectedProposals } = useGovernance();
	const { t: translation } = useTranslation();

	return (
		<Flex
			zIndex="docked"
			alignItems="center"
			gap="2"
			_hover={{ cursor: "pointer" }}
			onClick={() => setSelectedProposals(null)}
		>
			<MdArrowBack size={21} color={theme.icon.whiteGray} />
			<Text fontSize="18px" fontWeight="semibold" color={theme.icon.whiteGray}>
				{translation("votePage.allProposals")}
			</Text>
		</Flex>
	);
};

export default ProposalDetails;
