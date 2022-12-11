import { NextPage, GetStaticProps } from "next"
import Head from "next/head"
import PressKitPage, {
  PressKitTabKey,
  pressKitTabs,
} from "containers/Presskit/Page"

interface PresskitPageProps {
  tab: PressKitTabKey
}

const PressKitTabPage: NextPage<PresskitPageProps> = ({ tab }) => {
  return (
    <>
      <Head>
        <title>fxhash — press kit</title>
        <meta key="og:title" property="og:title" content="fxhash — press kit" />
        <meta
          key="description"
          name="description"
          content="The press kit of fxhash"
        />
        <meta
          key="og:description"
          property="og:description"
          content="The press kit of fxhash"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>
      <PressKitPage tab={tab} />
    </>
  )
}

// Generates `/posts/1` and `/posts/2`
export async function getStaticPaths() {
  const paths = pressKitTabs.map((tab) => ({
    params: {
      slug: [tab],
    },
  }))
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  }
}

export const getStaticProps: GetStaticProps<PresskitPageProps> = async ({
  params,
}) => {
  const tab = (params?.slug?.[0] || "fxhash") as PressKitTabKey
  if (pressKitTabs.indexOf(tab) > -1) {
    return {
      props: {
        tab,
      },
    }
  } else {
    return {
      props: {},
      notFound: true,
    }
  }
}

export default PressKitTabPage
