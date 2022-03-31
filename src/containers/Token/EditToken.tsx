import style from "./EditToken.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { useContext, useEffect } from "react"
import { useRouter } from 'next/router'
import { UserContext } from "../UserProvider"
import { Spacing } from "../../components/Layout/Spacing"
import { Formik } from "formik"
import * as Yup from "yup"
import { Form } from "../../components/Form/Form"
import { Field } from "../../components/Form/Field"
import { Checkbox } from "../../components/Input/Checkbox"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { Button } from "../../components/Button"
import { useContractCall } from "../../utils/hookts"
import { UpdateGenerativeCallData } from "../../types/ContractCalls"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { isPositive } from "../../utils/math"
import { BurnEditions } from "./Edit/BurnEditions"
import { BurnToken } from "./Edit/BurnToken"
import { EditGeneralSettings } from "./Edit/EditGeneralSettings"
import { EditPricing } from "./Edit/EditPricing"
import { isGenerativeAuthor } from "../../utils/generative-token"
import { User } from "../../types/entities/User"


interface Props {
  token: GenerativeToken
}

const validation = Yup.object().shape({
  price: Yup.number()
    .when("enabled", {
      is: true,
      then: Yup.number()
        .typeError("Valid number plz")
        .required("Price is required if token is enabled")
        .test(
          "positive",
          `Price must be >= ${parseFloat(process.env.NEXT_PUBLIC_GT_MIN_PRICE!)}`,
          isPositive
        ),
      otherwise: Yup.number()
        .typeError("Valid number plz")
        .test(
          "positive",
          `Price must be >= ${parseFloat(process.env.NEXT_PUBLIC_GT_MIN_PRICE!)}`,
          isPositive
        )
    }),
  royalties: Yup.number()
    .when("enabled", {
      is: true,
      then: Yup.number()
        .typeError("Valid number plz")
        .required("Royalties are required if token is enabled")
        .min(10, "Min 10%")
        .max(25, "Max 25%"),
      otherwise: Yup.number().positive()
        .typeError("Valid number plz")
        .min(10, "Min 10%")
        .max(25, "Max 25%")
    })
})

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