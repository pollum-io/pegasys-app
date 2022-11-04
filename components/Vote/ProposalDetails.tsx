import { Button, Flex, Text } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";
import { usePicasso, useModal } from "hooks";
import Jazzicon from "react-jazzicon";
import { FunctionComponent } from "react";
import { CheckAllVotersModal } from "components/Modals/CheckAllVoters";
import { useGovernance } from "pegasys-services";

interface IProposalDetails {
	title?: string;
	status?: string;
	date?: string;
	description?: string;
	proposer?: string;
	against?: string;
	details?: string;
}

export const ProposalDetails: FunctionComponent<IProposalDetails> = props => {
	const {
		title = "Should the Pegasys community participate in the Protocol Guild Pilot?",
		status = "executed",
		date = "Ago 16, 2022 at 9:08 AM GMT-3",
		proposer = "0x6856...BF99",
		description,
		against = "390",
		details = "0x25aece71c96825BNJ6256vcsd3568DC98fA1",
	} = props;
	const theme = usePicasso();
	const { setIsGovernance, setVotersType } = useGovernance();
	const {
		onOpenCheckAllVotersModal,
		isOpenCheckAllVotersModal,
		onCloseCheckAllVotersModal,
	} = useModal();

	const isFavor = () => {
		setVotersType("favor");
		onOpenCheckAllVotersModal();
	};

	const isAgainst = () => {
		setVotersType("against");
		onOpenCheckAllVotersModal();
	};

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
				<Flex
					flexDirection="row"
					zIndex="docked"
					alignItems="center"
					gap="2"
					_hover={{ cursor: "pointer" }}
					onClick={() => setIsGovernance(false)}
				>
					<MdArrowBack size={21} color={theme.icon.whiteGray} />
					<Text
						fontSize="18px"
						fontWeight="semibold"
						color={theme.icon.whiteGray}
					>
						All Proposals
					</Text>
				</Flex>
				<Flex
					mt="0.875rem"
					w="100%"
					bgColor={theme.bg.blackAlpha}
					borderRadius="xl"
					h="max-content"
					boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
					flexDirection="column"
				>
					<Flex
						bgColor={theme.bg.blueNavy}
						h="max-content"
						w="100%"
						borderTopRadius="xl"
						flexDirection="column"
						pb={["2", "4", "4", "4"]}
					>
						<Flex
							flexDirection={["column", "column", "row", "row"]}
							justifyContent="flex-start"
							w={["91%", "65%", "60%", "60%"]}
							h="max-content"
							mt="1.5rem"
							py="1"
							backgroundColor={status === "executed" ? "#48BB78" : "#FC8181"}
							borderRightRadius="full"
							alignItems={["none", "none", "center", "center"]}
						>
							<Text
								fontWeight="semibold"
								color="white"
								fontSize="13"
								pl="1rem"
								textTransform="uppercase"
							>
								{status}
							</Text>
							<Text fontWeight="normal" color="white" fontSize="12px" pl="1rem">
								Voting ended {date}
							</Text>
						</Flex>
						<Flex mx={["4", "5", "5", "5"]} mt="4" flexDirection="column">
							<Text
								mr={["4", "4", "4", "0"]}
								fontWeight="semibold"
								color={theme.text.mono}
								fontSize={["16px", "16", "24px", "24px"]}
								mb="0.6rem"
							>
								{title}
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
									<Jazzicon
										diameter={18}
										seed={Math.round(Math.random() * 10000000)}
									/>
									<Text fontSize="14px">{proposer}</Text>
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
									<Flex
										justifyContent="space-between"
										w="full-content"
										pb={["4", "4", "4", "4"]}
										fontSize="14px"
										fontWeight="600"
										color={theme.text.mono}
									>
										<Text>For</Text>
										<Flex>
											<Text mr="0.563rem">50,634,749</Text>
											<Text fontWeight="400">/ 40,000,000</Text>
										</Flex>
									</Flex>
									<Flex
										w="100%"
										borderRadius="xl"
										h="0.375rem"
										bgColor="#48BB78"
										mb={["15px", "15px", "8px", "8px"]}
									/>
									<Flex
										justifyContent="space-between"
										alignItems="center"
										mt={["0", "0", "1.5", "1.5"]}
									>
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
										>
											Vote in Favor
										</Button>
										<Text
											fontSize="12px"
											_hover={{ cursor: "pointer", opacity: "0.9" }}
											transition="100ms ease-in-out"
											onClick={isFavor}
											color="#718096"
										>
											Check all voters
										</Text>
									</Flex>
								</Flex>
								<Flex
									justifyContent="space-between"
									flexDirection="column"
									w={["100%", "100%", "46%", "46%"]}
								>
									<Flex
										justifyContent="space-between"
										w="full-content"
										pb={["4", "4", "4", "4"]}
										fontSize="14px"
										fontWeight="600"
										color={theme.text.mono}
									>
										<Text color="">Against</Text>
										<Flex>
											<Text>{against}</Text>
										</Flex>
									</Flex>
									<Flex
										w="100%"
										borderRadius="xl"
										h="0.375rem"
										bgColor={theme.bg.voteGray}
										mb={["15px", "15px", "8px", "8px"]}
									>
										<Flex
											w="3.313rem"
											borderRadius="xl"
											h="0.375rem"
											bgColor="#F56565"
											mb={["15px", "15px", "8px", "1rem"]}
										/>
									</Flex>
									<Flex
										justifyContent="space-between"
										alignItems="center"
										mt={["0", "0", "1.5", "1.5"]}
									>
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
										>
											Vote Against
										</Button>
										<Text
											fontSize="12px"
											_hover={{ cursor: "pointer", opacity: "0.9" }}
											transition="100ms ease-in-out"
											onClick={isAgainst}
											color="#718096"
										>
											Check all voters
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
					<Flex
						mx={["4", "5", "5", "5"]}
						mt={["7", "6", "6", "6"]}
						flexDirection="column"
						gap="7"
					>
						<Flex
							justifyContent="flex-start"
							w="100%"
							gap="3"
							flexDirection="column"
							color={theme.text.mono}
						>
							<Text fontWeight="bold">Details</Text>
							<Flex w="100%" flexDirection={["column", "column", "row", "row"]}>
								<Text>1:</Text>
								<Text
									color={theme.text.cyanPurple}
									ml={["0", "0", "0.438rem", "0.438rem"]}
									_hover={{ cursor: "pointer" }}
								>
									{details}
								</Text>
								<Text>.UNKNOWN()</Text>
							</Flex>
						</Flex>
						<Flex
							justifyContent="flex-start"
							w="full-content"
							gap="3"
							flexDirection="column"
						>
							<Text color={theme.text.mono} fontWeight="bold">
								Description
							</Text>
							<Flex mb="2rem">
								<Text color={theme.text.mono}>
									Sponsored by GFX Labs for MiLLie Since the lorem ipsum dolor
									sit amet, consectetur adipiscing elit. Viverra eu lectus
									tellus vitae convallis morbi nibh leo. Enim leo, fames massa
									molestie pulvinar ut dolor ante enim. Eleifend consectetur
									gravida quis arcu vel quis amet, sed. Quis non convallis
									elementum, viverra ornare ornare velit arcu eget. Phasellus
									amet bibendum ornare ultricies at. Fermentum dictum amet quis
									mauris, amet, integer fringilla non placerat. Elit rhoncus
									suscipit purus augue. Auctor at sollicitudin varius semper
									scelerisque. In eget massa vitae in vitae duis. Neque
									convallis (massa ut sit mus consequat), adipiscing parturient
									pulvinar. Ut senectus at orci egestas proin fames eu. Sed
									volutpat nam vestibulum, consequat tortor. Est, sed molestie
									sem neque, malesuada. Ultrices tempus, volutpat dui turpis
									vitae mattis in. Rhoncus turpis malesuada a non, scelerisque
									sit libero pellentesque morbi. Amet, dapibus leo felis,
									aliquam rutrum mi cursus. Tortor pellentesque id nam bibendum
									tincidunt. Ullamcorper mi et amet arcu vel pellentesque
									sollicitudin accumsan pretium. Eleifend cras augue lorem eu,
									libero pretium condimentum egestas. Netus vulputate id
									ullamcorper praesent egestas. Lacus tortor vel, in scelerisque
									velit, feugiat nisl ligula nam. In id semper scelerisque in
									lectus non sit. Praesent suspendisse justo etiam tellus amet
									dolor gravida id. More info can be found on the consensus
									check forum thread.
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
