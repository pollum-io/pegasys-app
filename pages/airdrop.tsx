import { AirdropContainer, DefaultTemplate } from "container";
import type { NextPage } from "next";

const Airdrop: NextPage = () => (
	<DefaultTemplate
		widthValue="100%"
		heightValue="100vh"
		alignItemsValue="center"
	>
		<AirdropContainer />
	</DefaultTemplate>
);

export default Airdrop;
