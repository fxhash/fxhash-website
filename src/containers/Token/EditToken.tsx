import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import {
  GenerativeToken,
  GenTokVersion,
} from "../../types/entities/GenerativeToken"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { useContext, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import { UserContext } from "../UserProvider"
import { Spacing } from "../../components/Layout/Spacing"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { isGenerativeAuthor } from "../../utils/generative-token"
import { User } from "../../types/entities/User"
import { EditTokenPreV3 } from "./Edit/PRE_V3/EditTokenPreV3"
import { EditTokenV3 } from "./Edit/V3/EditTokenV3"

interface Props {
  token: GenerativeToken
}

export function EditToken({ token }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!
  const router = useRouter()

  useEffect(() => {
    if (
      userCtx &&
      userCtx.autoConnectChecked &&
      !isGenerativeAuthor(token, user as User)
    ) {
      router.replace("/")
    }
  }, [user])

  console.log({ token })

  const EditTokenComp = useMemo(
    () =>
      token.version === GenTokVersion.PRE_V3 ? EditTokenPreV3 : EditTokenV3,
    [token.version]
  )

  return (
    <>
      <section className={cs(layout["padding-small"])}>
        <SectionHeader>
          <TitleHyphen>
            edit token <em>{token.name}</em>
          </TitleHyphen>
        </SectionHeader>

        <Spacing size="6x-large" />

        <main className={cs(layout.smallform, layout["padding-big"])}>
          <EditTokenComp token={token} />
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}
