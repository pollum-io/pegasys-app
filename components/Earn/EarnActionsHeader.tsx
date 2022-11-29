import React from "react";
import { Flex } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { useEarn } from "pegasys-services";
import { MdOutlineClose } from "react-icons/md";
import EarnHeaderButton from "./EarnHeaderButton";

interface IEarnActionsHeaderProps {
	depositTitle: string;
	withdrawTitle: string;
	claimTitle: string;
	onClose: () => void;
}

const EarnActionsHeader: React.FC<IEarnActionsHeaderProps> = ({
	depositTitle,
	withdrawTitle,
	claimTitle,
	onClose,
}) => {
	const theme = usePicasso();
	const { selectedOpportunity } = useEarn();

	if (!selectedOpportunity) {
		return null;
	}

	return (
		<Flex
			flexDirection={["column-reverse", "row", "row", "row"]}
			justifyContent="space-between"
			alignItems={["flex-start", "center", "center", "center"]}
			pl="0"
			w="100%"
		>
			<Flex
				flex="2"
				pr={["0", "1rem", "1rem", "1rem"]}
				gap="2"
				mt={["6", "2", "2", "2"]}
				w="100%"
			>
				<EarnHeaderButton
					id="deposit"
					amount={selectedOpportunity.unstakedAmount}
				>
					{depositTitle}
				</EarnHeaderButton>
				<EarnHeaderButton
					id="withdraw"
					amount={selectedOpportunity.stakedAmount}
				>
					{withdrawTitle}
				</EarnHeaderButton>
				<EarnHeaderButton
					id="claim"
					amount={selectedOpportunity.unclaimedAmount}
				>
					{claimTitle}
				</EarnHeaderButton>
			</Flex>
			<Flex
				_hover={{ cursor: "pointer" }}
				onClick={onClose}
				alignItems="center"
				gap="2"
			>
				<Flex
					display={{
						base: "none",
						sm: "flex",
						md: "flex",
						lg: "flex",
					}}
					position="relative"
					top="1"
				>
					<MdOutlineClose size={22} color={theme.text.gray300} />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default EarnActionsHeader;
