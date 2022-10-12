import React from "react";
import { Flex, Text } from "@chakra-ui/react";

import { usePicasso } from "hooks";
import { useEarn } from "pegasys-services";
import { AiOutlineClose } from "react-icons/ai";
import { MdArrowBack } from "react-icons/md";
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
			flexDirection={["column-reverse", "column-reverse", "row", "row"]}
			justifyContent="space-between"
			alignItems={["flex-start", "flex-start", "center", "center"]}
		>
			<Flex pr="7" gap="2" mt={["6", "6", "2", "2"]}>
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
						sm: "none",
						md: "flex",
						lg: "flex",
					}}
					position="relative"
					right="2"
					bottom="4"
				>
					<AiOutlineClose size={20} color={theme.icon.closeWhiteGray} />
				</Flex>
				<Flex
					display={{
						base: "block",
						sm: "block",
						md: "none",
						lg: "none",
					}}
				>
					<MdArrowBack size={24} color={theme.text.gray} />
				</Flex>
				<Text
					display={{
						base: "block",
						sm: "block",
						md: "none",
						lg: "none",
					}}
					color={theme.text.gray}
				>
					Stake
				</Text>
			</Flex>
		</Flex>
	);
};

export default EarnActionsHeader;
