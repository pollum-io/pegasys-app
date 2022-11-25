import { DefaultTemplate, PoolsContainer } from "container";
import { PoolsProvider } from "contexts/pools";
import type { NextPage } from "next";

const Pools: NextPage = () => (
	<DefaultTemplate
		widthValue="100%"
		heightValue="100vh"
		alignItemsValue="center"
	>
		<PoolsProvider>
			<PoolsContainer />
		</PoolsProvider>
	</DefaultTemplate>
);

export default Pools;
