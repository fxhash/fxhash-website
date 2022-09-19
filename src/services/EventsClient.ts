import { ApolloClient, InMemoryCache } from "@apollo/client"


/**
 * The client to connect to the events graphql endpoint
 */
export const eventsClient = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_API_EVENTS_ROOT!}/graphql`,
  cache: new InMemoryCache(),
  // ssrMode: true,
  // ssrForceFetchDelay: 1000
})