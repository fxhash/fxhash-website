import { useEffect, useState } from "react"

const fetchRandomSeed = async (opHash: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(opHash)
    }, 1000)
  })
}

export function useFetchRandomSeed(opHash: string | null) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [randomSeed, setRandomSeed] = useState<string | null>(null)

  useEffect(() => {
    if (!opHash) return
    setLoading(true)
    setSuccess(false)
    setError(null)

    fetchRandomSeed(opHash)
      .then((seed) => {
        setRandomSeed(seed)
        setSuccess(true)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [opHash])

  return { loading, error, success, randomSeed }
}
