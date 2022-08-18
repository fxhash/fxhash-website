import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { useContext, useEffect } from "react"
import { useRouter } from 'next/router'
import { UserContext } from "../UserProvider"
import { Spacing } from "../../components/Layout/Spacing"
import * as Yup from "yup"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { isPositive } from "../../utils/math"
import { BurnEditions } from "./Edit/BurnEditions"
import { BurnToken } from "./Edit/BurnToken"
import { EditGeneralSettings } from "./Edit/EditGeneralSettings"
import { EditPricing } from "./Edit/EditPricing"
import { isGenerativeAuthor } from "../../utils/generative-token"
import { User } from "../../types/entities/User"
import { EditReserves } from "./Edit/EditReserves"


interface Props {
  token: GenerativeToken
}

export function EditToken({ token }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!
  const router = useRouter()
  
  useEffect(() => {
    if (userCtx 
      && userCtx.autoConnectChecked 
      && !isGenerativeAuthor(token, user as User)
    ) {
      router.replace("/")
    }
  }, [user])

  return (
    <>
      <section className={cs(layout['padding-small'])}>
        <SectionHeader>
          <TitleHyphen>edit token <em>{token.name}</em></TitleHyphen>
        </SectionHeader>

        <Spacing size="6x-large"/>

        <main className={cs(layout.smallform, layout['padding-big'])}>
          <EditGeneralSettings
            token={token}
          />
          <Spacing size="6x-large"/>
          <EditPricing
            token={token}
          />
          <Spacing size="6x-large"/>
          <EditReserves
            token={token}
          />
          <Spacing size="6x-large"/>
          <BurnEditions
            token={token}
          />
          <Spacing size="6x-large"/>
          <Spacing size="6x-large"/>
          <BurnToken
            token={token}
          />
        </main>
      </section>

      <Spacing size="6x-large"/>
      <Spacing size="6x-large"/>
    </>
  )
}