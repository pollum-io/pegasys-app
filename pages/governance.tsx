import { DefaultTemplate, VoteContainer } from "container";
import type { NextPage } from "next";

import { GovernanceProvider } from "pegasys-services";

const Governance: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<GovernanceProvider>
			<VoteContainer />
		</GovernanceProvider>
	</DefaultTemplate>
);

export default Governance;
