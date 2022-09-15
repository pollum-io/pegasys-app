import { DefaultTemplate, PortfolioContainer } from "container";
import type { NextPage } from "next";

const Portfolio: NextPage = () => (
	<DefaultTemplate
		widthValue="100%"
		heightValue="100vh"
		alignItemsValue="center"
	>
		<PortfolioContainer />
	</DefaultTemplate>
);

export default Portfolio;
