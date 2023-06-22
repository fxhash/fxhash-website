import { useEffect, useState } from "react"

const useInit = (callback: Function, ...args: any[]) => {
  const [mounted, setMounted] = useState(false)

  const resetInit = () => setMounted(false)

  useEffect(() => {
    if (!mounted) {
      setMounted(true)
      callback(...args)
    }
  }, [mounted, callback])

  return [resetInit]
}
export default useInit
