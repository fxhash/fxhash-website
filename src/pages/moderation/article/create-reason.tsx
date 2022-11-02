import { NextPage } from "next"
import { SectionHeader } from "../../../components/Layout/SectionHeader"
import { Spacing } from "../../../components/Layout/Spacing"
import ClientOnly from "../../../components/Utils/ClientOnly"
import layout from "../../../styles/Layout.module.scss"
import cs from "classnames"
import { UserGuard } from "../../../components/Guards/UserGuard"
import { TitleHyphen } from "../../../components/Layout/TitleHyphen"
import Head from "next/head"
import { isUserArticleModerator } from "../../../utils/user"
import { User } from "../../../types/entities/User"
import { ModerationReasons } from "../../../containers/Moderation/ModerationReasons"
import { CreateModerationReason } from "../../../components/Moderation/Reason/CreateModerationReason"

const CreateArticleModerationReason: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — create moderation reason for articles</title>
        <meta
          key="description"
          name="description"
          content="create moderation reason for articles"
        />
      </Head>

      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>articles {"->"} create moderation reason</TitleHyphen>
        </SectionHeader>

        <Spacing size="6x-large" />

        <main className={cs(layout["padding-big"])}>
          <ClientOnly>
            <UserGuard allowed={(user) => isUserArticleModerator(user as User)}>
              <ModerationReasons moderationContract="article" />
              <Spacing size="3x-large" />
              <CreateModerationReason moderationContract="article" />
            </UserGuard>
          </ClientOnly>
        </main>
      </section>

      <Spacing size="6x-large" />
    </>
  )
}

export default CreateArticleModerationReason
