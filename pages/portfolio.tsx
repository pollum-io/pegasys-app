import { DefaultTemplate, PortfolioContainer } from "container";
import { PoolsProvider } from "contexts";
import { PortfolioProvider } from "contexts/portfolio";
import type { NextPage } from "next";

const Portfolio: NextPage = () => (
	<DefaultTemplate
		widthValue="100%"
		heightValue="100vh"
		alignItemsValue="center"
	>
		<PoolsProvider>
			<PortfolioProvider>
				<PortfolioContainer />
			</PortfolioProvider>
		</PoolsProvider>
	</DefaultTemplate>
);

export default Portfolio;
