import type { GetStaticProps, NextPage } from 'next'
import layout from '../styles/Layout.module.scss'
import cs from 'classnames'
import style from "../styles/pages/about.module.scss"
import { Spacing } from '../components/Layout/Spacing'
import { SectionHeader } from '../components/Layout/SectionHeader'
import ClientOnly from '../components/Utils/ClientOnly'
import { ExploreGenerativeTokens } from '../containers/ExploreGenerativeTokens'
import Head from 'next/head'
import { TitleHyphen } from '../components/Layout/TitleHyphen'
import { ExploreTabs } from '../containers/Explore/ExploreTabs'
import { SectionTitle } from '../components/Layout/SectionTitle'
import { getDocDefinition, IDocPage } from '../services/LocalFiles'
import { DocHomeCategory } from '../components/Doc/DocHomeCategory'


interface IProps {
  definition: IDocPage
}
const Explore: NextPage<IProps> = ({ definition }) => {
  return (
    <>
      <Head>
        <title>fxhash — about</title>
        <meta key="og:title" property="og:title" content="fxhash — about"/>
        <meta key="description" name="description" content="General informations on the usage of the FXH platform"/>
        <meta key="og:description" property="og:description" content="General informations on the usage of the FXH platform"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>

      <Spacing size="3x-large" />

      <section>
        <SectionHeader layout="center">
          <SectionTitle>{ definition.title }</SectionTitle>
        </SectionHeader>

        <Spacing size="large"/>

        <div className={cs(style.content, layout['padding-big'])}>
          <p className={cs(style.description)}>
            { definition.description }
          </p>

          <Spacing size="4x-large"/>

          <div className={cs(style.categories)}>
            {definition.categories.map((category, idx) => (
              <DocHomeCategory
                key={idx}
                category={category}
              />
            ))}
          </div>
        </div>

      </section>

      <Spacing size="6x-large" sm="5x-large" />
      <Spacing size="6x-large" sm="none" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // fetch the about description file
  const definition = await getDocDefinition()

  return {
    props: {
      definition
    }
  }
}

export default Explore
