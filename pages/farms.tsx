import { DefaultTemplate, FarmContainer } from "container";
import type { NextPage } from "next";

const Farms: NextPage = () => (
	<DefaultTemplate widthValue="100%" heightValue="100vh">
		<FarmContainer />
	</DefaultTemplate>
);

export default Farms;
