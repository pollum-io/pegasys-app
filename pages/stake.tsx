import { DefaultTemplate, StakeContainer } from "container";
import type { NextPage } from "next";

import { StakeV2Provider } from "pegasys-services";

const Stake: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<StakeV2Provider>
			<StakeContainer />
		</StakeV2Provider>
	</DefaultTemplate>
);

export default Stake;
