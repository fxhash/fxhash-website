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
            merge(existing, incoming, { args: { skip = 0 }, variables }) {
              const merged = existing ? existing.slice(0) : []
              // filter incoming for duplicates
              const singles = incoming.filter((a: any) => merged.find((b: any) => a.__ref === b.__ref) !== -1)
              for (let i = 0; i < singles.length; ++i) {
                merged[skip + i] = singles[i]
              }
              return merged
            },
          },
          activeListedObjkts: {
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
            merge(existing, incoming, { args: { skip = 0, take = 20 }}) {
              const merged = existing ? existing.slice(0) : []
              let j = 0
              mainLoop:
                for (let i = 0; i < incoming.length; ++i) {
                  if (existing) {
                    for (const item of existing) {
                      if (incoming[i].__ref === item.__ref) {
                        continue mainLoop
                      }
                    }
                  }
                  merged[skip + (j++)] = incoming[i]
                }
              return merged
            }
            
            // @ts-ignore
            //   // we populate a new array with max length, and copy the results
            //   const merged = []
            //   for (let i = 0, max = Math.max(skip+take, existing?.length || 0); i < max; i++) {
            //     merged[i] = existing?.[i] || null
            //   }
            //   // copy what's incoming into merge
            //   for (let i = 0; i < incoming.length; ++i) {
            //     merged[skip + i] = incoming[i]
            //   }
            //   return merged
            // },
            // read(existing, { args }) {
            //   const { skip, take } = args as any
            //   // check if we have all the items in the existing array
            //   if (!existing || existing.length < skip + take) {
            //     return undefined
            //   }
            //   const sub = []
            //   for (let i = skip; i < skip+take; i++) {
            //     if (!existing[i]) return undefined
            //     sub[i] = existing[i]
            //   }
            //   return sub
            // }
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
              let j = 0
              mainLoop:
                for (let i = 0; i < incoming.length; ++i) {
                  if (existing) {
                    for (const item of existing) {
                      if (incoming[i].__ref === item.__ref) {
                        continue mainLoop
                      }
                    }
                  }
                  merged[skip + (j++)] = incoming[i]
                }
              return merged
            },
          },
          listings: {
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
              let j = 0
              mainLoop:
                for (let i = 0; i < incoming.length; ++i) {
                  if (existing) {
                    for (const item of existing) {
                      if (incoming[i].__ref === item.__ref) {
                        continue mainLoop
                      }
                    }
                  }
                  merged[skip + (j++)] = incoming[i]
                }
              return merged
            },
          },
          listings: {
            keyArgs: false,
            // @ts-ignore
            merge(existing, incoming, { args: { skip = 0 }}) {
              const merged = existing ? existing.slice(0) : []
              let j = 0
              mainLoop:
                for (let i = 0; i < incoming.length; ++i) {
                  if (existing) {
                    for (const item of existing) {
                      if (incoming[i].__ref === item.__ref) {
                        continue mainLoop
                      }
                    }
                  }
                  merged[skip + (j++)] = incoming[i]
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