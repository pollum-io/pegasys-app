import { DefaultTemplate, FarmContainer } from "container";
import type { NextPage } from "next";

import { FarmProvider } from "pegasys-services";

const Farms: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<FarmProvider>
			<FarmContainer />
		</FarmProvider>
	</DefaultTemplate>
);

export default Farms;
