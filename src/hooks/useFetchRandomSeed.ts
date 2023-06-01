import { useQuery } from "@apollo/client"
import { Qu_reveal } from "queries/reveal"

export function useFetchRandomSeed(opHash: string | null) {
  const { data, loading, error } = useQuery(Qu_reveal, {
    variables: {
      hash: opHash,
    },
    fetchPolicy: "no-cache",
    skip: !opHash,
  })

  return {
    loading,
    error,
    success: !error && !!data?.reveal,
    randomSeed: data?.reveal ?? null,
  }
}
