import { PortfolioContext } from "contexts/portfolio";
import { useContext } from "react";

export function usePortfolio() {
	return useContext(PortfolioContext);
}
