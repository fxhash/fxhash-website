import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.API_INDEXER_ROOT,
  cache: new InMemoryCache()
})

export default client