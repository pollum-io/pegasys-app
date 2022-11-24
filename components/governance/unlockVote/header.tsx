import React from "react";
import { useGovernance } from "pegasys-services";
import { Flex, Text } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";

import { usePicasso } from "hooks";
import { IUnlockVotingHeader } from "./dto";

const UnlockVotingHeader: React.FC<IUnlockVotingHeader> = ({ onClose }) => {
	const { votesLocked } = useGovernance();
	const theme = usePicasso();

	return (
		<Flex alignItems="center" position="relative" mb="1rem">
			<Text fontSize="18px" fontWeight="semibold">
				{votesLocked ? "Unlock Votes" : "Edit Vote Delegation"}
			</Text>
			<Flex
				_hover={{ cursor: "pointer" }}
				position="absolute"
				right="0"
				top="0"
			>
				<MdClose size={22} onClick={onClose} color={theme.text.mono} />
			</Flex>
		</Flex>
	);
};

export default UnlockVotingHeader;
