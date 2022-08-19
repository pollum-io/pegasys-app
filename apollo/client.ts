import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

export const apolloClient = new ApolloClient({
	link: new HttpLink({
		uri: "https://graph.pegasys.exchange/subgraphs/name/pollum-io/pegasyscandles",
	}),
	cache: new InMemoryCache(),
});
