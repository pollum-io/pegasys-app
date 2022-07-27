import { Flex } from "@chakra-ui/react";
import { Swap } from "components";
import { DefaultTemplate } from "container";
import { NextPage } from "next";

export const HomeContainer: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<Swap />
	</DefaultTemplate>
);
