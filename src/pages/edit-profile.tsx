import { NextPage } from "next"
import { SectionHeader } from "../components/Layout/SectionHeader"
import { Spacing } from "../components/Layout/Spacing"
import ClientOnly from "../components/Utils/ClientOnly"
import { EditProfile } from "../containers/EditProfile"
import layout from "../styles/Layout.module.scss"
import cs from "classnames"
import { UserGuard } from "../components/Guards/UserGuard"
import Head from "next/head"


const EditProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — edit your profile</title>
        <meta key="description" property="description" content="edit your profile"/>
      </Head>

      <Spacing size="6x-large"/>

      <section>
        <SectionHeader>
          <h2>— edit profile</h2>
        </SectionHeader>

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <ClientOnly>
            <UserGuard>
              <EditProfile />
            </UserGuard>
          </ClientOnly>
        </main>
      </section>
    </>
  )
}

export default EditProfilePage