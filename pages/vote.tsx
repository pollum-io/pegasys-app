import { VoteContainer, DefaultTemplate } from "container";
import type { NextPage } from "next";

import { GovernanceProvider } from "pegasys-services";

const Vote: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<GovernanceProvider>
			<VoteContainer />
		</GovernanceProvider>
	</DefaultTemplate>
);
export default Vote;
