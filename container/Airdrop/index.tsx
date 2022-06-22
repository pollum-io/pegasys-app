import { DefaultTemplate } from "container";
import { NextPage } from "next";
import { Button, Flex, Text } from "@chakra-ui/react";
import { usePicasso } from "hooks";
import { PsysTokenAnimated } from "components";

export const AirdropContainer: NextPage = () => {
	const theme = usePicasso();

	return (
		<DefaultTemplate>
			<Flex pt="24" zIndex="1">
				<Flex
					width="17%"
					height="380px"
					bgColor={theme.bg.whiteGray}
					margin="0 auto"
					position="relative"
					justifyContent="space-between"
					borderRadius={30}
					p="5"
					flexDirection="column"
				>
					<Flex alignItems="center" justifyContent="center">
						<PsysTokenAnimated
							width="150px"
							height="150px"
							src="icons/logo_pegasys.svg"
						/>
					</Flex>

					<Flex alignItems="center" justifyContent="center">
						<Text
							background=" -webkit-linear-gradient(160deg, #0093e9 0%, #80d0c7 100%)"
							backgroundClip="text"
							TextFillColor="transparent"
							fontSize="5xl"
							fontWeight="bold"
						>
							1 $PSYS
						</Text>
					</Flex>

					<Flex>
						<Button
							w="100%"
							p="8"
							backgroundColor={theme.text.cyan}
							borderRadius="12"
							fontSize="lg"
						>
							Get Airdrop
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</DefaultTemplate>
	);
};
