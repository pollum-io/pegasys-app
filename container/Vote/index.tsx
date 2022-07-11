import { Flex, Img, Text } from "@chakra-ui/react";
import { DefaultTemplate } from "container";
import { NextPage } from "next";

export const VoteContainer: NextPage = () => (
	<DefaultTemplate>
		<Flex
			w="100%"
			h="100%"
			alignItems="flex-start"
			justifyContent="center"
			pt="24"
		>
			<Flex flexDirection="column" maxW="xl" alignItems="center">
				<Flex
					flexDirection="column"
					zIndex="docked"
					position="relative"
					borderRadius="xl"
				>
					<Img
						borderRadius="xl"
						src="images/backgrounds/1.png"
						position="absolute"
						zIndex="base"
						w="100%"
						h="100%"
						objectFit="none"
						opacity="0.4"
						objectPosition="25% 20%"
					/>
					<Flex zIndex="docked" flexDirection="column" px="4" py="4" gap="3">
						<Text fontWeight="medium" color="white">
							Pegasys Governance
						</Text>
						<Text fontWeight="medium" fontSize="sm" color="white">
							PSYS tokens represent voting shares in Pegasys governance. You can
							vote on each proposal yourself or delegate your votes to a third
							party.
						</Text>
						<Text fontWeight="medium" fontSize="sm" color="white">
							To be eligible to vote, you must hold PSYS in your wallet and
							delegate it at the start of voting. After voting has begun, you
							may pool or spend your PSYS.
						</Text>
						<Text fontWeight="medium" fontSize="sm" color="white">
							Governance votes are decided by simple majority. There is no
							quorum threshold.
						</Text>
					</Flex>
				</Flex>
				<Flex
					alignItems="flex-start"
					my="4"
					justifyContent="flex-start"
					w="100%"
					flexDirection="column"
				>
					<Flex
						mt="4"
						flexDirection="row"
						justifyContent="space-between"
						w="100%"
					>
						<Text fontSize="20" fontWeight="medium">
							Proposals
						</Text>
					</Flex>
				</Flex>
				<Flex
					w="100%"
					p="2"
					mb="5"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					border="1px solid"
					borderRadius="xl"
					borderColor="rgba(255, 255, 255, 0.16)"
					fontWeight="normal"
					gap="3"
				>
					<Text w="max-content">No proposals found.</Text>
					<Text w="max-content" fontStyle="italic">
						Proposals submitted by community members will appear here.
					</Text>
				</Flex>
				<Text opacity="0.6" w="max-content" fontSize="sm">
					A minimum threshold of 1,000,000 PSYS is required to submit proposals
				</Text>
			</Flex>
		</Flex>
	</DefaultTemplate>
);
