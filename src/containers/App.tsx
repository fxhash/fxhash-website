import type { AppProps } from "next/app"
import {
  useRef,
  useEffect,
  memo,
  useMemo,
  ReactElement,
  ReactNode,
  useCallback,
} from "react"
import { useRouter } from "next/router"
import NextNprogress from "nextjs-progressbar"
import Head from "next/head"
import { Root } from "../containers/Root"
import { NextPage } from "next"
import { disableIosTextFieldZoom } from "../utils/mobile"

const ROUTES_TO_RETAIN = [
  "/explore",
  "/explore/incoming",
  "/explore/articles",
  "/marketplace",
  "/marketplace/collections",
]

export type TPageLayoutComponent = (page: ReactElement) => ReactNode

export type NextPageWithLayout<T = {}> = NextPage<T> & {
  getLayout?: TPageLayoutComponent
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout<any>
}

export const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter()
  const retainedComponents = useRef<any>({})

  const isRetainableRoute = ROUTES_TO_RETAIN.includes(router.pathname)

  const handlePageLoad = useCallback(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any)["MSStream"]
    if (isIOS) {
      disableIosTextFieldZoom()
    }
  }, [])

  // if the current route is stored in memory and is loaded now, reset its index
  if (retainedComponents.current[router.pathname]) {
    retainedComponents.current[router.pathname].index = -1 // -1 because it will be incremented just after
  }

  // clear the retained component if they reach a threshold
  useEffect(() => {
    for (const key in retainedComponents.current) {
      // update the index of all the components currently retained
      retainedComponents.current[key].index++
      // if the index is over a certain threshold, simply remove if from the list of retained
      if (retainedComponents.current[key].index > 2) {
        delete retainedComponents.current[key]
      }
    }
  }, [router.pathname])

  // Add Component to retainedComponents if we haven't got it already
  if (isRetainableRoute && !retainedComponents.current[router.pathname]) {
    const MemoComponent = memo(Component)
    retainedComponents.current[router.pathname] = {
      component: <MemoComponent {...pageProps} />,
      scrollPos: 0,
      index: 0,
    }
  }

  // Save the scroll position of current page before leaving
  const handleRouteChangeStart = (url: any) => {
    // first we clear the existing retained components, so that only the last one remains
    if (isRetainableRoute) {
      retainedComponents.current[router.pathname].scrollPos = window.scrollY
    }
  }

  // Save scroll position - requires an up-to-date router.pathname
  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart)
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart)
    }
  }, [router.pathname])

  // Scroll to the saved position when we load a retained component
  useEffect(() => {
    if (isRetainableRoute && retainedComponents.current[router.pathname]) {
      window.scrollTo(0, retainedComponents.current[router.pathname].scrollPos)
    }
  }, [Component, pageProps])

  useEffect(() => {
    router.events.on("routeChangeComplete", handlePageLoad)
    return () => {
      router.events.off("routeChangeComplete", handlePageLoad)
    }
  }, [handlePageLoad, router.events])
  useEffect(() => {
    handlePageLoad()
  }, [handlePageLoad])

  // custom layout for the components
  const subLayout = Component.getLayout ?? ((page) => page)

  // we sort the retained components by visisble
  // this way we render the visible component at last
  // which is helpfull to prevent race conditions between
  // visible and invisible effects
  const sortedRetainedComponentEntries = useMemo(
    () =>
      Object.entries(retainedComponents.current).sort((a, b) => {
        const isVisibleA = a[0] === router.pathname
        const isVisibleB = b[0] === router.pathname
        return isVisibleA === isVisibleB ? 0 : isVisibleA ? 1 : -1
      }),
    [retainedComponents.current, router.pathname]
  )

  return (
    <>
      <Head>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — blockchain generative art"
        />
        <meta
          key="description"
          name="description"
          content="fxhash is a platform to mint Generative Tokens on the Tezos blockchain"
        />
        <meta
          key="og:description"
          property="og:description"
          content="fxhash is a platform to mint Generative Tokens on the Tezos blockchain"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>

      <NextNprogress color="#7000FF" showOnShallow={false} />

      {process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1" ? (
        <Component {...pageProps} />
      ) : (
        <Root {...pageProps}>
          <>
            <div style={{ display: isRetainableRoute ? "block" : "none" }}>
              {sortedRetainedComponentEntries.map(([path, c]: any) => (
                <div
                  key={path}
                  style={{
                    display: router.pathname === path ? "block" : "none",
                  }}
                >
                  {c.component}
                </div>
              ))}
            </div>

            {!isRetainableRoute && subLayout(<Component {...pageProps} />)}
          </>
        </Root>
      )}
    </>
  )
}

export default App
