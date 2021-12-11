import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { useRef, useEffect, memo, ReactElement, ReactNode } from 'react'
import { useRouter } from 'next/router'
import NextNprogress from 'nextjs-progressbar'
import Head from "next/head"
import { Root } from '../containers/Root'
import { NextPage } from 'next'

const ROUTES_TO_RETAIN = ['/explore', '/marketplace', '/marketplace/collections']

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter()
  const retainedComponents = useRef<any>({})

  const isRetainableRoute = ROUTES_TO_RETAIN.includes(router.asPath)

  // if the current route is stored in memory and is loaded now, reset its index
  if (retainedComponents.current[router.asPath]) {
    retainedComponents.current[router.asPath].index = -1 // -1 because it will be incremented just after
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
  }, [router.asPath])

  // Add Component to retainedComponents if we haven't got it already
  if (isRetainableRoute && !retainedComponents.current[router.asPath]) {
    const MemoComponent = memo(Component)
    retainedComponents.current[router.asPath] = {
      component: <MemoComponent {...pageProps} />,
      scrollPos: 0,
      index: 0
    }
  }

  // Save the scroll position of current page before leaving
  const handleRouteChangeStart = (url: any) => {
    // first we clear the existing retained components, so that only the last one remains
    if (isRetainableRoute) {
      retainedComponents.current[router.asPath].scrollPos = window.scrollY
    }
  }

  // Save scroll position - requires an up-to-date router.asPath
  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.asPath])

  // Scroll to the saved position when we load a retained component
  useEffect(() => {
    if (isRetainableRoute && retainedComponents.current[router.asPath]) {
      window.scrollTo(0, retainedComponents.current[router.asPath].scrollPos)
    }
  }, [Component, pageProps])

  // custom layout for the components
  const subLayout = Component.getLayout ?? ((page) => page)
  console.log(subLayout)

  return (
    <>
      <Head>
        <meta key="og:title" property="og:title" content="fxhash — blockchain generative art"/> 
        <meta key="description" name="description" content="fxhash is a platform to mint Generative Tokens on the Tezos blockchain"/>
        <meta key="og:description" property="og:description" content="fxhash is a platform to mint Generative Tokens on the Tezos blockchain"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#ffffff"/>
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>

      <NextNprogress color="#7000FF" />

      {process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1" ? (
        <Component {...pageProps} />
      ):(
        <Root>
          <>
            <div style={{ display: isRetainableRoute ? 'block' : 'none' }}>
              {Object.entries(retainedComponents.current).map(([path, c]: any) => (
                <div
                  key={path}
                  style={{ display: router.asPath === path ? 'block' : 'none' }}
                >
                  {c.component}
                </div>
              ))}
            </div>

            {!isRetainableRoute && (
              subLayout(<Component {...pageProps} />)
            )}
          </>
        </Root>
      )}
    </>
  )
}

export default App