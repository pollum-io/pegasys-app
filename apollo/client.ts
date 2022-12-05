import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

export const pegasysCandlesClient = new ApolloClient({
	link: new HttpLink({
		uri: "https://graph.pegasys.finance/subgraphs/name/pollum-io/pegasyscandles",
	}),
	cache: new InMemoryCache(),
});

export const pegasysClient = new ApolloClient({
	link: new HttpLink({
		uri: "https://graph.pegasys.finance/subgraphs/name/pollum-io/pegasys",
	}),
	cache: new InMemoryCache(),
});

export const blockClient = new ApolloClient({
	link: new HttpLink({
		uri: "https://graph.pegasys.finance/subgraphs/name/pollum-io/syscoin-blocks",
	}),
	cache: new InMemoryCache(),
});

export const governanceClient = new ApolloClient({
	link: new HttpLink({
		uri: "https://graph.pegasys.finance/subgraphs/name/pollum-io/pegasys-governance",
	}),
	cache: new InMemoryCache(),
});
