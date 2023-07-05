import { useQuery } from "@apollo/client"
import { Qu_reveal } from "queries/reveal"
import { useEffect, useState } from "react"

const MAX_RETRIES = 5

export function useFetchRandomSeed(opHash: string | null) {
  const [retries, setRetries] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const { data, loading, refetch } = useQuery(Qu_reveal, {
    variables: {
      hash: opHash,
    },
    fetchPolicy: "no-cache",
    skip: !opHash,
    onError: () => {
      if (retries < MAX_RETRIES) {
        setRetries(retries + 1)
      } else {
        setError(new Error("Maximum retry attempts reached"))
      }
    },
  })

  useEffect(() => {
    if (data === null && retries < 3) refetch()
  }, [data, retries])

  return {
    loading,
    error,
    success: !error && !!data?.reveal,
    randomSeed: data?.reveal ?? null,
  }
}
