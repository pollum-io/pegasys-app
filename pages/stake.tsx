import { DefaultTemplate, StakeContainer } from "container";
import type { NextPage } from "next";

import { StakeProvider, StakeV2Provider, EarnProvider } from "pegasys-services";

const Stake: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<EarnProvider>
			<StakeProvider>
				<StakeV2Provider>
					<StakeContainer />
				</StakeV2Provider>
			</StakeProvider>
		</EarnProvider>
	</DefaultTemplate>
);

export default Stake;
