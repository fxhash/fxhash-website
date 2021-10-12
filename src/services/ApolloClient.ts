import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_INDEXER_ROOT,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          generativeTokens: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: false,
            // Concatenate the incoming list items with
            // the existing list items.
            // @ts-ignore
            merge(existing, incoming, { args: { skip = 0 }}) {
              // Slicing is necessary because the existing data is
              // immutable, and frozen in development.
              const merged = existing ? existing.slice(0) : []
              // prevent items with the same ID from being inserted
              // const ids = merged.map((item: any) => item.id)
              // const filtered = incoming.filter((item: any) => !ids.includes(item.id))
              // console.log({ ids, filtered })
              for (let i = 0; i < incoming.length; ++i) {
                merged[skip + i] = incoming[i]
              }
              return merged
            },
          },
          offers: {
            keyArgs: false,
            // @ts-ignore
            merge(existing, incoming, { args: { skip = 0 }}) {
              const merged = existing ? existing.slice(0) : []
              for (let i = 0; i < incoming.length; ++i) {
                merged[skip + i] = incoming[i]
              }
              return merged
            },
          }
        }
      }
    }
  })
})

export default client