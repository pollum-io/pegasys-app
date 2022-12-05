import { Swap } from "components";
import { DefaultTemplate } from "container";
import { NextPage } from "next";

import { SwapProvider } from "pegasys-services";

export const HomeContainer: NextPage = () => (
	<DefaultTemplate
		widthValue="100%"
		heightValue="100vh"
		alignItemsValue="center"
	>
		<SwapProvider>
			<Swap />
		</SwapProvider>
	</DefaultTemplate>
);
