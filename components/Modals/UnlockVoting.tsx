import {
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useColorMode,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent, useState } from "react";

import {
	UnlockVotingHeader,
	UnlockVotingBody,
	UnlockVotingInput,
	UnlockVotingFooter,
} from "../governance";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const UnlockVotesModal: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;
	const theme = usePicasso();
	const [showInput, setShowInput] = useState(false);
	const [inputValue, setInputValue] = useState<string>("");
	const { colorMode } = useColorMode();

	const close = () => {
		setInputValue("");
		setShowInput(false);
		onClose();
	};

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={close}>
			<ModalOverlay />
			<ModalContent
				borderTopRadius="30px"
				borderBottomRadius={["0", "30px", "30px", "30px"]}
				mt={["0", "6rem", "6rem", "6rem"]}
				mb={["0", "unset", "unset", "unset"]}
				borderTop={
					colorMode === "dark"
						? ["1px solid transparent", "none", "none", "none"]
						: ["none", "none", "none", "none"]
				}
				h="max-content"
				position={["absolute", "relative", "relative", "relative"]}
				background={`linear-gradient(${theme.bg.blueNavyLight}, ${theme.bg.blueNavyLight}) padding-box, linear-gradient(270.16deg, rgba(24,54,61, 0.8) 90.76%, rgba(24,54,61, 0) 97.76%) border-box`}
				bottom="0"
				boxShadow={
					colorMode === "dark"
						? "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 5px 10px rgba(0, 0, 0, 0.2), 0px 15px 40px rgba(0, 0, 0, 0.4)"
						: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
				}
				w="100vw"
			>
				<ModalHeader pt="1.5rem" pb="1rem" flexDirection="column">
					<UnlockVotingHeader onClose={close} />
				</ModalHeader>
				<ModalBody pb="6">
					<Flex w="100%" flexDirection="column" gap="8">
						<UnlockVotingBody />
						<UnlockVotingInput
							inputValue={inputValue}
							setInputValue={setInputValue}
							showInput={showInput}
						/>
					</Flex>
				</ModalBody>

				<ModalFooter pt="0.5rem" pb="1.5rem">
					<UnlockVotingFooter
						setShowInput={setShowInput}
						inputValue={inputValue}
						showInput={showInput}
						onClose={close}
					/>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
