import { NextPage } from "next"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { Spacing } from "../../components/Layout/Spacing"
import ClientOnly from "../../components/Utils/ClientOnly"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { UserGuard } from "../../components/Guards/UserGuard"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import Head from "next/head"
import { CollaborationsList } from "../../containers/Collaborations/CollaborationsList"
import { CollaborationCreate } from "../../containers/Collaborations/CollaborationCreate"


const CollaborationsIndex: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — your collaborations</title>
        <meta key="description" name="description" content="your collaborations"/>
      </Head>

      <Spacing size="6x-large"/>

      <section>
        <SectionHeader>
          <TitleHyphen>your collaborations</TitleHyphen>
          <ClientOnly>
            <UserGuard>
              <CollaborationCreate/>
            </UserGuard>
          </ClientOnly>
        </SectionHeader>

        <Spacing size="6x-large"/>

        <main className={cs(layout['padding-big'])}>
          <ClientOnly>
            <UserGuard>
              <CollaborationsList/>
            </UserGuard>
          </ClientOnly>
        </main>
      </section>

      <Spacing size="6x-large"/>
    </>
  )
}

export default CollaborationsIndex