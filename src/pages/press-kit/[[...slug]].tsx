import { NextPage, GetStaticProps } from "next"
import PressKitPage, {
  PressKitTabKey,
  pressKitTabs,
} from "containers/Presskit/Page"

interface PresskitPageProps {
  tab: PressKitTabKey
}

const PressKitTabPage: NextPage<PresskitPageProps> = ({ tab }) => {
  return <PressKitPage tab={tab} />
}

// Generates `/posts/1` and `/posts/2`
export async function getStaticPaths() {
  const paths = pressKitTabs.map((tab) => ({
    params: {
      slug: [tab == "fxhash" ? "" : tab],
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
