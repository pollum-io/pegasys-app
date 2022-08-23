import { DefaultTemplate, PoolsContainer } from "container";
import type { NextPage } from "next";

const Pools: NextPage = () => (
	<DefaultTemplate
		widthValue="100%"
		heightValue="100vh"
		alignItemsValue="center"
	>
		<PoolsContainer />
	</DefaultTemplate>
);

export default Pools;
