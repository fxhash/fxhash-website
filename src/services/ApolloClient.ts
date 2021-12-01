import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_ROOT,
  cache: new InMemoryCache(),
  ssrMode: true,
  ssrForceFetchDelay: 1000
})

export const clientSideClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_ROOT,
  cache: new InMemoryCache({
    typePolicies: {
      GenerativeToken: {
        fields: {
          actions: {
            keyArgs: false,
            // @ts-ignore
            merge(existing, incoming, { args: { skip = 0 }}) {
              const merged = existing ? existing.slice(0) : []
              // filter incoming for duplicates
              const singles = incoming.filter((a: any) => merged.find((b: any) => a.__ref === b.__ref) !== -1)
              for (let i = 0; i < singles.length; ++i) {
                merged[skip + i] = singles[i]
              }
              return merged
            },
          },
        }
      },
      User: {
        fields: {
          generativeTokens: {
            keyArgs: false,
            // @ts-ignore
            merge(existing, incoming, { args: { skip = 0 }}) {
              const merged = existing ? existing.slice(0) : []
              for (let i = 0; i < incoming.length; ++i) {
                merged[skip + i] = incoming[i]
              }
              return merged
            },
          },
          objkts: {
            keyArgs: false,
            // @ts-ignore
            merge(existing, incoming, { args: { skip = 0 }}) {
              const merged = existing ? existing.slice(0) : []
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
          },
          actions: {
            keyArgs: false,
            // @ts-ignore
            merge(existing, incoming, { args: { skip = 0 }}) {
              const merged = existing ? existing.slice(0) : []
              for (let i = 0; i < incoming.length; ++i) {
                merged[skip + i] = incoming[i]
              }
              return merged
            },
          },
        }
      },
      Query: {
        fields: {
          generativeTokens: {
            keyArgs: false,
            // @ts-ignore
            merge(existing, incoming, { args: { skip = 0 }}) {
              const merged = existing ? existing.slice(0) : []
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