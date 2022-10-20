import { DefaultTemplate, StakeContainer } from "container";
import type { NextPage } from "next";

import { StakeProvider } from "pegasys-services";

const Stake: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<StakeProvider>
			<StakeContainer />
		</StakeProvider>
	</DefaultTemplate>
);
g
export default Stake;
