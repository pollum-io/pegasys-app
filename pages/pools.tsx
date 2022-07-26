import { DefaultTemplate, PoolsContainer } from "container";
import { WalletProvider } from "contexts";
import type { NextPage } from "next";

const Pools: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<PoolsContainer />
	</DefaultTemplate>
);

export default Pools;
