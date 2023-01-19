import { DefaultTemplate, PortfolioContainer } from "container";
import { PortfolioProvider } from "contexts/portfolio";
import type { NextPage } from "next";

const Portfolio: NextPage = () => (
	<DefaultTemplate
		widthValue="100%"
		heightValue="100vh"
		alignItemsValue="center"
	>
		<PortfolioProvider>
			<PortfolioContainer />
		</PortfolioProvider>
	</DefaultTemplate>
);

export default Portfolio;
