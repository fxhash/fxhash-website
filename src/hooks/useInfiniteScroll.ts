import { useEffect, useRef } from "react"

interface UseInfiniteScrollProps {
  loading: boolean
  itemLength: number
  offsetTop?: number
  onFetchMore: () => void
}

export const useInfiniteScroll = ({
  loading,
  itemLength = 0,
  offsetTop = 0,
  onFetchMore,
}: UseInfiniteScrollProps) => {
  // reference to the element at the top
  const topMarkerRef = useRef<HTMLDivElement>(null)

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const onEndReached = () => {
    !ended.current && onFetchMore()
  }

  const scrollToTop = () => {
    const top = (topMarkerRef.current?.offsetTop || 0) + offsetTop
    if (window.scrollY > top) {
      window.scrollTo(0, top)
    }

    currentLength.current = 0
    ended.current = false
  }

  // prevents reloading on scroll if we have reached the end
  useEffect(() => {
    if (!loading) {
      if (currentLength.current === itemLength) {
        ended.current = true
      } else {
        currentLength.current = itemLength || 0
      }
    }
  }, [loading])

  return {
    topMarkerRef,
    onEndReached,
    scrollToTop,
  }
}
