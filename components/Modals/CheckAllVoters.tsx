import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { FunctionComponent } from "react";
import { useGovernance } from "pegasys-services";

import { MdClose } from "react-icons/md";
import Jazzicon from "react-jazzicon";

interface IModal {
	isOpen: boolean;
	onClose: () => void;
}

export const CheckAllVotersModal: FunctionComponent<IModal> = props => {
	const { isOpen, onClose } = props;

	const theme = usePicasso();
	const { votersType } = useGovernance();

	return (
		<Modal blockScrollOnMount isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				borderRadius="30px"
				my={["0", "40", "40", "40"]}
				mb={["0", "0", "24rem", "24rem"]}
				h="max-content"
				position={["absolute", "relative", "relative", "relative"]}
				bottom={["0", "0", "0", "0"]}
				w={["100vw", "22.375rem", "22.375rem", "22.375rem"]}
			>
				<ModalHeader
					borderTopRadius="30px"
					bgColor={theme.bg.blueNavyLight}
					pt="1.5rem"
					pb="1rem"
					flexDirection="column"
				>
					<Flex flexDirection="column">
						<Flex alignItems="center" justifyContent="space-between" mb="1rem">
							<Flex
								justifyContent="space-between"
								w={["85%", "83%", "83%", "83%"]}
							>
								<Text fontSize="14px" fontWeight="semibold">
									{votersType === "favor" ? "For" : "Against"}
								</Text>
								{votersType === "favor" ? (
									<Flex fontSize="14px">
										<Text mr="0.563rem">50,634,749</Text>
										<Text fontWeight="400">/ 40,000,000</Text>
									</Flex>
								) : (
									<Flex>
										<Text fontSize="14px" fontWeight="semibold">
											390
										</Text>
									</Flex>
								)}
							</Flex>

							<Flex _hover={{ cursor: "pointer" }}>
								<MdClose size={22} onClick={onClose} color={theme.text.mono} />
							</Flex>
						</Flex>

						{votersType === "favor" ? (
							<Flex
								w={["85%", "83%", "83%", "83%"]}
								borderRadius="xl"
								h="0.375rem"
								bgColor="#48BB78"
							/>
						) : (
							<Flex
								w={["85%", "83%", "83%", "83%"]}
								borderRadius="xl"
								h="0.375rem"
								bgColor={theme.bg.voteGray}
								mb={["15px", "8px", "8px", "8px"]}
							>
								<Flex
									w="13%"
									borderRadius="xl"
									h="0.375rem"
									bgColor="#F56565"
									mb={["15px", "8px", "8px", "8px"]}
								/>
							</Flex>
						)}
					</Flex>
				</ModalHeader>
				<ModalBody
					bgColor={theme.bg.blueNavyLight}
					pb="6"
					pr={["2rem", "2.4rem", "2.4rem", "2.4rem"]}
					flexDirection="column"
				>
					<Flex flexDirection="column">
						<Flex
							justifyContent="space-between"
							color={theme.text.cyanPurple}
							fontSize="14px"
							mb="1.5rem"
						>
							<Text>2 addresses</Text>
							<Text>Votes</Text>
						</Flex>
						<Flex w="100%" flexDirection="column" fontSize="14px" pr="0.5rem">
							<Flex
								justifyContent="space-between"
								textTransform="lowercase"
								color={theme.text.mono}
								gap="2"
								alignItems="center"
								mb="3"
							>
								<Flex gap="2">
									<Jazzicon
										diameter={18}
										seed={Math.round(Math.random() * 10000000)}
									/>
									<Text fontSize="14px">0x6856...BF99</Text>
								</Flex>
								<Text>2.25</Text>
							</Flex>

							<Flex
								justifyContent="space-between"
								textTransform="lowercase"
								color={theme.text.mono}
								gap="2"
								alignItems="center"
							>
								<Flex gap="2">
									<Jazzicon
										diameter={18}
										seed={Math.round(Math.random() * 10000000)}
									/>
									<Text fontSize="14px">0x6856...BF99</Text>
								</Flex>
								<Text>12324.25</Text>
							</Flex>
						</Flex>
						<Button
							display={["flex", "none", "none", "none"]}
							mt="2.5rem"
							mb="3rem"
							fontWeight="semibold"
							w="100%"
							fontSize="16px"
							py="0.5rem"
							bgColor={theme.bg.blueNavyLightness}
							color={theme.text.cyan}
							_hover={{
								bgColor: theme.bg.bluePurple,
							}}
							borderRadius="full"
						>
							{votersType === "favor" ? "Vote in Favor" : "Vote Against"}
						</Button>
					</Flex>
				</ModalBody>
				<ModalFooter
					bgColor={theme.bg.blackAlpha}
					justifyContent="center"
					py="1.3rem"
					borderBottomRadius={["0", "30px", "30px", "30px"]}
					display={["none", "flex", "flex", "flex"]}
				>
					<Text
						fontSize="14px"
						color={theme.text.cyanPurple}
						_hover={{ cursor: "pointer" }}
						fontWeight="semibold"
					>
						{votersType === "favor" ? "Vote in Favor" : "Vote Against"}
					</Text>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
