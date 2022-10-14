import {
  ApolloClient,
  FieldFunctionOptions,
  InMemoryCache,
} from "@apollo/client"

/**
 * Given a set of existing data, incoming data and pagination arguments,
 * merges incoming with existing **while ignoring incoming duplicates already
 * stored in existing**.
 */
export function cacheMergePaginatedField(
  existing: any[] = [],
  incoming: any[],
  { args }: FieldFunctionOptions<any>
): any[] {
  // shallow copy existing array
  const merged = [...existing]
  const { skip } = args || { skip: 0 }
  let j = 0
  mainLoop: for (let i = 0; i < incoming.length; ++i) {
    // we check for duplicates in the existing cache
    if (existing) {
      for (const item of existing) {
        // if there's  duplicate, we ignore the incoming one and continue
        if (incoming[i].__ref === item.__ref) {
          continue mainLoop
        }
      }
    }
    // add the incoming to the merge array
    merged[skip + j++] = incoming[i]
  }
  return merged
}

export const clientSideClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_ROOT,
  cache: new InMemoryCache({
    typePolicies: {
      GenerativeToken: {
        fields: {
          actions: {
            keyArgs: ["filters"],
            merge: cacheMergePaginatedField,
          },
          activeListedObjkts: {
            keyArgs: ["filters", "sort"],
            merge: cacheMergePaginatedField,
          },
          objkts: {
            keyArgs: ["sort", "featureFilters", "filters"],
            merge: cacheMergePaginatedField,
          },
        },
      },
      User: {
        fields: {
          generativeTokens: {
            keyArgs: false,
            merge: cacheMergePaginatedField,
          },
          objkts: {
            keyArgs: ["sort", "filters"],
            merge: cacheMergePaginatedField,
          },
          listings: {
            keyArgs: false,
            merge: cacheMergePaginatedField,
          },
          articles: {
            keyArgs: false,
            merge: cacheMergePaginatedField,
          },
          actions: {
            keyArgs: false,
            merge: cacheMergePaginatedField,
          },
          sales: {
            keyArgs: false,
            merge: cacheMergePaginatedField,
          },
        },
      },
      Listing: {
        keyFields: ["id", "version"],
      },
      Query: {
        fields: {
          generativeTokens: {
            keyArgs: ["sort", "filters"],
            merge: cacheMergePaginatedField,
          },
          articles: {
            keyArgs: ["sort", "filters"],
            merge: cacheMergePaginatedField,
          },
          listings: {
            keyArgs: ["sort", "filters"],
            merge: cacheMergePaginatedField,
          },
        },
      },
    },
  }),
})

export function createApolloClient() {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_ROOT,
    cache: new InMemoryCache(),
    ssrMode: true,
    ssrForceFetchDelay: 1000,
  })
}
